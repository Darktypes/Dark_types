// =============================
// Typing Exercises (Stats, WPM, Accuracy, Errors)
// =============================
document.querySelectorAll("section[id^='ex']").forEach((section) => {
  const exercises = section.querySelectorAll('.exercise');
  const meta = section.querySelector('.meta');
  const wpmEl = meta.querySelector('.wpm');
  const accEl = meta.querySelector('.acc');
  const errEl = meta.querySelector('.err');
  const resetBtn = meta.querySelector('.reset');

  let startTime = null;
  let currentExercise = null;
  let target = '';

  function calcStats() {
    if (!currentExercise) return;
    const box = currentExercise.querySelector('.typing-box');
    const typed = box.value;
    if (!typed) {
      wpmEl.textContent = '0';
      accEl.textContent = '100%';
      errEl.textContent = '0';
      return;
    }
    const now = performance.now();
    const mins = Math.max((now - startTime) / 60000, 1 / 60000);

    let correct = 0;
    const len = typed.length;
    for (let i = 0; i < len; i++) {
      if (typed[i] === target[i]) correct++;
    }
    const errors = Math.max(len - correct, 0);
    const accuracy = correct === 0 ? 0 : Math.round((correct / len) * 100);
    const gross = Math.round((len / 5) / mins);

    wpmEl.textContent = String(gross);
    accEl.textContent = accuracy + '%';
    errEl.textContent = String(errors);
  }

  exercises.forEach((ex) => {
    const box = ex.querySelector(".typing-box");
    const targetEl = ex.querySelector(".target-text");
    const text = targetEl.innerText;

    box.addEventListener("input", () => {
      if (currentExercise !== ex) {
        currentExercise = ex;
        target = text;
        startTime = performance.now();
      }
      calcStats();
    });

    box.addEventListener("focus", () => targetEl.classList.add("active"));
    box.addEventListener("blur", () => targetEl.classList.remove("active"));
  });

  resetBtn.addEventListener("click", () => {
    if (currentExercise) {
      const box = currentExercise.querySelector(".typing-box");
      box.value = "";
    }
    startTime = null;
    currentExercise = null;
    wpmEl.textContent = "0";
    accEl.textContent = "100%";
    errEl.textContent = "0";
  });
});

// =============================
// Enter -> next box jump
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".typing-box");

  boxes.forEach((box, i) => {
    box.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (boxes[i + 1]) {
          boxes[i + 1].focus();
          const len = boxes[i + 1].value.length;
          boxes[i + 1].setSelectionRange(len, len);
        }
      }
    });
  });
});

// =============================
// Sidebar + Dropdowns + Settings
// (kept robust & as before — persistence + event delegation)
// =============================
(function () {
  function lsGet(key, fallback = null) { try { const v = localStorage.getItem(key); return v === null ? fallback : v; } catch(e) { return fallback; } }
  function lsSet(key, value) { try { localStorage.setItem(key, String(value)); } catch(e) {} }

  document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const scrim = document.getElementById('sidebar-scrim');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const btnCollapse = document.getElementById('btn-collapse');
    const btnReset = document.getElementById('btn-reset');

    function openSidebar() {
      sidebar?.classList.add('open');
      scrim?.classList.add('open');
      if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'true');
      if (scrim) scrim.setAttribute('aria-hidden', 'false');
      lsSet('pref_sidebar', 'open');
    }
    function closeSidebar() {
      sidebar?.classList.remove('open');
      scrim?.classList.remove('open');
      if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'false');
      if (scrim) scrim.setAttribute('aria-hidden', 'true');
      lsSet('pref_sidebar', 'closed');
    }

    if (sidebarToggleBtn) {
      sidebarToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sidebar?.classList.contains('open')) closeSidebar(); else openSidebar();
      });
    }

    if (scrim) {
      scrim.addEventListener('click', (e) => {
        if (e.target === scrim) closeSidebar();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar?.classList.contains('open')) closeSidebar();
    });

    document.addEventListener('click', (e) => {
      if (!sidebar?.classList.contains('open')) return;
      if (sidebar.contains(e.target) || (sidebarToggleBtn && sidebarToggleBtn.contains(e.target))) return;
      closeSidebar();
    });

    sidebar?.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => {
        setTimeout(() => {
          if (sidebar?.classList.contains('open')) closeSidebar();
        }, 80);
      });
    });

    sidebar?.addEventListener('click', (e) => {
      const toggle = e.target.closest('.dropdown-toggle');
      if (!toggle) return;
      e.preventDefault();

      const contentId = toggle.id.replace(/-toggle$/, "-content");
      const content = document.getElementById(contentId);
      if (!content) return;

      const isOpen = content.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
    });

    const ids = ['set-theme','set-sound','set-effects','set-wpm','set-acc','set-err'];
    function applySetting(id, enabled) {
      switch (id) {
        case 'set-theme':
          document.body.classList.toggle('light', !!enabled);
          lsSet('theme', enabled ? 'light' : 'dark');
          break;
        case 'set-sound':
          window.__soundEnabled = !!enabled;
          break;
        case 'set-effects':
          document.body.classList.toggle('effects-off', !enabled);
          break;
        case 'set-wpm':
          document.body.classList.toggle('hide-wpm', !enabled);
          break;
        case 'set-acc':
          document.body.classList.toggle('hide-acc', !enabled);
          break;
        case 'set-err':
          document.body.classList.toggle('hide-err', !enabled);
          break;
      }
      lsSet('pref_' + id, !!enabled);
    }

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      let saved = lsGet('pref_' + id, el.checked);
      el.checked = (saved === true || saved === 'true');
      applySetting(id, el.checked);
      el.addEventListener('change', () => applySetting(id, el.checked));
    });

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        const defaults = {
          'set-theme': false,
          'set-sound': true,
          'set-effects': true,
          'set-wpm': true,
          'set-acc': true,
          'set-err': true
        };
        ids.forEach(id => {
          const el = document.getElementById(id);
          if (!el) return;
          el.checked = defaults[id];
          applySetting(id, el.checked);
        });
        setTimeout(() => closeSidebar(), 120);
      });
    }

    if (lsGet('pref_sidebar') === 'open') openSidebar();
  });
})();

