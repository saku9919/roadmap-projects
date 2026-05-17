/* ================================================
   main.js — Desktop OS interactions
   ================================================ */

const wins = document.querySelectorAll('.window');
const sidebarBtns = document.querySelectorAll('.sidebar__btn');
const taskbarBtns = document.querySelectorAll('.taskbar__btn');

/* ---- Clock ---- */
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hh}:${mm}`;
  const dateStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`;
  const tb = document.getElementById('taskbar-clock');
  const sb = document.getElementById('sidebar-clock');
  if (tb) tb.textContent = timeStr;
  if (sb) sb.textContent = timeStr;
  const td = document.getElementById('taskbar-date');
  if (td) td.textContent = dateStr;
}
updateClock();
setInterval(updateClock, 1000);

/* ---- Focus management ---- */
let zTop = 10;
function focusWindow(winId) {
  wins.forEach(w => w.classList.remove('is-focused'));
  const win = document.getElementById(winId);
  if (win) {
    win.classList.add('is-focused');
    win.style.zIndex = ++zTop;
  }
  // sync sidebar
  sidebarBtns.forEach(b => b.classList.toggle('is-active', b.dataset.win === winId));
  // sync taskbar
  taskbarBtns.forEach(b => b.classList.toggle('is-active', b.dataset.win === winId));
}

// Click window body to focus
wins.forEach(win => {
  win.addEventListener('mousedown', () => focusWindow(win.id));
});

/* ---- Minimize / Maximize ---- */
document.addEventListener('click', e => {
  const btn = e.target.closest('.win-btn[data-action]');
  if (!btn) return;
  const { action, win: winId } = btn.dataset;
  const win = document.getElementById(winId);
  if (!win) return;

  if (action === 'min') {
    const isMin = win.classList.toggle('is-minimized');
    // sync taskbar
    const tb = document.querySelector(`.taskbar__btn[data-win="${winId}"]`);
    if (tb) tb.classList.toggle('is-minimized', isMin);
  }
  if (action === 'max') {
    win.classList.toggle('is-maximized');
  }
});

/* ---- Sidebar nav ---- */
sidebarBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const winId = btn.dataset.win;
    const win = document.getElementById(winId);
    if (!win) return;
    const tb = document.querySelector(`.taskbar__btn[data-win="${winId}"]`);

    if (win.classList.contains('is-minimized')) {
      // Hidden → open & focus
      win.classList.remove('is-minimized');
      if (tb) tb.classList.remove('is-minimized');
      focusWindow(winId);
    } else if (win.classList.contains('is-focused')) {
      // Focused → close (minimize)
      win.classList.add('is-minimized');
      if (tb) tb.classList.add('is-minimized');
      sidebarBtns.forEach(b => b.classList.remove('is-active'));
      taskbarBtns.forEach(b => b.classList.remove('is-active'));
    } else {
      // Visible but not focused → just focus
      focusWindow(winId);
    }
  });
});

/* ---- Taskbar buttons ---- */
taskbarBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const winId = btn.dataset.win;
    const win = document.getElementById(winId);
    if (!win) return;
    if (win.classList.contains('is-focused') && !win.classList.contains('is-minimized')) {
      // Minimize if already focused
      win.classList.add('is-minimized');
      btn.classList.add('is-minimized');
    } else {
      win.classList.remove('is-minimized');
      btn.classList.remove('is-minimized');
      focusWindow(winId);
      win.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
});

/* ---- CTA buttons inside About window ---- */
document.querySelectorAll('[data-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    const winId = btn.dataset.open;
    const win = document.getElementById(winId);
    if (!win) return;
    win.classList.remove('is-minimized');
    const tb = document.querySelector(`.taskbar__btn[data-win="${winId}"]`);
    if (tb) tb.classList.remove('is-minimized');
    focusWindow(winId);
    win.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

/* ---- Initial focus ---- */
focusWindow('win-about');
