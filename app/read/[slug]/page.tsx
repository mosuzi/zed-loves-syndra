import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';

import { ReaderShell } from '@/components/reader-shell';
import { chapterLinks, chapters, getChapter, getChapterNeighbors } from '@/lib/chapters';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return chapterLinks.map((chapter) => ({ slug: chapter.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) return { title: '章节未找到｜影蚀天穹' };

  const title = `${chapter.label}：${chapter.title}｜影蚀天穹`;
  return {
    title,
    description: chapter.excerpt,
    openGraph: { title, description: chapter.excerpt, images: [] },
    twitter: { card: 'summary', title, description: chapter.excerpt, images: [] },
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params;
  const chapter = getChapter(slug);

  if (!chapter) {
    return (
      <main className="missing-chapter">
        <p>这道影路没有通向任何篇章。</p>
        <a href="/">返回卷册目录</a>
      </main>
    );
  }

  const { previous, next } = getChapterNeighbors(chapter.order);
  const chapterLink = chapterLinks[chapter.order - 1];

  return (
    <ReaderShell
      chapter={chapterLink}
      chapters={chapterLinks}
      previous={previous}
      next={next}
    >
      <article className="chapter-prose">
        <ReactMarkdown>{chapter.body}</ReactMarkdown>
      </article>
    </ReaderShell>
  );
}
