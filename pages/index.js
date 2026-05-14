:root {
  --primary: #008000;
  --accent: #00ff99;
  --cream: #d8ffe1;

  --bg: #031403;
  --panel: rgba(0, 25, 0, 0.88);
  --text: #caffca;

  --border: rgba(0, 255, 128, 0.14);
  --border-strong: rgba(0, 255, 128, 0.28);

  --star-color: #00ff99;

  --glow:
    0 0 5px rgba(0,255,128,0.5),
    0 0 10px rgba(0,255,128,0.4),
    0 0 20px rgba(0,255,128,0.25);

  --mono: 'Orbitron', monospace;
}

[data-theme='light'] {
  --primary: #008000;
  --accent: #00aa55;

  --bg: #f4fff4;
  --panel: rgba(255,255,255,0.94);
  --text: #008000;

  --border: rgba(0,128,0,0.14);
  --border-strong: rgba(0,128,0,0.22);

  --star-color: #008000;

  --glow:
    0 0 3px rgba(0,128,0,0.15),
    0 0 8px rgba(0,128,0,0.08);
}

body {
  background:
    radial-gradient(circle at top, rgba(0,255,128,0.08), transparent 40%),
    var(--bg);

  color: var(--text);

  font-family: 'Orbitron', sans-serif;

  margin: 0;

  transition:
    background 0.4s ease,
    color 0.4s ease;

  overflow-x: hidden;

  -webkit-font-smoothing: antialiased;
}

/* HEADER */

.header {
  position: fixed;
  top:0;
  left:0;
  right:0;
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 48px;

  background: rgba(0, 15, 0, 0.82);

  border-bottom: 1px solid var(--border);

  z-index: 100;

  backdrop-filter: blur(12px);

  box-shadow: var(--glow);
}

.brand-text {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.15em;
  opacity: 0.9;
  text-shadow: var(--glow);
}

.dot {
  width: 5px;
  height: 5px;

  background: var(--primary);

  border-radius: 50%;

  margin-right: 10px;

  display: inline-block;

  box-shadow: var(--glow);
}

/* TOGGLE */

.toggle {
  width: 36px;
  height: 18px;

  border-radius: 9px;

  background: rgba(0,255,128,0.08);

  position: relative;

  cursor: pointer;

  border: 1px solid rgba(0,255,128,0.25);

  box-shadow: var(--glow);
}

.toggle::after {
  content:'';

  position: absolute;

  top: 2px;
  left: 2px;

  width: 14px;
  height: 14px;

  border-radius: 50%;

  background: #00ff99;

  transition: 0.3s;

  box-shadow: var(--glow);
}

.toggle.on {
  background: rgba(0,255,128,0.18);
}

.toggle.on::after {
  transform: translateX(18px);
}

/* TITLE */

.main-title {
  font-size: clamp(38px, 5vw, 64px);

  font-weight: 900;

  text-transform: uppercase;

  margin-bottom: 18px;

  line-height: 0.92;

  letter-spacing: 0.05em;

  color: var(--text);

  text-shadow: var(--glow);
}

.accent-word {
  color: var(--primary);

  display: block;

  text-shadow:
    0 0 10px rgba(0,255,128,0.8),
    0 0 20px rgba(0,255,128,0.5),
    0 0 40px rgba(0,255,128,0.3);
}

.subtitle {
  font-size: 14px;

  font-weight: 600;

  color: rgba(200,255,200,0.75);

  line-height: 1.5;
}

/* BADGE */

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  font-family: var(--mono);

  font-size: 10px;

  color: var(--primary);

  border: 1px solid rgba(0,255,128,0.4);

  padding: 5px 12px;

  margin-bottom: 24px;

  letter-spacing: 0.18em;

  box-shadow: var(--glow);
}

/* PANEL */

.upload-panel {
  background: var(--panel);

  border: 1px solid var(--border-strong);

  margin-top: 36px;

  position: relative;

  box-shadow:
    0 0 25px rgba(0,255,128,0.08),
    inset 0 0 12px rgba(0,255,128,0.04);
}

.panel-corner {
  position: absolute;
  color: var(--accent);

  filter: drop-shadow(0 0 6px rgba(0,255,128,0.8));
}

