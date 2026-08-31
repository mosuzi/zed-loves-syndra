import { ContinueReading } from '@/components/continue-reading';
import { chapterLinks, volumes } from '@/lib/chapters';

export default function Home() {
  return (
    <main className="home-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="返回顶部">影蚀天穹</a>
        <nav aria-label="主要导航">
          <a href="#about">故事</a>
          <a href="#catalog">目录</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">劫 × 辛德拉 · 艾欧尼亚同人长篇</p>
          <h1>影蚀<br />天穹</h1>
          <p className="hero-lede">
            一个习惯替所有人作出选择的人，遇见了一个宁可毁掉世界，
            也不肯再让别人替自己选择的人。
          </p>
          <div className="hero-actions">
            <ContinueReading chapters={chapterLinks} />
            <a className="text-action" href="#catalog">查看完整目录</a>
          </div>
          <dl className="story-stats" aria-label="作品信息">
            <div><dt>卷册</dt><dd>5 卷</dd></div>
            <div><dt>篇章</dt><dd>30 章＋尾声</dd></div>
            <div><dt>叙事</dt><dd>近距离第三人称</dd></div>
          </dl>
        </div>

        <figure className="hero-cover">
          <img src="/og.png" alt="《影蚀天穹》封面：暗紫天幕下，黑色天体悬于山峦之上" />
          <figcaption>选择 · 边界 · 未被关闭之门</figcaption>
        </figure>
      </section>

      <section className="about-section" id="about">
        <p className="section-kicker">故事核心</p>
        <div className="about-grid">
          <h2>这不是驯服，<br />也不是救赎。</h2>
          <div className="about-copy">
            <p>
              艾欧尼亚各方都在争论应该杀死、囚禁还是利用辛德拉时，劫选择接近她。
              他用影子缝合她的伤，也在同一条影线里留下了追踪与封印的可能。
            </p>
            <p>
              当保护与控制再也无法混为一谈，他们必须决定：理解是否足以跨过伤害，
              而自由是否只能靠毁灭证明。
            </p>
          </div>
        </div>
      </section>

      <section className="catalog-section" id="catalog">
        <div className="section-heading">
          <div>
            <p className="section-kicker">五卷三十章</p>
            <h2>卷册目录</h2>
          </div>
          <p>每章独立存放为 Markdown，网页会记住你最后读到的篇章与位置。</p>
        </div>

        <div className="volume-list">
          {volumes.map((volume) => (
            <section className="volume-card" key={volume.number}>
              <div className="volume-card-heading">
                <span className="volume-index">{String(volume.number).padStart(2, '0')}</span>
                <div>
                  <p>{volume.label} · {volume.chapters[0].label}—{volume.chapters.at(-1)?.label}</p>
                  <h3>{volume.title}</h3>
                </div>
                <p className="volume-summary">{volume.summary}</p>
              </div>

              <ol className="home-chapter-list">
                {volume.chapters.map((chapter) => (
                  <li key={chapter.slug}>
                    <a href={`/read/${chapter.slug}`}>
                      <span>{chapter.label}</span>
                      <strong>{chapter.title}</strong>
                      <small>{chapter.readingMinutes} 分钟</small>
                    </a>
                  </li>
                ))}
                {volume.number === 5 && (
                  <li>
                    <a href="/read/men-kan-zhi-wai">
                      <span>尾声</span>
                      <strong>门槛之外</strong>
                      <small>{chapterLinks.at(-1)?.readingMinutes} 分钟</small>
                    </a>
                  </li>
                )}
              </ol>
            </section>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <span>《影蚀天穹》</span>
        <span>一部关于选择、边界与未被关闭之门的故事</span>
      </footer>
    </main>
  );
}
