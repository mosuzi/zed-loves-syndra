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

function parseSiteUrl(value: string | undefined) {
  const normalizedValue = value?.trim();
  if (!normalizedValue) return undefined;

  const urlValue = /^https?:\/\//i.test(normalizedValue)
    ? normalizedValue
    : `https://${normalizedValue}`;

  try {
    return new URL(urlValue);
  } catch {
    return undefined;
  }
}

const metadataBase =
  parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  parseSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  new URL('http://localhost:3001');

export const metadata: Metadata = {
  metadataBase,
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
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      {
        url: '/zed-loves-syndra-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
