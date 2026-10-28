import { useState } from 'react';
import { trackEvent } from '../analytics.js';

// Form submissions are delivered to our inbox by Web3Forms
// (https://web3forms.com). The access key lives in the Vercel environment
// variable VITE_WEB3FORMS_KEY. Without it, the form falls back to opening the
// visitor's email app with their message filled in, so no message is lost.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const CONTACT_EMAIL = 'nginda@gameoncollective.com';

export default function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const fields = Object.fromEntries(new FormData(form).entries());

    if (fields.botcheck) return; // spam bot filled the hidden field

    if (!WEB3FORMS_KEY) {
      const body = `${fields.message}\n\n— ${fields.name} (${fields.role})\n${fields.email}`;
      window.location.href =
        `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Website enquiry — ' + fields.role)}` +
        `&body=${encodeURIComponent(body)}`;
      trackEvent('generate_lead', { method: 'mailto', role: fields.role });
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New website enquiry — ${fields.role}`,
          from_name: 'GameOn Collective website',
          name: fields.name,
          email: fields.email,
          role: fields.role,
          message: fields.message,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Send failed');
      setStatus('sent');
      form.reset();
      trackEvent('generate_lead', { method: 'contact_form', role: fields.role });
    } catch (err) {
      setStatus('error');
      trackEvent('contact_form_error', { message: String(err.message || err).slice(0, 100) });
    }
  }

  return (
    <section style={{ paddingBottom: 96 }}>
      <div className="container">
        <div className="eyebrow">Contact</div>
        <h1 style={{ fontSize: 'clamp(2.2rem,4.6vw,3.2rem)', margin: '16px 0 32px' }}>Let's talk.</h1>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="item"><div className="label">Email</div><div className="val"><a href={`mailto:${CONTACT_EMAIL}`} onClick={() => trackEvent('email_click', { location: 'contact_page' })}>{CONTACT_EMAIL}</a></div></div>
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
              <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} aria-hidden="true" />
              <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message →'}
              </button>
              {status === 'sent' && (
                <div className="form-success show">Thanks — your message has reached us. We'll get back to you soon.</div>
              )}
              {status === 'error' && (
                <div className="form-success show">
                  Sorry, your message didn't go through. Please email us directly at{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}