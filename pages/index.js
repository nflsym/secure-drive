import { useState, useEffect, useRef } from "react";
import Head from "next/head";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [status, setStatus] = useState({ state: 'idle', heading: 'Idle', sub: 'Awaiting file selection' });
  const [progress, setProgress] = useState(0);
  const [logs, setLog] = useState([{ time: '--', msg: 'System initialized.', type: '' }]);
  const [sessionId, setSessionId] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    setSessionId('SCD-' + Math.random().toString(36).substr(2, 8).toUpperCase());
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const addLog = (msg, type = '') => {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setLog(prev => [{ time, msg, type }, ...prev].slice(0, 10));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
    setStatus({ state: 'ready', heading: 'Ready', sub: `${newFiles.length + files.length} file(s) queued` });
    newFiles.forEach(f => addLog(`Queued: ${f.name}`));
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    addLog(`Removed item`, 'err');
    if (updatedFiles.length === 0) setStatus({ state: 'idle', heading: 'Idle', sub: 'Awaiting file selection' });
  };

  const uploadFiles = async () => {
    if (uploading || files.length === 0) return;
    setUploading(true);
    setProgress(0);
    setStatus({ state: 'uploading', heading: 'Uploading...', sub: 'Transferring to Drive' });

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      addLog(`Uploading: ${f.name}`);
      const formData = new FormData();
      formData.append('file', f);

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) addLog(`Transferred: ${f.name}`, 'ok');
        else throw new Error(data.error);
      } catch (err) {
        addLog(`Error: ${err.message}`, 'err');
      }
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setStatus({ state: 'success', heading: 'Success', sub: 'Upload complete' });
    setTimeout(() => { setFiles([]); setUploading(false); setProgress(0); }, 3000);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
  };

  return (
    <div className="app-container">
      <Head>
        <title>SECURE CLOUD DROP</title>
        <link rel="icon" href="https://upload.wikimedia.org/wikipedia/commons/d/d5/Google_Gemma_logo.svg" />
      </Head>

      <div className="space-bg">
        <div className="star-field">
          {[...Array(12)].map((_, i) => <div key={i} className="shooting-star"></div>)}
        </div>
      </div>

      <header className="header">
        <div className="header-source">
          <div className="dot"></div>
          <span className="brand-text">GOOGLE DRIVE</span>
        </div>
        <div className="header-right">
          <div className="toggle-wrap">
            <span>{theme.toUpperCase()}</span>
            <div className={`toggle ${theme === 'dark' ? 'on' : ''}`} onClick={toggleTheme}></div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="layout">
          <div className="left-panel">
            <div className="brand-group">
              <div className="badge"><div className="badge-dot"></div> OAUTH SECURED · AES-256</div>
              <h1 className="main-title">SECURE <span className="accent-word">CLOUD</span> DROP</h1>
              <p className="subtitle">Upload files directly to Drive without login.</p>
            </div>

            <div className="upload-panel">
              <div className="panel-corner tl"><svg width="20" height="20"><line x1="0" y1="0" x2="0" y2="16" stroke="currentColor"/><line x1="0" y1="0" x2="16" y2="0" stroke="currentColor"/></svg></div>
              <div className="panel-corner tr"><svg width="20" height="20"><line x1="20" y1="0" x2="20" y2="16" stroke="currentColor"/><line x1="20" y1="0" x2="4" y2="0" stroke="currentColor"/></svg></div>
              <div className="panel-corner bl"><svg width="20" height="20"><line x1="0" y1="20" x2="0" y2="4" stroke="currentColor"/><line x1="0" y1="20" x2="16" y2="20" stroke="currentColor"/></svg></div>
              <div className="panel-corner br"><svg width="20" height="20"><line x1="20" y1="20" x2="20" y2="4" stroke="currentColor"/><line x1="20" y1="20" x2="4" y2="20" stroke="currentColor"/></svg></div>

              <div 
                className={`drop-zone ${isDragging ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange({ target: { files: e.dataTransfer.files } }); }}
                onClick={() => fileInputRef.current.click()}
              >
                <div className="upload-icon-wrap-main">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M24 6 L24 32" strokeLinecap="round"/><path d="M14 16 L24 6 L34 16" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 34 L8 38 Q8 42 12 42 L36 42 Q40 42 40 38 L40 34" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="drop-text">DRAG & DROP OR CLICK<br/>TO CHOOSE FILES</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple hidden />
              </div>

              <div className="panel-divider"></div>

              <div className="file-list-section">
                <div className="file-list-label">READY TO UPLOAD</div>
                <div className="file-list">
                  {files.length === 0 ? (
                    <div className="empty-list">No files selected — add files above</div>
                  ) : (
                    files.map((f, i) => (
                      <div className="file-item" key={i}>
                        <div className="file-info">
                          <div className="file-name">{f.name}</div>
                          <div className="file-size">{formatBytes(f.size)}</div>
                        </div>
                        <div className="file-remove" onClick={() => removeFile(i)}>✕</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="btn-section">
                <button className="upload-btn" onClick={uploadFiles} disabled={uploading || files.length === 0}>
                  UPLOAD TO DRIVE <div className="btn-arrow">→</div>
                </button>
              </div>
            </div>
          </div>

          <div className="right-panel">
            <div className="status-label">UPLOAD STATUS</div>
            <div className="status-main">
              <div className="status-state">
                <div className="status-icon-wrap">
                  {uploading && <div className="spinner-ring" style={{display: 'block'}}></div>}
                  <div className={`status-icon ${status.state}`} style={{display: uploading ? 'none' : 'flex'}}>
                    <svg viewBox="0 0 16 16">
                      {status.state === 'idle' ? <line x1="4" y1="8" x2="12" y2="8" strokeLinecap="round" strokeWidth="2"/> : <polyline points="3,8 7,12 13,4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>}
                    </svg>
                  </div>
                </div>
                <div className="status-text-group">
                  <div className="status-heading">{status.heading}</div>
                  <div className="status-sub">{status.sub}</div>
                </div>
              </div>

              {uploading && (
                <div className="mini-progress-wrap visible">
                  <div className="mini-pct">{progress}<span>%</span></div>
                  <div className="mini-bar"><div className="mini-bar-fill" style={{width: `${progress}%`}}></div></div>
                </div>
              )}
            </div>

            <div className="stats-section">
              <div className="stat-row"><span className="stat-key">Auth</span><span className="stat-val ok">Connected</span></div>
              <div className="stat-row"><span className="stat-key">Destination</span><span className="stat-val">My Drive / uploads/</span></div>
              <div className="stat-row"><span className="stat-key">Encryption</span><span className="stat-val ok">AES-256</span></div>
              <div className="stat-row"><span className="stat-key">Session</span><span className="stat-val warn">{sessionId}</span></div>
            </div>

            <div className="log-section">
              <div className="log-label">EVENT LOG</div>
              <div className="log-entries">
                {logs.map((l, i) => (
                  <div className="log-entry" key={i}>
                    <span className="log-time">--</span>
                    <span className={`log-msg ${l.type}`}>{l.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --primary: #BE5103; --accent: #069494; --yellow: #FFCE1B; --maroon: #B7410E;
          --bg: #1a0f00; --panel: rgba(40, 20, 0, 0.85); --text: #FFCE1B;
          --border: rgba(255, 206, 27, 0.1); --star-color: #fff;
        }

        [data-theme='light'] {
          --bg: #fffbf0; --panel: rgba(255, 255, 255, 0.9); --text: #B7410E;
          --border: rgba(183, 65, 14, 0.2); --star-color: #000;
        }

        body { background: var(--bg); color: var(--text); font-family: 'Space Grotesk', sans-serif; margin: 0; transition: 0.4s; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        
        .space-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .shooting-star {
          position: absolute; width: 150px; height: 2px;
          background: linear-gradient(90deg, var(--star-color), transparent);
          box-shadow: 0 0 10px var(--star-color);
          opacity: 0; animation: shoot 6s linear infinite;
        }
        @keyframes shoot { 0% { transform: rotate(-35deg) translateX(0); opacity: 0; } 10% { opacity: 0.6; } 30% { transform: rotate(-35deg) translateX(-1500px); opacity: 0; } 100% { opacity: 0; } }
        ${[...Array(12)].map((_, i) => ` .shooting-star:nth-child(${i+1}) { top: ${Math.random()*100}%; left: ${80+Math.random()*20}%; animation-delay: ${Math.random()*15}s; } `).join('')}
        
        .header { position: fixed; top:0; left:0; right:0; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; background: rgba(13,11,11,0.92); border-bottom: 0.5px solid var(--border); z-index: 100; backdrop-filter: blur(12px); }
        .brand-text { font-family: 'Space Grotesk'; font-weight: 700; font-size: 14px; letter-spacing: 2px; opacity: 0.8; }
        .dot { width: 5px; height: 5px; background: var(--maroon); border-radius: 50%; margin-right: 10px; display: inline-block; }
        
        .toggle-wrap { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono'; font-size: 11px; opacity: 0.6; }
        .toggle { width: 36px; height: 18px; border-radius: 9px; background: rgba(240,234,214,0.08); position: relative; cursor: pointer; border: 0.5px solid rgba(240,234,214,0.12); }
        .toggle::after { content:''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: var(--text); transition: 0.3s; }
        .toggle.on { background: var(--maroon); } .toggle.on::after { transform: translateX(18px); background: #fff; }
        
        .layout { display: grid; grid-template-columns: 1fr 360px; max-width: 1400px; margin: 0 auto; padding: 120px 48px 48px; gap: 0; position: relative; z-index: 1; }
        .left-panel { padding-right: 48px; border-right: 0.5px solid var(--border); }
        .main-title { font-family: 'Syne', sans-serif; font-size: clamp(38px, 5vw, 64px); font-weight: 800; text-transform: uppercase; margin-bottom: 18px; line-height: 0.85; }
        .accent-word { color: var(--accent); }
        .subtitle { font-size: 14px; opacity: 0.6; font-weight: 500; font-style: italic; }
        .badge { display: inline-flex; align-items: center; gap: 6px; font-family: 'Space Grotesk'; font-weight: 700; font-size: 10px; color: var(--primary); border: 0.5px solid var(--primary); padding: 5px 12px; margin-bottom: 24px; letter-spacing: 0.18em; }
        
        .upload-panel { background: var(--panel); border: 0.5px solid var(--border); margin-top: 36px; position: relative; }
        .panel-corner { position: absolute; color: var(--accent); } .panel-corner.tl { top:0; left:0; } .panel-corner.tr { top:0; right:0; } .panel-corner.bl { bottom:0; left:0; } .panel-corner.br { bottom:0; right:0; }
        .drop-zone { padding: 52px 48px; text-align: center; cursor: pointer; transition: 0.2s; margin: 20px; border: 1.5px dashed transparent; }
        .drop-zone:hover { background: rgba(112, 28, 28, 0.05); border-color: var(--primary); }
        
        .upload-icon-wrap-main { width: 72px; height: 72px; margin: 0 auto 28px; display: flex; align-items: center; justify-content: center; position: relative; }
        .upload-icon-wrap-main::before { content: ''; position: absolute; inset: -8px; border-radius: 50%; background: rgba(190, 81, 3, 0.15); }
        .upload-icon-wrap-main svg { width: 48px; height: 48px; stroke: var(--primary); fill: none; stroke-width: 1.5; }
        
        .drop-text { font-family: 'Syne'; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text); }
        .panel-divider { height: 0.5px; background: var(--border); margin: 0 20px; position: relative; }
        .panel-divider::before { content: ''; position: absolute; left: 0; top: -0.5px; width: 40px; height: 1px; background: var(--maroon); opacity: 0.5; }
        
        .file-list-section { padding: 20px 28px; min-height: 80px; }
        .file-list-label { font-family: 'Space Grotesk'; font-weight: 700; font-size: 10px; opacity: 0.3; margin-bottom: 12px; }
        .file-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(128,128,128,0.05); border: 0.5px solid var(--border); margin-bottom: 8px; }
        .file-name { font-size: 12px; font-weight: 700; color: var(--text); }
        .file-size { font-family: 'JetBrains Mono'; font-size: 10px; opacity: 0.4; margin-top: 2px; }
        .file-remove { color: var(--primary); cursor: pointer; transition: 0.15s; font-weight: bold; }
        
        .btn-section { padding: 16px 28px 28px; }
        .upload-btn { width: 100%; padding: 18px 32px; background: var(--maroon); border: none; color: #fff; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 14px; }
        .upload-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        
        .right-panel { padding-left: 40px; padding-top: 52px; display: flex; flex-direction: column; }
        .status-label { font-family: 'Space Grotesk'; font-weight: 700; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(240,234,214,0.25); margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }
        .status-label::after { content: ''; flex: 1; height: 0.5px; background: var(--border); }
        .status-main { margin-bottom: 36px; }
        .status-state { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        
        .status-icon-wrap { width: 36px; height: 36px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; position: relative; }
        .spinner-ring { position: absolute; top:0; left:0; width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid rgba(112,28,28,0.2); border-top-color: var(--primary); animation: spin 0.8s linear infinite; }
        .status-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 0.5px solid; z-index: 2; }
        .status-icon.idle { border-color: rgba(240,234,214,0.12); background: rgba(240,234,214,0.04); }
        .status-icon.idle svg { stroke: rgba(240,234,214,0.25); fill: none; stroke-width: 2; }
        .status-icon.ready, .status-icon.success { border-color: var(--accent); background: rgba(6, 148, 148, 0.06); }
        .status-icon.ready svg, .status-icon.success svg { stroke: #50c878; fill: none; stroke-width: 2; }
        
        .status-heading { font-family: 'Syne'; font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 3px; }
        .status-sub { font-family: 'Space Grotesk'; font-size: 10.5px; opacity: 0.6; line-height: 1.5; }
        
        .mini-pct { font-family: 'Syne'; font-size: 42px; font-weight: 900; color: var(--primary); letter-spacing: -0.04em; line-height: 1; margin-top: 10px; }
        .stat-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 0.5px solid var(--border); font-family: 'JetBrains Mono'; font-size: 10px; }
        .stat-val.ok { color: #50c878; } .stat-val.warn { color: var(--primary); }
        
        .log-section { margin-top: 36px; }
        .log-label { font-family: 'Space Grotesk'; font-weight: 700; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.3; margin-bottom: 12px; }
        .log-entries { display: flex; flex-direction: column; gap: 6px; max-height: 140px; overflow-y: auto; font-family: 'JetBrains Mono'; font-size: 10.5px; }
        
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .layout { grid-template-columns: 1fr; padding: 100px 24px 24px; }
          .left-panel { border: none; padding: 0; }
          .right-panel { padding: 40px 0; }
        }
      `}</style>
    </div>
  );
}
