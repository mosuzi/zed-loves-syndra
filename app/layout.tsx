import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const vercelSiteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? vercelSiteUrl ?? 'http://localhost:3001';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '《影蚀天穹》｜劫与辛德拉同人长篇',
  description:
    '五卷三十章与尾声：一部关于选择、边界与未被关闭之门的艾欧尼亚同人长篇。',
  openGraph: {
    title: '《影蚀天穹》｜劫与辛德拉同人长篇',
    description:
      '五卷三十章与尾声：一部关于选择、边界与未被关闭之门的艾欧尼亚同人长篇。',
    type: 'website',
    locale: 'zh_CN',
    images: [
      { url: '/og.png', width: 1672, height: 941, alt: '《影蚀天穹》横版封面' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '《影蚀天穹》｜劫与辛德拉同人长篇',
    description:
      '五卷三十章与尾声：一部关于选择、边界与未被关闭之门的艾欧尼亚同人长篇。',
    images: ['/og.png'],
  },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
