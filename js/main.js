/* ===================== CONFIG ===================== */
// TODO: Ganti dengan URL gambar bunga / foto yang tersedia
const IMAGES = {
  // Bunga / hiasan (silakan ganti dengan gambar bunga Anda)
  floralLeft: "https://res.cloudinary.com/lyxngneo/image/upload/v1787854108/b-1.webp",
  floralRight: "https://res.cloudinary.com/lyxngneo/image/upload/v1787854108/b-1.webp",

  // Foto mempelai
  groom: "https://res.cloudinary.com/lyxngneo/image/upload/v1787851994/pria.webp",
  bride: "https://res.cloudinary.com/lyxngneo/image/upload/v1787851994/w.webp",

  // Galeri (silakan ganti sesuai keinginan)
  gallery: [
    "https://res.cloudinary.com/lyxngneo/image/upload/v1787851994/1.webp",
    "https://res.cloudinary.com/lyxngneo/image/upload/v1787851994/3.webp",
    "https://res.cloudinary.com/lyxngneo/image/upload/v1787851994/4.webp",
    "https://res.cloudinary.com/lyxngneo/image/upload/v1787851994/5.webp",
    "https://res.cloudinary.com/lyxngneo/image/upload/v1787851994/pria.webp",
    "https://res.cloudinary.com/lyxngneo/image/upload/v1787851994/w.webp",
  ],
};

// Musik pengiring (ganti jika memiliki file musik sendiri)
const MUSIC_URL = ""; // contoh: "https://.../lagu.mp3"

// Tanggal acara pernikahan (satu-satunya tempat mengatur tanggal;
// countdown & semua label tanggal akan mengikuti otomatis)
const EVENT_DATES = {
  akad: new Date("2026-09-10T09:00:00+07:00"),
  resepsi: new Date("2026-09-12T11:00:00+07:00"),
};

// Konfigurasi API untuk RSVP & Komentar.
// Komentar menggunakan Google Spreadsheet (Apps Script).
// Isi dengan URL Web App hasil deploy Apps Script (lihat apps-script.gs).
// Contoh: "https://script.google.com/macros/s/XXXXX/exec"
const API = {
  rsvp: null,      // contoh: "https://api.example.com/rsvp"
  comment: "https://script.google.com/macros/s/AKfycbw5t3X7HRhu5gvYfNUB1_uW_U-soDl7heN3aEYGtezDN5DaLXEssPUEaAjfqwwMFoqh/exec",   // contoh: "https://script.google.com/macros/s/XXXXX/exec"
};

/* ===================== SETUP IMAGES ===================== */
function buildCoverParticles() {
  const wrap = document.getElementById("coverParticles");
  if (!wrap) return;
  const isSmall = window.innerWidth < 640;
  const count = isSmall ? 22 : 42;
  wrap.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "cover-particle";
    const size = (3 + Math.random() * 7).toFixed(1);
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.left = Math.random() * 100 + "%";
    p.style.setProperty("--sway", `${(Math.random() * 60 - 30).toFixed(0)}px`);
    p.style.animationDuration = `${(6 + Math.random() * 8).toFixed(1)}s`;
    p.style.animationDelay = `${(Math.random() * 8).toFixed(1)}s`;
    wrap.appendChild(p);
  }
}

function setupImages() {
  buildCoverParticles();
  const groomImg = document.querySelector(".person:first-of-type .person-img img");
  const brideImg = document.querySelector(".person:last-of-type .person-img img");

  if (groomImg) groomImg.src = IMAGES.groom;
  if (brideImg) brideImg.src = IMAGES.bride;

  // Galeri
  const grid = document.getElementById("galleryGrid");
  if (grid) {
    grid.innerHTML = "";
    IMAGES.gallery.forEach((src) => {
      const item = document.createElement("div");
      item.className = "g-item";
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Galeri";
      img.loading = "lazy";
      item.appendChild(img);
      grid.appendChild(item);
    });
  }

  // Hero flowers (opsional - hapus jika tidak ingin)
  const ftLeft = document.querySelector(".ft-left");
  const ftRight = document.querySelector(".ft-right");
  if (ftLeft) ftLeft.src = IMAGES.floralLeft;
  if (ftRight) ftRight.src = IMAGES.floralRight;
}

