import { useState, useEffect } from 'react';
import { NEWS_POSTS } from '../newsData.js';
import { initials, tileClass } from '../api.js';

function PostCard({ post, onRead }) {
  const cls = tileClass(post.id);

  return (
    <button
      type="button"
      className="post-card"
      onClick={() => onRead(post)}
      style={{
        textAlign: 'left',
        cursor: 'pointer',
        padding: 0,
        width: '100%',
        color: 'inherit',
        font: 'inherit',
        border: 'none',
        background: 'transparent'
      }}
    >
      <div className={`post-media ${cls}`}>
        <span className="cat">{post.category}</span>
        <span className="glyph">{initials(post.title)}</span>
      </div>

      <div className="post-body">
        <div className="date">{post.date}</div>

        <h3>{post.title}</h3>

        <p>{post.excerpt}</p>

        <span
          style={{
            display: 'inline-block',
            marginTop: 14,
            fontWeight: 700,
            color: 'var(--amber)'
          }}
        >
          Read article →
        </span>
      </div>
    </button>
  );
}

export default function News() {
  const [activeCat, setActiveCat] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);

  const featured =
    NEWS_POSTS.find(post => post.featured) || NEWS_POSTS[0];

  const rest = NEWS_POSTS.filter(
    post => post.id !== featured?.id
  );

  const categories = [
    'All',
    ...new Set(NEWS_POSTS.map(post => post.category))
  ];

  const list =
    activeCat === 'All'
      ? rest
      : rest.filter(post => post.category === activeCat);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [selectedPost]);

  if (selectedPost) {
    return (
      <section style={{ paddingBottom: 80 }}>
        <div
          className="container"
          style={{ maxWidth: 850 }}
        >
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setSelectedPost(null)}
            style={{ marginBottom: 35 }}
          >
            ← Back to News & Updates
          </button>

          <div className="eyebrow">
            {selectedPost.category}
          </div>

          <div
            className="date"
            style={{ marginTop: 15 }}
          >
            {selectedPost.date}
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.3rem)',
              lineHeight: 1.2,
              margin: '20px 0'
            }}
          >
            {selectedPost.title}
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              lineHeight: 1.8,
              marginBottom: 35
            }}
          >
            {selectedPost.excerpt}
          </p>

          <div
            style={{
              borderTop: '1px solid var(--border, #ddd)',
              paddingTop: 30
            }}
          >
            {(selectedPost.content || []).map(
              (paragraph, index) => (
                <p
                  key={index}
                  style={{
                    fontSize: '1rem',
                    lineHeight: 1.9,
                    marginBottom: 22
                  }}
                >
                  {paragraph}
                </p>
              )
            )}
          </div>

          <div
            style={{
              marginTop: 45,
              paddingTop: 25,
              borderTop: '1px solid var(--border, #ddd)'
            }}
          >
            <strong>GameOn Collective</strong>

            <p style={{ marginTop: 8 }}>
              The women's game, in data.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ paddingBottom: 0 }}>
      <div className="container">

        <div className="eyebrow">
          GameOn Collective / News
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 4.6vw, 3.2rem)',
            margin: '16px 0 12px'
          }}
        >
          News & Updates.
        </h1>

        <p
          style={{
            maxWidth: 700,
            lineHeight: 1.8,
            marginBottom: 35
          }}
        >
          Stories from Kenyan women's football.
          Player intelligence, football data and
          performance technology.
        </p>

        {featured && (
          <div className="featured-post">

            <div className="fp-text">

              <div
                className="date"
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '.7rem',
                  color: 'var(--amber)',
                  textTransform: 'uppercase',
                  letterSpacing: '.05em'
                }}
              >
                {featured.category} · {featured.date}
              </div>

              <h2>{featured.title}</h2>

              <p>{featured.excerpt}</p>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedPost(featured)}
              >
                Read story →
              </button>

            </div>

            <div className="fp-media tile-b">
              <span className="glyph">
                {initials(featured.title)}
              </span>
            </div>

          </div>
        )}

        <div className="tabs">
          {categories.map(category => (
            <button
              key={category}
              type="button"
              className={
                activeCat === category ? 'active' : ''
              }
              onClick={() => setActiveCat(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div
          className="grid cols-3"
          style={{ marginBottom: 80 }}
        >
          {list.length ? (
            list.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onRead={setSelectedPost}
              />
            ))
          ) : (
            <div className="empty-state">
              No additional stories in this category yet.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
