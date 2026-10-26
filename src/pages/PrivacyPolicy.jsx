export default function PrivacyPolicy() {
  return (
    <section style={{ paddingBottom: 96 }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="eyebrow">Legal</div>
        <h1 style={{ fontSize: 'clamp(2.2rem,4.6vw,3.2rem)', margin: '16px 0 10px' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-dim)', fontFamily: 'var(--mono)', fontSize: '.8rem', marginBottom: 40 }}>Last updated: 26 October 2026</p>

        <div style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: 1.75 }}>
          <p>GameOn Collective ("GameOn", "we", "us") is based in Nairobi, Kenya. This policy explains what information we collect through gameoncollective.com, why we collect it, and what rights you have over it.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>What we collect</h2>
          <p><b>If you create an account:</b> your email address and a securely hashed password. We never store your password in readable form.</p>
          <p><b>If you use our contact form:</b> your name, email address, the role you selected, and your message, which is delivered to us by our form provider so we can reply.</p>
          <p><b>If you browse the site:</b> basic usage data through Google Analytics — pages viewed, general location (country/city level), device type, and how you arrived at the site. Google Analytics uses cookies to do this; see "Cookies" below.</p>
          <p><b>If you're an athlete in our performance program:</b> GPS and performance data (distance, speed, sprints, workload) collected directly through signed athlete agreements, not through the public website.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Why we collect it</h2>
          <p>To run your account and the features you sign up for; to respond when you contact us; to understand how people use the site so we can improve it; and, for athletes in our program, to provide performance tracking and build their player profiles, under the terms of their individual agreements with us.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Where it's stored</h2>
          <p>Account data is stored with Supabase (hosted in Ireland, within the EU). Contact form submissions pass through our form provider's infrastructure. Analytics data is processed by Google. We don't sell your data to anyone, and we don't share it with third parties beyond the service providers named here who help us run the site.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Cookies</h2>
          <p>We use Google Analytics cookies to understand site traffic. You can decline these using the cookie banner when you first visit, or block them anytime through your browser settings. Declining doesn't affect your ability to use the site.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Your rights</h2>
          <p>Under Kenya's Data Protection Act, 2019, you can ask us to show you what data we hold about you, correct it, or delete it. Email <a href="mailto:nginda@gameoncollective.com">nginda@gameoncollective.com</a> and we'll respond as quickly as we can. You can also lodge a complaint with Kenya's Office of the Data Protection Commissioner (ODPC) if you believe your data has been mishandled.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Children</h2>
          <p>GameOn Collective's website is not directed at children, and we don't knowingly collect personal data from anyone under 18 through the public site. Our athlete program works with footballers under agreements signed with the appropriate consent for their circumstances.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Changes to this policy</h2>
          <p>If we materially change how we handle your data, we'll update this page and change the date above.</p>

          <h2 style={{ color: 'var(--text)', marginTop: 36, marginBottom: 12 }}>Contact</h2>
          <p>Questions about this policy or your data: <a href="mailto:nginda@gameoncollective.com">nginda@gameoncollective.com</a>.</p>
        </div>
      </div>
    </section>
  );
}
