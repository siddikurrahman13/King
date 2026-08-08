/* =========================
   NAVIGATION & STEP TRACKING
   ========================= */
let currentStepIndex = 0;
let stepHistory = [];

// সকল স্টেপ/লাইনের তালিকা
const steps = [
  { type: "page", pageId: "welcome" },
  { type: "page", pageId: "passwordPage" },
  { type: "page", pageId: "envelopePage" },
  
  // Chapter 1 Steps
  { type: "line", pageId: "letterPage", chapter: 1, index: 0 },
  { type: "line", pageId: "letterPage", chapter: 1, index: 1 },
  { type: "line", pageId: "letterPage", chapter: 1, index: 2 },
  { type: "line", pageId: "letterPage", chapter: 1, index: 3 },
  { type: "line", pageId: "letterPage", chapter: 1, index: 4 },
  { type: "line", pageId: "letterPage", chapter: 1, index: 5 },
  { type: "line", pageId: "letterPage", chapter: 1, index: 6 },
  
  // Chapter 2 Steps
  ...Array.from({ length: 31 }, (_, i) => ({ type: "line", pageId: "chapter2", chapter: 2, index: i })),
  
  // Chapter 3 Steps
  ...Array.from({ length: 13 }, (_, i) => ({ type: "line", pageId: "chapter3", chapter: 3, index: i })),
  
  { type: "page", pageId: "finalChapter" },
  
  // Birthday Lines
  ...Array.from({ length: 5 }, (_, i) => ({ type: "line", pageId: "birthdayReveal", chapter: "birthday", index: i })),
  
  { type: "page", pageId: "celebrationScene" },
  { type: "page", pageId: "ultimateEnding" }
];

function clearAllTimers() {
  if (window.activeTypingTimer) {
    clearInterval(window.activeTypingTimer);
    window.activeTypingTimer = null;
  }
}

function updateBackButtonVisibility() {
  const prevBtn = document.getElementById("prevBtn");
  if (prevBtn) {
    if (stepHistory.length > 0) {
      prevBtn.classList.remove("hidden");
    } else {
      prevBtn.classList.add("hidden");
    }
  }
}

function goToStep(stepIdx, isGoingBack = false) {
  clearAllTimers();

  if (!isGoingBack && currentStepIndex !== stepIdx) {
    stepHistory.push(currentStepIndex);
  }

  currentStepIndex = stepIdx;
  updateBackButtonVisibility();

  const step = steps[stepIdx];
  hideAllPages();

  const targetPage = document.getElementById(step.pageId);
  if (targetPage) {
    targetPage.classList.remove("hidden");
    if (["finalChapter", "birthdayReveal", "celebrationScene", "ultimateEnding"].includes(step.pageId)) {
      targetPage.style.display = "flex";
    }
  }

  // Render specific state
  if (step.type === "line") {
    if (step.chapter === 1) renderChapter1Step(step.index);
    if (step.chapter === 2) renderChapter2Step(step.index);
    if (step.chapter === 3) renderChapter3Step(step.index);
    if (step.chapter === "birthday") renderBirthdayStep(step.index);
  } else {
    if (step.pageId === "ultimateEnding") startUltimateEnding();
  }
}

function goBack() {
  if (stepHistory.length === 0) return;
  const previousStep = stepHistory.pop();
  goToStep(previousStep, true);
}

function hideAllPages() {
  const pages = [
    "welcome", "passwordPage", "envelopePage", "letterPage",
    "chapter2", "chapter3", "finalChapter", "birthdayReveal",
    "celebrationScene", "ultimateEnding"
  ];
  pages.forEach(id => {
    const page = document.getElementById(id);
    if (page) {
      page.classList.add("hidden");
      page.style.display = "";
    }
  });
}

/* =========================
   MUSIC CONTROLLER
   ========================= */
function toggleMusic() {
  const music = document.getElementById('bgMusic');
  const btn = document.getElementById('musicToggleBtn');
  if (music) {
    if (music.paused) {
      music.play();
      if(btn) btn.innerHTML = "⏸️ Pause";
    } else {
      music.pause();
      if(btn) btn.innerHTML = "🎵 Play";
    }
  }
}

/* =========================
   WELCOME / PASSWORD / ENVELOPE
   ========================= */
function nextPage() { goToStep(1); }

function checkPassword() {
  const pass = document.getElementById("password").value.toLowerCase().trim();
  if (pass === "favourite chapter") {
    goToStep(2);
  } else {
    alert("Wrong Password 💔");
  }
}

