'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  ListTree,
  Minus,
  MoonStar,
  Plus,
  Sun,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { ChapterLink } from '@/lib/chapters';

type ReaderTheme = 'gray' | 'night';

interface ReaderShellProps {
  chapter: ChapterLink;
  chapters: ChapterLink[];
  previous?: ChapterLink;
  next?: ChapterLink;
  children: ReactNode;
}

const STORAGE_NAMESPACE = 'zed-loves-syndra';
const LEGACY_STORAGE_NAMESPACE = 'ying-shi-tian-qiong';
const LAST_CHAPTER_KEY = `${STORAGE_NAMESPACE}:last-chapter`;
const THEME_KEY = `${STORAGE_NAMESPACE}:theme`;
const FONT_KEY = `${STORAGE_NAMESPACE}:font-scale`;

function getStoredValue(key: string, legacyKey: string) {
  return (
    window.localStorage.getItem(key) ?? window.localStorage.getItem(legacyKey)
  );
}

function ChapterList({ chapters, currentSlug }: { chapters: ChapterLink[]; currentSlug: string }) {
  const grouped = useMemo(() => {
    const groups = new Map<number, ChapterLink[]>();
    for (const chapter of chapters) {
      groups.set(chapter.volume, [...(groups.get(chapter.volume) ?? []), chapter]);
    }
    return [...groups.entries()];
  }, [chapters]);

  return (
    <nav className="reader-toc" aria-label="章节目录">
      {grouped.map(([volume, items]) => (
        <section key={volume} className="toc-volume">
          <p>{items[0].volumeLabel} · {items[0].volumeTitle}</p>
          <ol>
            {items.map((item) => (
              <li key={item.slug}>
                <a
                  aria-current={item.slug === currentSlug ? 'page' : undefined}
                  href={`/read/${item.slug}`}
                >
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </nav>
  );
}

export function ReaderShell({ chapter, chapters, previous, next, children }: ReaderShellProps) {
  const [theme, setTheme] = useState<ReaderTheme>('gray');
  const [fontScale, setFontScale] = useState(1);
  const [progress, setProgress] = useState(0);
  const [resumeProgress, setResumeProgress] = useState<number | null>(null);

  useEffect(() => {
    const storedTheme = getStoredValue(
      THEME_KEY,
      `${LEGACY_STORAGE_NAMESPACE}:theme`,
    );
    const storedScale = Number(
      getStoredValue(FONT_KEY, `${LEGACY_STORAGE_NAMESPACE}:font-scale`),
    );
    const storedProgress = Number(
      getStoredValue(
        `${STORAGE_NAMESPACE}:progress:${chapter.slug}`,
        `${LEGACY_STORAGE_NAMESPACE}:progress:${chapter.slug}`,
      ),
    );

    if (storedTheme === 'paper' || storedTheme === 'gray') setTheme('gray');
    if (storedTheme === 'night') setTheme('night');
    if (storedScale >= 0.9 && storedScale <= 1.25) setFontScale(storedScale);
    if (storedProgress > 0.05 && storedProgress < 0.93) setResumeProgress(storedProgress);

    window.localStorage.setItem(LAST_CHAPTER_KEY, chapter.slug);
  }, [chapter.slug]);

  useEffect(() => {
    document.documentElement.dataset.readerTheme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
    return () => {
      delete document.documentElement.dataset.readerTheme;
    };
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(FONT_KEY, String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
        setProgress(ratio);
        window.localStorage.setItem(
          `${STORAGE_NAMESPACE}:progress:${chapter.slug}`,
          String(ratio),
        );
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [chapter.slug]);

  useEffect(() => {
    const navigate = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, button, [contenteditable="true"]')) return;
      if (event.altKey && event.key === 'ArrowLeft' && previous) window.location.href = `/read/${previous.slug}`;
      if (event.altKey && event.key === 'ArrowRight' && next) window.location.href = `/read/${next.slug}`;
    };
    window.addEventListener('keydown', navigate);
    return () => window.removeEventListener('keydown', navigate);
  }, [next, previous]);

  const readerStyle = { '--reader-font-scale': fontScale } as CSSProperties;

  const resume = () => {
    if (!resumeProgress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: scrollable * resumeProgress, behavior: 'smooth' });
    setResumeProgress(null);
  };

  return (
    <div className="reader-shell" style={readerStyle}>
      <div className="reading-progress" style={{ transform: `scaleX(${progress})` }} />

      <header className="reader-header">
        <a className="reader-brand" href="/" aria-label="返回作品首页">影蚀天穹</a>
        <div className="reader-location">
          <span>{chapter.volumeLabel} · {chapter.volumeTitle}</span>
          <strong>{chapter.label}</strong>
        </div>
        <div className="reader-header-actions">
          <Sheet>
            <SheetTrigger render={<Button className="mobile-toc-button" variant="ghost" size="icon" aria-label="打开章节目录" />}>
              <ListTree />
            </SheetTrigger>
            <SheetContent side="left" className="reader-sheet">
              <SheetHeader>
                <SheetTitle>章节目录</SheetTitle>
                <SheetDescription>五卷三十章与尾声</SheetDescription>
              </SheetHeader>
              <div className="reader-sheet-scroll">
                <ChapterList chapters={chapters} currentSlug={chapter.slug} />
              </div>
            </SheetContent>
          </Sheet>
          <Button
            variant="ghost"
            size="icon"
            aria-label={theme === 'gray' ? '切换到夜间阅读' : '切换到浅灰阅读'}
            onClick={() => setTheme(theme === 'gray' ? 'night' : 'gray')}
          >
            {theme === 'gray' ? <MoonStar /> : <Sun />}
          </Button>
        </div>
      </header>

      <div className="reader-layout">
        <aside className="reader-sidebar">
          <div className="reader-sidebar-inner">
            <a className="back-to-book" href="/">
              <BookOpenText size={15} aria-hidden="true" /> 返回作品页
            </a>
            <ChapterList chapters={chapters} currentSlug={chapter.slug} />
          </div>
        </aside>

        <main className="reader-main">
          <div className="chapter-heading">
            <p>{chapter.volumeLabel} · {chapter.volumeTitle} · 约 {chapter.readingMinutes} 分钟</p>
            <h1>{chapter.label}：{chapter.title}</h1>
            <span aria-hidden="true" />
          </div>

          {children}

          <nav className="chapter-pagination" aria-label="前后章节">
            {previous ? (
              <a href={`/read/${previous.slug}`} className="chapter-pager previous">
                <ChevronLeft aria-hidden="true" />
                <span><small>上一章</small><strong>{previous.label} · {previous.title}</strong></span>
              </a>
            ) : <span />}
            {next ? (
              <a href={`/read/${next.slug}`} className="chapter-pager next">
                <span><small>下一章</small><strong>{next.label} · {next.title}</strong></span>
                <ChevronRight aria-hidden="true" />
              </a>
            ) : <span />}
          </nav>
        </main>

        <aside className="reader-tools" aria-label="阅读设置">
          <div>
            <span>字号</span>
            <div className="font-controls">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="减小字号"
                disabled={fontScale <= 0.9}
                onClick={() => setFontScale((value) => Math.max(0.9, Number((value - 0.05).toFixed(2))))}
              ><Minus /></Button>
              <strong>{Math.round(fontScale * 100)}%</strong>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="增大字号"
                disabled={fontScale >= 1.25}
                onClick={() => setFontScale((value) => Math.min(1.25, Number((value + 0.05).toFixed(2))))}
              ><Plus /></Button>
            </div>
          </div>
          <p>按 Alt＋← / → 切换章节</p>
        </aside>
      </div>

      {resumeProgress !== null && (
        <button className="resume-reading" type="button" onClick={resume}>
          继续上次位置 · {Math.round(resumeProgress * 100)}%
        </button>
      )}
    </div>
  );
}
