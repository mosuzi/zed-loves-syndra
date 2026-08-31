import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(projectRoot, '..', '《影蚀天穹》连续叙事版章节详纲.md');
const contentRoot = path.join(projectRoot, 'content');
const chapterRoot = path.join(contentRoot, 'chapters');
const sourceArchive = path.join(contentRoot, 'source', '《影蚀天穹》连续叙事版章节详纲.md');

const slugs = [
  'tian-qiong-shang-de-qiu-tu',
  'ying-zi-chuang-ru-tian-kong',
  'yan-chi-er-lai-de-shang',
  'gong-tong-de-zhui-bing',
  'kai-zhe-de-lao-men',
  'yong-you-liang-zhong-li-liang-de-shi-ti',
  'mei-you-chu-kou-de-tan-pan',
  'bai-wu-xuan-kong',
  'kong-ju-you-xing',
  'mei-you-di-mian-de-ye-wan',
  'di-si-sheng-pai-zi',
  'bu-bei-cheng-ren-de-tong-meng',
  'xie-gei-gui-zi-shou-de-yu-an',
  'ying-feng-de-ling-yi-duan',
  'jie-qing-zhong-de-si-mu',
  'san-xi',
  'ni-reng-shi-wo-de-yu-zu',
  'ge-zi-de-wang-zuo',
  'jun-heng-de-sha-ling',
  'ying-liu-lan-lu',
  'lai-sha-ni-de-ren',
  'mo-sheng-ren-ti-mo-sheng-ren-zhi-xue',
  'bei-wei-zao-de-fen-nu',
  'mei-you-bi-yao-de-lao-long',
  'hei-ri-zhi-ji',
  'kai-yin-de-xuan-ze',
  'di-si-mu-de-yan-yuan',
  'jie-de-zui-hou-yi-ge-hou-shou',
  'xin-de-la-rang-tian-kong-ting-zhu',
  'mei-you-he-jie-de-li-ming',
  'men-kan-zhi-wai',
];

const volumeByOrder = (order) => (order <= 30 ? Math.ceil(order / 6) : 5);
const volumeNames = ['黑日初坠', '影中同行', '三息之牢', '无伤之印', '影蚀天穹'];
const volumeLabels = ['卷一', '卷二', '卷三', '卷四', '卷五'];

function quote(value) {
  return JSON.stringify(value);
}

function flush(items, current) {
  if (!current) return;
  current.body = current.lines.join('\n').trim();
  delete current.lines;
  items.push(current);
}

const source = await readFile(sourcePath, 'utf8');
const lines = source.replace(/\r\n/g, '\n').split('\n');
const items = [];
let current = null;

for (const line of lines) {
  const chapterMatch = line.match(/^## (第.+章)：(.+)$/);
  const epilogueMatch = line.match(/^# 尾声：(.+)$/);

  if (chapterMatch) {
    flush(items, current);
    current = {
      label: chapterMatch[1],
      title: chapterMatch[2],
      type: 'chapter',
      lines: [],
    };
    continue;
  }

  if (epilogueMatch) {
    flush(items, current);
    current = {
      label: '尾声',
      title: epilogueMatch[1],
      type: 'epilogue',
      lines: [],
    };
    continue;
  }

  if (current && !/^# 第[一二三四五]卷：/.test(line)) current.lines.push(line);
}

flush(items, current);

if (items.length !== 31) {
  throw new Error(`Expected 31 chapter sections, found ${items.length}.`);
}

await mkdir(chapterRoot, { recursive: true });
await mkdir(path.dirname(sourceArchive), { recursive: true });
await copyFile(sourcePath, sourceArchive);

for (const [index, item] of items.entries()) {
  const order = index + 1;
  const volume = volumeByOrder(order);
  const slug = slugs[index];
  const filename = `${String(order).padStart(2, '0')}-${slug}.md`;
  const titleLine = item.type === 'epilogue'
    ? `# 尾声：${item.title}`
    : `# ${item.label}：${item.title}`;
  const output = [
    '---',
    `order: ${order}`,
    `slug: ${quote(slug)}`,
    `type: ${quote(item.type)}`,
    `volume: ${volume}`,
    `volumeLabel: ${quote(volumeLabels[volume - 1])}`,
    `volumeTitle: ${quote(volumeNames[volume - 1])}`,
    `label: ${quote(item.label)}`,
    `title: ${quote(item.title)}`,
    '---',
    '',
    titleLine,
    '',
    item.body,
    '',
  ].join('\n');

  await writeFile(path.join(chapterRoot, filename), output, 'utf8');
}

console.log(`Created ${items.length} chapter files in ${chapterRoot}`);