function openEnvelope() { goToStep(3); }

/* =========================
   CHAPTER 1 (TYPING & LINE)
   ========================= */
const lines = [
  "Hey tui... ❤️",
  "Haa... tokei bolchi. 😊",
  "Hoyto vabchis...",
  "Eta sudhu ekta website... na",
  "Eta amar tor jonno banano ekta chotto surprise. 🤍",
  "So aste aste por...",
  "Golpota ekhono shesh hoyni... ✨"
];

function renderChapter1Step(targetLineIndex) {
  const box = document.getElementById("typewriter");
  const btn = document.getElementById("nextChapterBtn");
  box.innerHTML = "";
  btn.style.display = "none";

  for (let i = 0; i < targetLineIndex; i++) {
    box.innerHTML += lines[i] + "<br><br>";
  }

  const text = lines[targetLineIndex];
  let charIdx = 0;

  window.activeTypingTimer = setInterval(() => {
    box.innerHTML = lines.slice(0, targetLineIndex).join("<br><br>") + 
                    (targetLineIndex > 0 ? "<br><br>" : "") + 
                    text.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx >= text.length) {
      clearInterval(window.activeTypingTimer);
      window.activeTypingTimer = null;
      if (targetLineIndex === lines.length - 1) {
        btn.style.display = "block";
      } else {
        setTimeout(() => {
          goToStep(currentStepIndex + 1);
        }, 1200);
      }
    }
  }, 45);
}

function goToChapter2() { goToStep(10); }

/* =========================
   CHAPTER 2
   ========================= */
const chapter2Lines = [
  "Our story didn't really start with a beautiful moment... 🤍",
  "বরং শুরুটা হয়েছিল একটা classroom-এ... আর একটা ছোট্ট ঝগড়া দিয়ে। 😬",
  "সেদিন কে জানত, ওই মানুষটার সাথেই একদিন এত কথা জমে থাকবে... এত memories তৈরি হবে।",
  "At that time, we weren't even close... সত্যি বলতে, friend বললেও হয়তো একটু বেশি বলা হয়ে যেত।",
  "Then came 28 November 2023... ✨",
  "একটা simple video-তে তোর একটা comment... আর somehow, সেখান থেকেই আবার আমাদের কথা শুরু হলো।",
  "কথা বলতে বলতে একসময় তুই আমাকে তোর number দিতে চাইলি।",
  "But TikTok-এর privacy তখন আমাদের একটু পরীক্ষা নিতে চেয়েছিল। 😭😂",
  "তাই numberটা সরাসরি দেখাতে না পেরে তুই যেভাবে দিলি...",
  "\"zero one seven\" 😁",
  "সত্যি বলছি, তোর ওই বুদ্ধি দেখে আমি সেদিন একটু অবাকই হয়েছিলাম। 😂❤️",
  "তারপর... একটার পর একটা দিন চলে গেল।",
  "কথা বাড়তে থাকল, রাতগুলো একটু একটু করে ছোট হতে থাকল... আর অজান্তেই তুই হয়ে উঠলি আমার পরিচিত মানুষগুলোর মধ্যে একটু আলাদা একজন।",
  "But then... 27 April 2024. 💔",
  "হঠাৎ করেই তুই হারিয়ে গেলি।",
  "কোনো proper goodbye ছিল না... কোনো explanation-ও না।",
  "আমি তোকে খুঁজেছি... কিন্তু কোথাও পেলাম না।",
  "সময় চলে গেল। Days became months... আর আমি ভেবেছিলাম, হয়তো গল্পটা এখানেই শেষ।",
  "But some stories don't end when we think they do...",
  "Because then came 2 June 2025. ✨",
  "একদিন হঠাৎ... an unknown number থেকে একটা message এলো।",
  "আর message-এর ওপাশে ছিলি... তুই। ❤️",
  "কী অদ্ভুত না? এতদিন পরেও somehow, we found our way back to each other.",
  "তারপর থেকে আবার কথা... আবার সেই পরিচিত feeling... আর এবার গল্পটা আর হারিয়ে যায়নি।",
  "Maybe that's what makes our story a little different...",
  "কিছু মানুষ জীবনে আসে খুব quietly...",
  "কিছুদিন থাকে... তারপর হারিয়ে যায়...",
  "কিন্তু যদি তারা সত্যিই important হয়, somehow life তাদের আবার ফিরিয়ে আনে। 🤍",
  "And maybe... that's exactly what happened with us.",
  "কিন্তু জানিস তো... এই গল্পটা এখানেও শেষ হয়নি।",
  "Because the best part of our story... is still being written. ❤️"
];

