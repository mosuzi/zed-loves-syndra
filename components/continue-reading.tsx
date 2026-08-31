'use client';

import { useEffect, useState } from 'react';
import { BookOpenText } from 'lucide-react';

import type { ChapterLink } from '@/lib/chapters';

const LAST_CHAPTER_KEY = 'ying-shi-tian-qiong:last-chapter';

export function ContinueReading({ chapters }: { chapters: ChapterLink[] }) {
  const [chapter, setChapter] = useState(chapters[0]);

  useEffect(() => {
    const savedSlug = window.localStorage.getItem(LAST_CHAPTER_KEY);
    const saved = chapters.find((item) => item.slug === savedSlug);
    if (saved) setChapter(saved);
  }, [chapters]);

  return (
    <a className="primary-action continue-action" href={`/read/${chapter.slug}`}>
      <BookOpenText aria-hidden="true" size={17} />
      <span>{chapter.order === 1 ? '从第一章开始' : `继续阅读 · ${chapter.label}`}</span>
    </a>
  );
}
