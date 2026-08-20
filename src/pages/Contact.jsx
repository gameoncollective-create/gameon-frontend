import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // Not wired to a real backend yet — connect to POST /api/contact
    // once that endpoint exists.
    setSent(true);
    e.target.reset();
  }

  return (
    <section style={{ paddingBottom: 96 }}>
      <div className="container">
        <div className="eyebrow">Contact</div>
        <h1 style={{ fontSize: 'clamp(2.2rem,4.6vw,3.2rem)', margin: '16px 0 32px' }}>Let's talk.</h1>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="item"><div className="label">Email</div><div className="val">nginda@gameoncollective.com</div></div>
            <div className="item"><div className="label">Based in</div><div className="val">Nairobi, Kenya</div></div>
            <div className="item"><div className="label">For</div><div className="val">Clubs · Federations · Brand partners · Media</div></div>
            <div className="item">
              <div className="label">Follow</div>
              <div className="val" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a href="https://www.instagram.com/gameoncollective" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://www.youtube.com/@GameOnCollective" target="_blank" rel="noopener noreferrer">YouTube</a>
                <a href="https://www.linkedin.com/company/107606595/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://web.facebook.com/profile.php?id=61577704242732" target="_blank" rel="noopener noreferrer">Facebook</a>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field"><label>Name</label><input required name="name" placeholder="Your name" /></div>
                <div className="form-field"><label>Email</label><input required type="email" name="email" placeholder="you@example.com" /></div>
              </div>
              <div className="form-row">
                <div className="form-field" style={{ gridColumn: '1/-1' }}>
                  <label>I'm reaching out as a…</label>
                  <select name="role">
                    <option>Club</option><option>Federation</option><option>Brand / Partner</option>
                    <option>Player</option><option>Media</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-field" style={{ marginBottom: 16 }}>
                <label>Message</label>
                <textarea required name="message" placeholder="Tell us a bit about what you're looking for…" />
              </div>
              <button type="submit" className="btn btn-primary">Send message →</button>
              {sent && (
                <div className="form-success show">Thanks — your message has been noted. We'll get back to you soon.</div>
              )}
              <p className="form-note">
                This form isn't wired to a mail server yet — connect it to a <code>POST /api/contact</code> endpoint on the backend to receive submissions for real.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}