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

  // sab exercises ke liye
  exercises.forEach((ex) => {
    const box = ex.querySelector(".typing-box");
    const targetEl = ex.querySelector(".target-text");
    const text = targetEl.innerText;

    // typing start
    box.addEventListener("input", () => {
      if (currentExercise !== ex) {
        currentExercise = ex;
        target = text;
        startTime = performance.now();
      }
      calcStats();
    });

    // outline active
    box.addEventListener("focus", () => targetEl.classList.add("active"));
    box.addEventListener("blur", () => targetEl.classList.remove("active"));
  });

  // reset button
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
const soundSpecial = new Audio("space.mp3"); // Enter, Space, Backspace
const soundKeys = new Audio("keys.mp3");     // All other keys

// unlock
document.addEventListener("click", () => {
  soundSpecial.play().then(() => {
    soundSpecial.pause(); soundSpecial.currentTime = 0;
  }).catch(()=>{});
  soundKeys.play().then(() => {
    soundKeys.pause(); soundKeys.currentTime = 0;
  }).catch(()=>{});
}, { once: true });

function playSound(audio) {
  if (!audio) return;
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
    // Sab sections se glow hata do
    sections.forEach(sec => sec.classList.remove("glow"));

    // Jis section me abhi type ho raha hai, uspe glow add karo
    input.closest("section").classList.add("glow");
  });
});

// script.js
const toggleBtn = document.getElementById("theme-toggle");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");

  // Save theme in localStorage
  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
});

// Refresh ke baad bhi theme yaad rahe
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}








