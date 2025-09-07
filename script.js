// ------------------ MULTI EXERCISE SUPPORT ------------------
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

// ------------------ ENTER → NEXT BOX JUMP ------------------
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

// ------------------ KEY SOUND EFFECTS ------------------
window.__soundEnabled = true;

const soundSpecial = new Audio("space.mp3"); // Enter, Space, Backspace
const soundKeys = new Audio("keys.mp3");     // All other keys

document.addEventListener("click", () => {
  if (!window.__soundEnabled) return;
  soundSpecial.play().then(() => {
    soundSpecial.pause(); soundSpecial.currentTime = 0;
  }).catch(()=>{});
  soundKeys.play().then(() => {
    soundKeys.pause(); soundKeys.currentTime = 0;
  }).catch(()=>{});
}, { once: true });

function playSound(audio) {
  if (!audio) return;
  if (window.__soundEnabled === false) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

document.querySelectorAll(".typing-box").forEach((box) => {
  box.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter" || e.key === "Backspace") {
      playSound(soundSpecial);
    } else {
      playSound(soundKeys);
    }
  });
});

const sections = document.querySelectorAll("section.card");

document.querySelectorAll(".typing-box").forEach(input => {
  input.addEventListener("focus", () => {
    sections.forEach(sec => sec.classList.remove("glow"));
    input.closest("section").classList.add("glow");
  });
});

/* ================= Robust Sidebar + Dropdowns + Settings ================= */
(function () {
  // helper localStorage
  function lsGet(key, fallback = null) { try { const v = localStorage.getItem(key); return v === null ? fallback : v; } catch(e) { return fallback; } }
  function lsSet(key, value) { try { localStorage.setItem(key, String(value)); } catch(e) {} }

  document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const scrim = document.getElementById('sidebar-scrim');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const btnCollapse = document.getElementById('btn-collapse');
    const btnReset = document.getElementById('btn-reset');

    // fallback: if scrim exists but aria-hidden not set, set it
    if (scrim && scrim.getAttribute('aria-hidden') === null) {
      scrim.setAttribute('aria-hidden', 'true');
    }

    function openSidebar() {
      sidebar?.classList.add('open');
      scrim?.classList.add('open');
      if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'true');
      if (scrim) scrim.setAttribute('aria-hidden', 'false');
      try { localStorage.setItem('pref_sidebar', 'open'); } catch(e){}
    }
    function closeSidebar() {
      sidebar?.classList.remove('open');
      scrim?.classList.remove('open');
      if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'false');
      if (scrim) scrim.setAttribute('aria-hidden', 'true');
      try { localStorage.setItem('pref_sidebar', 'closed'); } catch(e){}
    }

    // toggle sidebar button (if present)
    if (sidebarToggleBtn) {
      sidebarToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sidebar?.classList.contains('open')) closeSidebar(); else openSidebar();
      });
    }

    // scrim click closes only when clicked on scrim itself
    if (scrim) {
      scrim.addEventListener('click', (e) => {
        if (e.target === scrim) closeSidebar();
      });
    }

    // ESC closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar?.classList.contains('open')) closeSidebar();
    });

    // click outside sidebar closes it (robust)
    document.addEventListener('click', (e) => {
      if (!sidebar?.classList.contains('open')) return;
      if (sidebar.contains(e.target) || (sidebarToggleBtn && sidebarToggleBtn.contains(e.target))) return;
      closeSidebar();
    });

    // close sidebar when clicking internal anchor links (anchor jump first)
    sidebar?.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => {
        setTimeout(() => {
          if (sidebar?.classList.contains('open')) closeSidebar();
        }, 80);
      });
    });

    /* ---------- Event-delegation for dropdown toggles (robust) ---------- */
    // This avoids ID timing issues — clicks on any .dropdown-toggle inside sidebar will work.
    if (sidebar) {
      sidebar.addEventListener('click', (e) => {
        const toggle = e.target.closest('.dropdown-toggle');
        if (!toggle) return;

        e.preventDefault();
        // infer content id: <id>-toggle => <id>-content
        let contentId = null;
        if (toggle.id && toggle.id.endsWith('-toggle')) {
          contentId = toggle.id.replace(/-toggle$/, '-content');
        } else {
          // try data-controls attribute
          contentId = toggle.getAttribute('data-controls') || toggle.getAttribute('aria-controls');
        }
        if (!contentId) return;
        const content = document.getElementById(contentId);
        if (!content) return;

        const isOpen = content.classList.toggle('open');
        toggle.classList.toggle('active', isOpen);
      });
    }

    /* ---------- Settings logic (apply/persist) ---------- */
    const ids = ['set-theme','set-sound','set-effects','set-wpm','set-acc','set-err'];

    function applySetting(id, enabled) {
      switch (id) {
        case 'set-theme':
          document.body.classList.toggle('light', !!enabled);
          lsSet('theme', enabled ? 'light' : 'dark');
          lsSet('pref_' + id, !!enabled);
          break;
        case 'set-sound':
          window.__soundEnabled = !!enabled;
          lsSet('pref_' + id, !!enabled);
          break;
        case 'set-effects':
          document.body.classList.toggle('effects-off', !enabled);
          lsSet('pref_' + id, !!enabled);
          break;
        case 'set-wpm':
          document.body.classList.toggle('hide-wpm', !enabled);
          lsSet('pref_' + id, !!enabled);
          break;
        case 'set-acc':
          document.body.classList.toggle('hide-acc', !enabled);
          lsSet('pref_' + id, !!enabled);
          break;
        case 'set-err':
          document.body.classList.toggle('hide-err', !enabled);
          lsSet('pref_' + id, !!enabled);
          break;
      }
    }

    // initialize settings (safe: elements might be inside closed dropdown)
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      let saved = null;
      if (id === 'set-theme') {
        const legacyTheme = lsGet('theme', null);
        if (legacyTheme === 'light') saved = 'true';
        else if (legacyTheme === 'dark') saved = 'false';
      }
      if (saved === null) saved = lsGet('pref_' + id, null);

      if (saved === null) {
        saved = el.checked ? 'true' : 'false';
      }

      el.checked = (saved === 'true' || saved === true);
      applySetting(id, el.checked);

      el.addEventListener('change', () => {
        applySetting(id, el.checked);
      });
    });

    // Reset defaults
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
          const def = defaults[id] === undefined ? false : defaults[id];
          el.checked = !!def;
          applySetting(id, el.checked);
        });
        setTimeout(() => closeSidebar(), 120);
      });
    }

    // persist sidebar initial state
    const sbState = lsGet('pref_sidebar', null);
    if (sbState === 'open') openSidebar();
  });
})();