/* DROPZONE */

.drop-zone {
  padding: 52px 48px;

  text-align: center;

  cursor: pointer;

  transition: 0.25s;

  margin: 20px;

  border: 1.5px dashed rgba(0,255,128,0.15);
}

.drop-zone:hover {
  background: rgba(0,255,128,0.05);

  border-color: rgba(0,255,128,0.55);

  box-shadow:
    inset 0 0 20px rgba(0,255,128,0.08),
    0 0 20px rgba(0,255,128,0.08);
}

.drop-zone.drag-over {
  background: rgba(0,255,128,0.08);

  border-color: #00ff99;

  box-shadow:
    0 0 25px rgba(0,255,128,0.2),
    inset 0 0 20px rgba(0,255,128,0.12);
}

/* ICON */

.upload-icon-wrap-main::before {
  content: '';

  position: absolute;

  inset: -8px;

  border-radius: 50%;

  background: rgba(0,255,128,0.08);

  box-shadow:
    0 0 20px rgba(0,255,128,0.35),
    0 0 40px rgba(0,255,128,0.15);
}

.upload-icon-wrap-main svg {
  stroke: #00ff99;

  filter: drop-shadow(0 0 10px rgba(0,255,128,0.9));
}

.drop-text {
  font-weight: 800;

  font-size: 13px;

  text-transform: uppercase;

  letter-spacing: 0.18em;

  color: var(--text);

  text-shadow: var(--glow);
}

/* BUTTON */

.upload-btn {
  width: 100%;

  padding: 18px 32px;

  background:
    linear-gradient(
      135deg,
      #008000,
      #00aa55
    );

  border: 1px solid rgba(0,255,128,0.4);

  color: #ffffff;

  font-family: 'Orbitron', sans-serif;

  font-size: 13px;

  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 0.16em;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 14px;

  box-shadow:
    0 0 12px rgba(0,255,128,0.4),
    0 0 24px rgba(0,255,128,0.15);
}

.upload-btn:hover {
  transform: translateY(-1px);

  box-shadow:
    0 0 20px rgba(0,255,128,0.6),
    0 0 35px rgba(0,255,128,0.22);
}

/* STATUS */

.spinner-ring {
  border: 1.5px solid rgba(0,255,128,0.18);

  border-top-color: #00ff99;

  box-shadow: var(--glow);
}

.status-icon {
  box-shadow: var(--glow);
}

.status-icon.ready,
.status-icon.success {
  border-color: rgba(0,255,128,0.4);

  background: rgba(0,255,128,0.08);
}

.status-icon.ready svg,
.status-icon.success svg {
  stroke: #00ff99;
}

/* PROGRESS */

.mini-pct {
  color: #00ff99;

  text-shadow:
    0 0 10px rgba(0,255,128,0.8),
    0 0 25px rgba(0,255,128,0.45);
}

.mini-bar {
  background: rgba(0,255,128,0.08);
}

.mini-bar-fill {
  background: linear-gradient(
    90deg,
    #008000,
    #00ff99
  );

  box-shadow:
    0 0 10px rgba(0,255,128,0.8);
}

/* FILE ITEM */

.file-item {
  background: rgba(0,255,128,0.04);

  border: 1px solid rgba(0,255,128,0.12);

  box-shadow:
    inset 0 0 10px rgba(0,255,128,0.03);
}

/* LOG */

.log-msg.ok {
  color: #00ff99;

  text-shadow: 0 0 6px rgba(0,255,128,0.55);
}

.log-msg.err {
  color: #7dff7d;
}

/* SHOOTING STAR */

.shooting-star {
  position: absolute;

  width: 180px;
  height: 2px;

  background:
    linear-gradient(
      90deg,
      #00ff99,
      transparent
    );

  box-shadow:
    0 0 10px #00ff99,
    0 0 20px rgba(0,255,128,0.5),
    0 0 30px rgba(0,255,128,0.25);

  opacity: 0;

  animation: shoot 6s linear infinite;
}

/* CYBERPUNK FONT IMPORT */

@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;800;900&display=swap');
