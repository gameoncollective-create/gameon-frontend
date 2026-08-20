import { useState } from 'react';
import { NEWS_POSTS } from '../newsData.js';
import { initials, tileClass } from '../api.js';

function PostCard({ post }) {
  const cls = tileClass(post.id);
  return (
    <div className="post-card">
      <div className={`post-media ${cls}`}>
        <span className="cat">{post.category}</span>
        <span className="glyph">{initials(post.title)}</span>
      </div>
      <div className="post-body">
        <div className="date">{post.date}</div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
      </div>
    </div>
  );
}

export default function News() {
  const featured = NEWS_POSTS.find(p => p.featured) || NEWS_POSTS[0];
  const rest = NEWS_POSTS.filter(p => p.id !== featured.id);
  const categories = ['All', ...new Set(NEWS_POSTS.map(p => p.category))];
  const [activeCat, setActiveCat] = useState('All');
  const list = activeCat === 'All' ? rest : rest.filter(p => p.category === activeCat);

  return (
    <section style={{ paddingBottom: 0 }}>
      <div className="container">
        <div className="eyebrow">News &amp; Blog</div>
        <h1 style={{ fontSize: 'clamp(2.2rem,4.6vw,3.2rem)', margin: '16px 0 32px' }}>Stories from Kenya women's football.</h1>

        <div className="featured-post">
          <div className="fp-text">
            <div className="date" style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              {featured.category} · {featured.date}
            </div>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <button className="btn btn-outline">Read story →</button>
          </div>
          <div className="fp-media tile-b"><span className="glyph">{initials(featured.title)}</span></div>
        </div>

        <div className="tabs">
          {categories.map(c => (
            <button key={c} className={activeCat === c ? 'active' : ''} onClick={() => setActiveCat(c)}>{c}</button>
          ))}
        </div>

        <div className="grid cols-3" style={{ marginBottom: 80 }}>
          {list.length ? list.map(p => <PostCard key={p.id} post={p} />) : <div className="empty-state">No stories in this category yet.</div>}
        </div>
      </div>
    </section>
  );
}
