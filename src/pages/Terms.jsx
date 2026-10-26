export default function Terms() {
  return (
    <section style={{ paddingBottom: 96 }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="eyebrow">Legal</div>
        <h1 style={{ fontSize: 'clamp(2.2rem,4.6vw,3.2rem)', margin: '16px 0 10px' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-dim)', fontFamily: 'var(--mono)', fontSize: '.8rem', marginBottom: 40 }}>Last updated: 26 October 2026</p>

        <div style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: 1.75 }}>
          <p>These terms cover your use of gameoncollective.com, operated by GameOn Collective from Nairobi, Kenya. By using the site, you agree to them.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>What we provide</h2>
          <p>GameOn Collective is a data platform for Kenya's women's football — player and club profiles, league standings, and performance data — along with athlete development and media services we provide directly to selected players and clubs.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Accounts</h2>
          <p>If you create an account, you're responsible for keeping your login details secure and for activity under your account. Let us know right away at <a href="mailto:nginda@gameoncollective.com">nginda@gameoncollective.com</a> if you think it's been compromised.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Acceptable use</h2>
          <p>Don't scrape, resell, or redistribute our data at scale without asking us first, don't misuse the contact form or API key system, and don't use the site in a way that could harm GameOn, our athletes, or other users.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Data accuracy</h2>
          <p>We work to keep player, team, and match data accurate and up to date, and we correct errors when they're flagged to us. That said, the data is provided "as is" — we can't guarantee it's error-free or complete at every moment, especially for a fast-moving, manually-tracked grassroots league.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Intellectual property</h2>
          <p>The GameOn Collective name, logo, and original content (writing, graphics, photography we produce) belong to us. Player and club data reflects publicly observable match results and performance information we compile and verify.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Limitation of liability</h2>
          <p>GameOn Collective is provided as-is, without warranties of any kind. To the extent permitted by Kenyan law, we aren't liable for decisions made based on data from this site, such as scouting or recruitment decisions.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Changes</h2>
          <p>We may update these terms as the platform grows. We'll update the date above when we do, and significant changes will be noted on the site.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Governing law</h2>
          <p>These terms are governed by the laws of Kenya.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Contact</h2>
          <p>Questions about these terms: <a href="mailto:nginda@gameoncollective.com">nginda@gameoncollective.com</a>.</p>
        </div>
      </div>
    </section>
  );
}