/* ===================== COVER LOGIC ===================== */
function initCover() {
  const openBtn = document.getElementById("openBtn");
  const cover = document.getElementById("cover");
  const main = document.getElementById("main");
  const floatbar = document.getElementById("floatbar");

  openBtn.addEventListener("click", () => {
    cover.classList.add("leaving");
    setTimeout(() => {
      cover.style.display = "none";
      main.classList.remove("hidden");
      main.classList.add("entered");
      floatbar.classList.remove("hidden");
      playMusic();
      initReveal();
    }, 650);
  });
}

/* ===================== MUSIC ===================== */
function initMusic() {
  const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("musicBtn");
  if (MUSIC_URL) audio.src = MUSIC_URL;

  btn.addEventListener("click", () => {
    if (audio.paused) playMusic();
    else pauseMusic();
  });
}

function playMusic() {
  const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("musicBtn");
  audio.play().catch(() => {});
  btn.classList.add("playing");
}

function pauseMusic() {
  const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("musicBtn");
  audio.pause();
  btn.classList.remove("playing");
}

/* ===================== COUNTDOWN ===================== */
function applyEventDate() {
  const id = { timeZone: "Asia/Jakarta" };
  const fmt = (d, opts) => d.toLocaleDateString("id-ID", { ...opts, ...id });
  const long = (d) => fmt(d, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const coverDates = document.querySelectorAll(".cover-date");
  if (coverDates[0]) coverDates[0].textContent = long(EVENT_DATES.akad);
  if (coverDates[1]) coverDates[1].textContent = long(EVENT_DATES.resepsi);

  const cards = document.querySelectorAll(".event-card");
  cards.forEach((card, i) => {
    const d = i === 0 ? EVENT_DATES.akad : EVENT_DATES.resepsi;
    const evDay = card.querySelector(".ev-day");
    const evNum = card.querySelector(".ev-date-num");
    const evMonth = card.querySelector(".ev-month");
    if (evDay) evDay.textContent = fmt(d, { weekday: "long" });
    if (evNum) evNum.textContent = fmt(d, { day: "numeric" });
    if (evMonth) evMonth.textContent = fmt(d, { month: "long", year: "numeric" });
  });

  const rsvpSub = document.querySelector("#rsvp .section-sub");
  if (rsvpSub) {
    const dl = new Date(EVENT_DATES.akad.getTime() - 6 * 86400000);
    rsvpSub.textContent = `Mohon konfirmasi kehadiran Anda sebelum ${fmt(dl, { day: "numeric", month: "long", year: "numeric" })}`;
  }
}

function initCountdown() {
  const daysEl = document.getElementById("cdDays");
  const hoursEl = document.getElementById("cdHours");
  const minsEl = document.getElementById("cdMins");
  const secsEl = document.getElementById("cdSecs");

  function update() {
    const now = new Date();
    const diff = EVENT_DATES.akad - now;
    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(mins).padStart(2, "0");
    secsEl.textContent = String(secs).padStart(2, "0");
  }
  update();
  setInterval(update, 1000);
}

/* ===================== SCROLL REVEAL ===================== */
function initReveal() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
}

/* ===================== GALLERY LIGHTBOX ===================== */
function initGallery() {
  const grid = document.getElementById("galleryGrid");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbClose = document.getElementById("lbClose");

  grid.addEventListener("click", (e) => {
    const img = e.target.closest(".g-item img");
    if (!img) return;
    lbImg.src = img.src;
    lightbox.classList.remove("hidden");
  });

  lbClose.addEventListener("click", () => lightbox.classList.add("hidden"));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.add("hidden");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") lightbox.classList.add("hidden");
  });
}

/* ===================== RSVP ===================== */
function initRsvp() {
  const form = document.getElementById("rsvpForm");
  const msg = document.getElementById("rsvpMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("rsvpName").value.trim();
    const count = document.getElementById("rsvpCount").value;
    const attendance = form.querySelector('input[name="attendance"]:checked').value;

    const data = {
      name,
      count: Number(count),
      attendance,
      timestamp: new Date().toISOString(),
    };

    if (API.rsvp) {
      try {
        const res = await fetch(API.rsvp, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error();
        showMsg(msg, "Terima kasih, konfirmasi kehadiran Anda telah diterima.", true);
      } catch {
        showMsg(msg, "Maaf, terjadi kesalahan. Silakan coba lagi.", false);
      }
    } else {
      // Simpan lokal (demo)
      const list = JSON.parse(localStorage.getItem("rsvp") || "[]");
      list.push(data);
      localStorage.setItem("rsvp", JSON.stringify(list));
      showMsg(msg, "Terima kasih, konfirmasi kehadiran Anda telah diterima.", true);
    }
    form.reset();
  });
}