function renderChapter2Step(lineIdx) {
  const box = document.getElementById("chapter2Story");
  const btn = document.getElementById("chapter2NextBtn");
  btn.style.display = "none";

  const text = chapter2Lines[lineIdx];
  let specialClass = "";
  if (text.includes("28 November 2023")) specialClass = "dateMoment";
  if (text.includes("27 April 2024")) specialClass = "sadMoment";
  if (text.includes("2 June 2025")) specialClass = "returnMoment";

  box.innerHTML = `<div class="chapterStoryText ${specialClass}"></div>`;
  const textBox = box.querySelector(".chapterStoryText");
  let i = 0;

  window.activeTypingTimer = setInterval(() => {
    textBox.innerHTML = text.substring(0, i + 1);
    i++;
    if (i >= text.length) {
      clearInterval(window.activeTypingTimer);
      window.activeTypingTimer = null;
      btn.style.display = "inline-block";
      if (lineIdx === chapter2Lines.length - 1) {
        btn.innerHTML = "📖 Continue to Chapter 3";
        btn.onclick = () => goToStep(41);
      } else {
        btn.innerHTML = "Continue ✨";
        btn.onclick = showChapter2Line;
      }
    }
  }, 45);
}

function showChapter2Line() { goToStep(currentStepIndex + 1); }

/* =========================
   CHAPTER 3
   ========================= */
const chapter3Lines = [
  "At first, everything was pretty simple... 😊",
  "আমি একটু বেশি fun করতাম, আর তুইও সেগুলো equally enjoy করতি।",
  "তারপর কখন যে আমরা এতটা close হয়ে গেলাম... honestly, I didn't even notice. 🤍",
  "কিছু রাত তো এমনও গেছে—9টা-10টায় কথা শুরু করে কখন যে সকাল 5টা-6টা বেজে গেছে, বুঝতেই পারিনি। 🌙",
  "সবচেয়ে অবাক করার বিষয়... এতক্ষণ কথা বলার পরেও আমাদের কথা যেন কখনো শেষ হতো না।",
  "আর তোর ওই জেদটা... 😑❤️",
  "মাঝে মাঝে সত্যিই বিরক্ত করতি, but somehow... that stubborn little side of you became one of my favourite things. 😂",
  "কিন্তু জানিস...",
  "ঠিক কখন তুই আমার কাছে এতটা important হয়ে গেলি, সেটা আমি নিজেও বুঝতে পারিনি।",
  "কোনো particular moment ছিল না... কোনো special day-ও না।",
  "Maybe it happened somewhere between all those random talks, stupid jokes, little arguments and endless nights...",
  "কখন যে 'তুই' শুধু একজন মানুষ না হয়ে আমার favourite person হয়ে গেলি... I just didn't notice. 🤍",
  "And maybe... that's the part I never really said. ❤️"
];

function renderChapter3Step(lineIdx) {
  const box = document.getElementById("chapter3Story");
  const btn = document.getElementById("chapter3NextBtn");
  btn.style.display = "none";
  box.innerHTML = "";

  const text = chapter3Lines[lineIdx];
  let i = 0;

  window.activeTypingTimer = setInterval(() => {
    box.innerHTML = text.substring(0, i + 1);
    i++;
    if (i >= text.length) {
      clearInterval(window.activeTypingTimer);
      window.activeTypingTimer = null;
      btn.style.display = "inline-block";
      if (lineIdx === chapter3Lines.length - 1) {
        btn.innerHTML = "💌 Continue to Final Chapter";
        btn.onclick = () => goToStep(54);
      } else {
        btn.innerHTML = "Continue ✨";
        btn.onclick = showNextChapter3Line;
      }
    }
  }, 45);
}

function showNextChapter3Line() { goToStep(currentStepIndex + 1); }

/* =========================
   FINAL CHAPTER & BIRTHDAY
   ========================= */
function openFinalSurprise() { goToStep(55); }

const birthdayLines = [
  "আজকের দিনটা শুধু একটা date না... 🤍",
  "আজ এমন একজন মানুষের birthday, যে somehow আমার গল্পের একটা very special part হয়ে গেছে। ❤️",
  "তোর জন্য আমার একটাই wish—",
  "তুই সবসময় হাসিস, happy থাকিস, আর তোর ছোট-বড় সব dream একদিন সত্যি হোক। ✨",
  "আর জীবন তোকে যত দূরেই নিয়ে যাক... তোর এই সুন্দর হাসিটা যেন কখনো হারিয়ে না যায়। 🤍"
];