// =============================
// Typing sounds + Beep on wrong key
// - Key Sound toggle controls everything (normal key fx + beep)
// - Backspace/Enter/Arrows/Modifiers ignored for beep
// - Printable wrong char -> beep (no duplicate normal fx)
// =============================
document.addEventListener("DOMContentLoaded", () => {
  // ensure a global flag (may be set by applySetting earlier)
  if (typeof window.__soundEnabled === "undefined") window.__soundEnabled = true;

  // audio assets (ensure these paths exist in your project)
  const specialSound = new Audio("space.mp3"); // space/enter/backspace special
  const keySound = new Audio("keys.mp3");      // normal key sound
  const beep = new Audio("sound/beep-sound.mp3"); // wrong char beep

  // preload
  [specialSound, keySound, beep].forEach(a => { try { a.preload = "auto"; } catch(e){} });

  // one user click to unlock browsers that block autoplay sound
  document.addEventListener("click", () => {
    try {
      specialSound.play().then(()=>{ specialSound.pause(); specialSound.currentTime = 0; }).catch(()=>{});
      keySound.play().then(()=>{ keySound.pause(); keySound.currentTime = 0; }).catch(()=>{});
      beep.play().then(()=>{ beep.pause(); beep.currentTime = 0; }).catch(()=>{});
    } catch(e){}
  }, { once: true });

  function playIfEnabled(audio) {
    if (!window.__soundEnabled) return;
    try { audio.currentTime = 0; audio.play().catch(()=>{}); } catch (e) {}
  }

  // keys to ignore for beep
  const ignoreForBeep = new Set(["Backspace","Delete","Tab","Enter","Shift","Alt","Control","Meta","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"]);

  // attach single keydown handler per typing box (handles normal fx + beep)
  document.querySelectorAll(".exercise .typing-box").forEach((typingBox) => {
    const targetText = typingBox.closest(".exercise").querySelector(".target-text")?.textContent || "";

    typingBox.addEventListener("keydown", (e) => {
      // let Enter->next handler (already exists) run; we skip special handling here for Enter
      if (e.key === "Enter") return;

      // special keys / modifiers: do special sound (space/backspace/enter handled below)
      if (ignoreForBeep.has(e.key)) {
        // but still provide normal feedback for Backspace/Space/Enter if sounds enabled
        if ((e.key === "Backspace" || e.key === "Delete") && window.__soundEnabled) {
          playIfEnabled(specialSound);
        }
        return;
      }

      // only single-character printable keys reach here (like 'a','1', etc.)
      if (e.key.length !== 1) return;

      // live check toggle
      if (!window.__soundEnabled) return;

      // caret pos
      const pos = typingBox.selectionStart ?? typingBox.value.length;
      const expected = targetText[pos];

      // if we are beyond expected text, treat as normal key (no beep)
      if (expected === undefined) {
        playIfEnabled(keySound);
        return;
      }

      // wrong printable character -> beep (do not play normal key sound)
      if (e.key !== expected) {
        playIfEnabled(beep);
        return;
      }

      // correct printable character -> normal key sound
      playIfEnabled(keySound);
    });
  });
});
