import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, AlertOctagon, RefreshCw, FolderOpen } from 'lucide-react';

const NotFound = ({ playSound, isMuted }) => {
  const navigate = useNavigate();
  const [glitchText, setGlitchText] = useState('ERROR_404');
  const [terminalLogs, setTerminalLogs] = useState([]);

  // Typewriter effect for terminal logs
  useEffect(() => {
    const logs = [
      '> INITIATING ROUTING DIAGNOSTICS...',
      '> SCANNING CYBERSPACE FOR MAKHANA DRIP... [FAILED]',
      '> CHECKING BESTIE\'S COORDINATES... [OFF THE GRID]',
      '> STATUS: S-TIER SNACKING SESSION EXPIRED 💀',
      '> INITIATING RETRO SAFE REBOOT PANEL...'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setTerminalLogs(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
        if (playSound) playSound('click', isMuted);
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [playSound, isMuted]);

  // Glitch effect on the error text
  useEffect(() => {
    const glitchPhrases = ['ERROR_404', 'OUT_OF_BOUNDS', 'SNACK_CRITICAL_ERR', 'GRID_LOST_👾', '404_PAGE_MISSING'];
    const interval = setInterval(() => {
      const randomPhrase = glitchPhrases[Math.floor(Math.random() * glitchPhrases.length)];
      setGlitchText(randomPhrase);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px',
        backgroundColor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: 'var(--neo-border)'
      }}
    >
      {/* Background Grid Pattern */}
      <div 
        className="y2k-grid" 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.15, 
          pointerEvents: 'none' 
        }} 
      />

      {/* Cyber Shape elements */}
      <div 
        className="organic-blob animate-float-slow desktop-only" 
        style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: '100px',
          height: '100px',
          background: 'var(--theme-accent, #a3e635)',
          opacity: 0.25,
          zIndex: 0
        }}
      />
      <div 
        className="y2k-starburst animate-rotate desktop-only" 
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '8%',
          fontSize: '4rem',
          color: 'var(--theme-secondary, #ec4899)',
          opacity: 0.3,
          zIndex: 0
        }}
      >
        ✦
      </div>

      {/* Retro OS Pop-up Dialog */}
      <div
        className="neo-box"
        style={{
          maxWidth: '680px',
          width: '100%',
          backgroundColor: '#faf6f0', // Creamy brutalist card bg
          color: '#000000',
          position: 'relative',
          zIndex: 2,
          padding: 0,
          borderRadius: '4px',
          boxShadow: '10px 10px 0px #000',
          overflow: 'hidden'
        }}
      >
        {/* Retro Header Bar */}
        <div
          style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: '10px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'var(--font-tech)',
            fontSize: '0.85rem',
            fontWeight: 900,
            letterSpacing: '1px',
            borderBottom: 'var(--neo-border-thin)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💾</span>
            <span>SYSTEM32\CRITICAL_ERROR.EXE</span>
          </div>
          {/* Retro Window buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', border: '1px solid #000', borderRadius: '50%' }} />
            <div style={{ width: '12px', height: '12px', backgroundColor: '#eab308', border: '1px solid #000', borderRadius: '50%' }} />
            <div style={{ width: '12px', height: '12px', backgroundColor: '#22c55e', border: '1px solid #000', borderRadius: '50%' }} />
          </div>
        </div>

        {/* Marquee message */}
        <div
          style={{
            backgroundColor: 'var(--theme-accent, #a3e635)',
            borderBottom: 'var(--neo-border-thin)',
            padding: '6px 12px',
            fontFamily: 'var(--font-tech)',
            fontWeight: 800,
            fontSize: '0.8rem',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            display: 'flex',
            gap: '30px'
          }}
        >
          <span style={{ animation: 'marquee 15s linear infinite', display: 'inline-block' }}>
            SYSTEM FAIL // {glitchText} // BESTIE IS OFF THE GRID // SNACKING SESSION EXPIRED 📟 // SYSTEM FAIL // {glitchText} // BESTIE IS OFF THE GRID // SNACKING SESSION EXPIRED 📟 //
          </span>
        </div>

        {/* Main Content Area */}
        <div style={{ padding: '36px 30px' }}>
          
          {/* Giant 404 Glitch Number */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <AlertOctagon size={48} style={{ color: '#ef4444', flexShrink: 0 }} />
            <h1 
              className="y2k-chrome-text" 
              style={{
                fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
                fontWeight: 900,
                lineHeight: 0.9,
                margin: 0,
                fontFamily: 'var(--font-header)',
                textShadow: '4px 4px 0 #000',
                filter: 'drop-shadow(2px 2px 0px #000)'
              }}
            >
              404
            </h1>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-header)',
              fontSize: '1.6rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: '#ef4444',
              marginBottom: '14px',
              letterSpacing: '-0.02em',
              textAlign: 'left'
            }}
          >
            Bestie, you've wandered off the grid 👾
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              fontWeight: 600,
              lineHeight: 1.5,
              color: '#374151',
              marginBottom: '28px',
              textAlign: 'left'
            }}
          >
            The path you typed does not contain any premium makhana or S-tier vibes. Our diagnostics report that your snacking session has expired or the grid took a screenshot of a void.
          </p>

          {/* Monospace Interactive Diagnostic Terminal */}
          <div
            className="neo-box"
            style={{
              backgroundColor: '#000000',
              color: '#22c55e', // Cyber terminal green
              padding: '16px 20px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              textAlign: 'left',
              marginBottom: '32px',
              minHeight: '140px',
              border: 'var(--neo-border-thin)',
              boxShadow: '4px 4px 0 #000',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            {terminalLogs.map((log, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {idx === terminalLogs.length - 1 && idx < 4 ? (
                  <RefreshCw size={12} className="animate-spin" style={{ color: '#22c55e' }} />
                ) : null}
                <span>{log}</span>
              </div>
            ))}
            {terminalLogs.length < 5 && (
              <span className="animate-pulse">_</span>
            )}
          </div>

          {/* Action Buttons Panel */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            {/* Catalog Redirection Button */}
            <button
              className="neo-btn"
              onClick={() => {
                if (playSound) playSound('crunch', isMuted);
                navigate('/catalog');
              }}
              onMouseEnter={() => {
                if (playSound) playSound('hover', isMuted);
              }}
              style={{
                backgroundColor: 'var(--theme-accent, #a3e635)',
                color: '#000000',
                padding: '14px 24px',
                fontSize: '1rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <FolderOpen size={18} />
              <span>GO BACK TO CATALOG ✦</span>
            </button>

            {/* Home Redirection Button */}
            <button
              className="neo-btn"
              onClick={() => {
                if (playSound) playSound('laser', isMuted);
                navigate('/');
              }}
              onMouseEnter={() => {
                if (playSound) playSound('hover', isMuted);
              }}
              style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                padding: '14px 24px',
                fontSize: '1rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Terminal size={18} />
              <span>REBOOT TO HOME 👾</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NotFound;
