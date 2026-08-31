export type ChapterType = 'chapter' | 'epilogue';

export interface Chapter {
  order: number;
  slug: string;
  type: ChapterType;
  volume: number;
  volumeLabel: string;
  volumeTitle: string;
  label: string;
  title: string;
  body: string;
  excerpt: string;
  readingMinutes: number;
}

export interface ChapterLink {
  order: number;
  slug: string;
  volume: number;
  volumeLabel: string;
  volumeTitle: string;
  label: string;
  title: string;
  readingMinutes: number;
}

export interface Volume {
  number: number;
  label: string;
  title: string;
  summary: string;
  chapters: ChapterLink[];
}

const volumeSummaries = [
  '两个互相视对方为威胁的人，因一次不该发生的救治，被迫进入彼此的生活。',
  '相互监视逐渐变成并肩同行，他们开始把后背与判断交给对方。',
  '真正撕裂关系的不是敌人的谎言，而是敌人揭开的真相。',
  '以陌生人的身份重逢，他们从最基本的边界重新学习信任。',
  '当自由与保护都被写成牢笼，他们拒绝成为别人剧本里的演员。',
];

const chapterFiles = import.meta.glob<string>('../content/chapters/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

function parseScalar(value: string): string | number {
  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith('"')) return JSON.parse(trimmed) as string;
  return trimmed;
}

function parseChapter(raw: string): Chapter {
  const normalized = raw.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Chapter file is missing frontmatter.');

  const metadata: Record<string, string | number> = {};
  for (const line of match[1].split('\n')) {
    const divider = line.indexOf(':');
    if (divider === -1) continue;
    metadata[line.slice(0, divider)] = parseScalar(line.slice(divider + 1));
  }

  const body = match[2]
    .replace(/^# .+\n+/, '')
    .trim();
  const plainText = body
    .replace(/[*_`>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    order: Number(metadata.order),
    slug: String(metadata.slug),
    type: String(metadata.type) as ChapterType,
    volume: Number(metadata.volume),
    volumeLabel: String(metadata.volumeLabel),
    volumeTitle: String(metadata.volumeTitle),
    label: String(metadata.label),
    title: String(metadata.title),
    body,
    excerpt: `${plainText.slice(0, 92)}${plainText.length > 92 ? '……' : ''}`,
    readingMinutes: Math.max(2, Math.ceil(plainText.length / 420)),
  };
}

export const chapters: Chapter[] = Object.values(chapterFiles)
  .map(parseChapter)
  .sort((a, b) => a.order - b.order);

export const chapterLinks: ChapterLink[] = chapters.map(({ body: _body, excerpt: _excerpt, type: _type, ...chapter }) => chapter);

export const volumes: Volume[] = Array.from({ length: 5 }, (_, index) => {
  const number = index + 1;
  const first = chapters.find((chapter) => chapter.volume === number);
  return {
    number,
    label: first?.volumeLabel ?? `卷${number}`,
    title: first?.volumeTitle ?? '',
    summary: volumeSummaries[index],
    chapters: chapterLinks.filter((chapter) => chapter.volume === number && chapter.order <= 30),
  };
});

export function getChapter(slug: string): Chapter | undefined {
  return chapters.find((chapter) => chapter.slug === slug);
}

export function getChapterNeighbors(order: number) {
  return {
    previous: order > 1 ? chapterLinks[order - 2] : undefined,
    next: order < chapterLinks.length ? chapterLinks[order] : undefined,
  };
}