document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("sidebar-scrim");

  // Sirf lessons ke links ko select karo
  const lessonLinks = document.querySelectorAll("#lessons-content a");

  lessonLinks.forEach(link => {
    link.addEventListener("click", () => {
      // Sidebar band karo
      sidebar.classList.remove("open");
      scrim.classList.remove("open");
    });
  });
});



// --- Notification ---
const box=document.getElementById('notify-box');
const typewriterDiv=box.querySelector('.typewriter');
const sound=document.getElementById('notify-sound');

const aboutMessage=`Dark_types is created and maintained by Arman Hasan, a passionate learner, student, and aspiring developer. Starting his journey with a simple interest in computers, Arman gradually developed a strong curiosity for technology, web design, and coding.

He believes that learning should always be practical and accessible, which is why Dark_types was built—not just as a project, but as a tool that can genuinely help students and beginners improve their typing skills while exploring modern web experiences.

Arman’s vision goes beyond typing practice. He is constantly experimenting with new ideas and features to make Dark_types a unique platform where technology, creativity, and learning meet. By building this project from scratch, he has combined his dedication to self-learning with the goal of creating something valuable for others.

With Dark_types, Arman wants to inspire others—especially students like him—to believe that no matter where you start from, consistent learning and hard work can turn even a small idea into something meaningful.`;

// Typewriter synced to audio or custom duration
function typeWriter(message,totalTime){
  typewriterDiv.innerHTML='';
  const charDelay=totalTime/message.length;
  for(let i=0;i<message.length;i++){
    const char=message[i];
    const span=document.createElement('span');
    if(char===' '){ span.innerHTML='&nbsp;'; }
    else if(char==='\n'){ typewriterDiv.appendChild(document.createElement('br')); continue; }
    else{ span.textContent=char; }
    span.style.animation=`typeChar ${charDelay}ms forwards`;
    span.style.animationDelay=`${i*charDelay}ms`;
    typewriterDiv.appendChild(span);
  }
}

// Show notification
function showNotification(){
  box.classList.add('show');
  let duration=480000; // 8 minutes in ms
  if(sound.src){
    sound.currentTime=0; sound.play();
    duration=sound.duration*1000 || 480000;
  }
  typeWriter(aboutMessage,duration);
  setTimeout(()=>{box.classList.remove('show');},duration);
}

function startIntro(){ showNotification(); }
function stopIntro(){ sound.pause(); sound.currentTime=0; box.classList.remove('show'); }

box.addEventListener('click',stopIntro);