/* ===================== COMMENT ===================== */
function initComment() {
  const form = document.getElementById("commentForm");
  const msg = document.getElementById("commentMsg");
  const listEl = document.getElementById("commentsList");

  function avatarLetter(name) {
    return name ? name.charAt(0).toUpperCase() : "?";
  }

  function dateLabel(d) {
    const dt = new Date(d);
    if (isNaN(dt)) return "";
    return dt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function renderComment(item) {
    const div = document.createElement("div");
    div.className = "comment-item";
    div.innerHTML = `
      <div class="c-head">
        <span class="c-avatar">${avatarLetter(item.name)}</span>
        <div>
          <p class="c-name">${escapeHtml(item.name)}</p>
          <p class="c-date">${item.now || dateLabel(item.timestamp || Date.now())}</p>
        </div>
      </div>
      <p class="c-text">${escapeHtml(item.message)}</p>
    `;
    return div;
  }

  // Muat komentar dari Google Spreadsheet (Apps Script)
  if (API.comment) {
    fetch(API.comment)
      .then((res) => res.json())
      .then((rows) => {
        rows.forEach((c) => listEl.appendChild(renderComment(c)));
      })
      .catch(() => {});
  } else {
    // Fallback: simpan di localStorage selama URL belum diisi
    const stored = JSON.parse(localStorage.getItem("comments") || "[]");
    stored.forEach((c) => listEl.appendChild(renderComment(c)));
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("commentName").value.trim();
    const message = document.getElementById("commentText").value.trim();

    const item = {
      name,
      message,
      now: "Baru saja",
      timestamp: Date.now(),
    };

    if (API.comment) {
      try {
        // Tanpa header Content-Type agar tidak memicu CORS preflight
        const res = await fetch(API.comment, {
          method: "POST",
          body: JSON.stringify({ name, message }),
        });
        if (!res.ok) throw new Error();
        listEl.prepend(renderComment(item));
        showMsg(msg, "Terima kasih atas doa dan ucapannya!", true);
      } catch {
        showMsg(msg, "Maaf, terjadi kesalahan. Silakan coba lagi.", false);
      }
    } else {
      const list = JSON.parse(localStorage.getItem("comments") || "[]");
      list.unshift(item);
      localStorage.setItem("comments", JSON.stringify(list));
      listEl.prepend(renderComment(item));
      showMsg(msg, "Terima kasih atas doa dan ucapannya!", true);
    }
    form.reset();
  });
}

/* ===================== GIFT COPY ===================== */
function initCopy() {
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy");
      const original = btn.textContent;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          btn.textContent = "Tersalin!";
          setTimeout(() => (btn.textContent = original), 2000);
        })
        .catch(() => {});
    });
  });
}

/* ===================== PERSONAL GUEST NAME ===================== */
function initGuestName() {
  const el = document.getElementById("coverGuest");
  if (!el) return;
  const name = (new URLSearchParams(window.location.search).get("to") || "").trim();
  if (!name) {
    el.remove();
    return;
  }
  const decoded = decodeURIComponent(name);
  el.innerHTML = `Kepada Yth. Bapak/Ibu/Saudara/i <span class="guest-name">${escapeHtml(decoded)}</span>`;
  document.title = `Undangan Pernikahan Ananda & Kirana - ${decoded}`;
}

/* ===================== HELPERS ===================== */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function showMsg(el, text, success) {
  el.textContent = text;
  el.classList.toggle("success", success);
  setTimeout(() => {
    el.textContent = "";
    el.classList.remove("success");
  }, 4000);
}

/* ===================== INIT ===================== */
document.addEventListener("DOMContentLoaded", () => {
  setupImages();
  initGuestName();
  let t;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(buildCoverParticles, 150);
  });
  initCover();
  initMusic();
  initCountdown();
  applyEventDate();
  initGallery();
  initRsvp();
  initComment();
  initCopy();
});
