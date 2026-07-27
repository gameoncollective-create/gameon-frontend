export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Anton", "Arial Black", sans-serif',
      padding: '30px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Subtle grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.5
      }}></div>

      <div style={{ 
        maxWidth: '900px', 
        position: 'relative', 
        zIndex: 1 
      }}>
        
        {/* Main Title */}
        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 90px)',
          fontWeight: 'bold',
          lineHeight: '1.1',
          letterSpacing: '3px',
          margin: 0,
          padding: 0
        }}>
          <span style={{ color: '#ffffff' }}>KENYA'S</span><br />
          <span style={{ color: '#00ff41' }}>WOMEN'S</span><br />
          <span style={{ color: '#ffffff' }}>FOOTBALL</span><br />
          <span style={{ color: '#00ff41' }}>INTELLIGENCE</span><br />
          <span style={{ color: '#ffffff' }}>HUB</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          color: '#aaaaaa',
          fontSize: 'clamp(16px, 1.8vw, 22px)',
          fontFamily: 'Arial, sans-serif',
          maxWidth: '600px',
          margin: '30px auto 40px',
          lineHeight: '1.8',
          letterSpacing: '1px'
        }}>
          Player stats. Team profiles. GPS tracking. Scouting insights.
        </p>

        {/* Social Links - with your URLs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '35px',
          flexWrap: 'wrap',
          marginTop: '10px'
        }}>
          <a 
            href="https://www.instagram.com/gameoncollective" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#00ff41', fontSize: '20px', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', letterSpacing: '1px' }}
          >
            INSTAGRAM
          </a>
          <a 
            href="https://www.youtube.com/@GameOnCollective" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#00ff41', fontSize: '20px', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', letterSpacing: '1px' }}
          >
            YOUTUBE
          </a>
          <a 
            href="https://www.linkedin.com/company/107606595/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#00ff41', fontSize: '20px', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', letterSpacing: '1px' }}
          >
            LINKEDIN
          </a>
          <a 
            href="https://web.facebook.com/profile.php?id=61577704242732" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#00ff41', fontSize: '20px', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', letterSpacing: '1px' }}
          >
            FACEBOOK
          </a>
        </div>

        {/* Contact - Email */}
        <div style={{
          marginTop: '30px'
        }}>
          <a 
            href="mailto:info@gameoncollective.com" 
            style={{ color: '#00ff41', fontSize: '18px', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', letterSpacing: '1px' }}
          >
            ✉️ @gameoncollective@gmail.com
          </a>
        </div>

        {/* Footer */}
        <div style={{
          color: '#333333',
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
          borderTop: '1px solid #1a1a1a',
          paddingTop: '25px',
          marginTop: '40px'
        }}>
          © 2026 GameOn Collective. All rights reserved.
        </div>
      </div>
    </div>
  );
}