function renderBirthdayStep(lineIdx) {
  const box = document.getElementById("birthdayMessage");
  const btn = document.getElementById("oneMoreBtn");
  btn.style.display = "none";
  box.innerHTML = "";

  const text = birthdayLines[lineIdx];
  let i = 0;

  window.activeTypingTimer = setInterval(() => {
    box.innerHTML = text.substring(0, i + 1);
    i++;
    if (i >= text.length) {
      clearInterval(window.activeTypingTimer);
      window.activeTypingTimer = null;
      btn.style.display = "inline-block";
      if (lineIdx === birthdayLines.length - 1) {
        btn.innerHTML = "🎂 Let's Celebrate";
        btn.onclick = goToCelebration;
      } else {
        btn.innerHTML = "Continue ✨";
        btn.onclick = showBirthdayLine;
      }
    }
  }, 45);
}

function showBirthdayLine() { goToStep(currentStepIndex + 1); }

function goToCelebration() { goToStep(60); }

/* =========================
   CELEBRATION
   ========================= */
function startCelebration() {
  const wishButton = document.getElementById("makeWishBtn");
  const message = document.getElementById("celebrationMessage");
  const continueBtn = document.getElementById("celebrationContinueBtn");

  wishButton.style.display = "none";
  message.innerHTML = `
    <p class="wishMoment">
      Close your eyes... 🤍
      <br><br>
      Make a wish. ✨
    </p>
  `;

  setTimeout(() => {
    message.innerHTML = `
      <p class="wishMoment">
        And now... make it come true. ❤️
      </p>
    `;
    createConfetti();
  }, 2200);

  setTimeout(() => {
    continueBtn.style.display = "inline-block";
  }, 4200);
}

function createConfetti() {
  const container = document.getElementById("celebrationConfetti");
  const pieces = ["🎉", "🎊", "✨", "💖", "💫", "🌸"];
  container.innerHTML = "";

  for (let i = 0; i < 35; i++) {
    const piece = document.createElement("span");
    piece.innerHTML = pieces[Math.floor(Math.random() * pieces.length)];
    piece.style.left = Math.random() * 100 + "%";
    piece.style.animationDelay = Math.random() * 2 + "s";
    piece.classList.add("confettiPiece");
    container.appendChild(piece);
  }
}

function goToFinalMessage() { goToStep(61); }

/* =========================
   ULTIMATE ENDING
   ========================= */
function startUltimateEnding() {
  const box = document.getElementById("ultimateText");
  box.innerHTML = "";

  const finalLines = [
    "I don't know what the future holds for us...",
    "But I'm really glad that, somehow, our paths crossed again. 🤍",
    "From a classroom argument to endless midnight conversations...",
    "কী সুন্দর একটা little journey হয়ে গেছে, তাই না? ❤️",
    "আর যদি আজ তোর জন্য একটা wish করতে পারতাম...",
    "তাহলে চাইতাম, life তোকে ঠিক সেই happiness-টাই দিক, যেটা তুই unknowingly আমার জীবনে নিয়ে এসেছিস। 🤍",
    "This whole little world you just walked through...",
    "এটা শুধু একটা website ছিল না।",
    "এটা ছিল আমার মনে জমে থাকা কিছু কথা... শুধু তোর জন্য। ❤️",
    "21 August — তোর day, আর somehow এখন আমার কাছেও এই দিন টি special একটা দিন।",
    "সবসময় happy থাকিস। হাসিস। আর নিজের মতোই থাকিস। 🤍",
    "— From someone who's really glad you found your way back. ❤️"
  ];

  let currentLine = 0;

  function typeFinalLine() {
    if (currentLine >= finalLines.length) return;

    const paragraph = document.createElement("p");
    paragraph.className = "finalTypingLine";
    box.appendChild(paragraph);

    paragraph.scrollIntoView({ behavior: "smooth", block: "center" });

    const text = finalLines[currentLine];
    let i = 0;

    window.activeTypingTimer = setInterval(() => {
      paragraph.textContent = text.substring(0, i + 1);
      i++;
      if (i >= text.length) {
        clearInterval(window.activeTypingTimer);
        window.activeTypingTimer = null;
        currentLine++;
        setTimeout(typeFinalLine, 1200);
      }
    }, 45);
  }

  setTimeout(typeFinalLine, 1000);
}

/* =========================
   PAGE LOAD
   ========================= */
window.addEventListener("load", () => {
  goToStep(0);
});
