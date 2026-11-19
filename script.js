const envelope = document.getElementById("openEnvelope");
const welcome = document.getElementById("welcome");
const celebration = document.getElementById("celebration");
const replayButton = document.getElementById("replayButton");
const heartContainer = document.querySelector(".floating-hearts");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
const pages = Array.from(document.querySelectorAll(".journey-page"));
const progress = document.getElementById("journeyProgress");
const pageLabel = document.getElementById("journeyPageLabel");
const counter = document.getElementById("navCounter");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const wishButton = document.getElementById("wishButton");
const wishHint = document.getElementById("wishHint");
const wishResponse = document.getElementById("wishResponse");
const giftButton = document.getElementById("giftButton");
const giftHint = document.getElementById("giftHint");
const giftMessage = document.getElementById("giftMessage");
const journeyLabels = ["Birthday greeting", "Little things I love", "Make a wish", "Your surprise"];

let particles = [];
let animationFrame = null;
let currentPage = 0;
let envelopeOpened = false;

function createFloatingHearts() {
  const colors = ["rgba(184,77,103,.55)", "rgba(217,110,137,.48)", "rgba(199,154,83,.46)", "rgba(238,157,179,.62)"];
  for (let i = 0; i < 20; i += 1) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = i % 3 === 0 ? "♡" : "♥";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    heart.style.fontSize = `${14 + Math.random() * 18}px`;
    heart.style.animationDuration = `${9 + Math.random() * 9}s`;
    heart.style.animationDelay = `${Math.random() * -18}s`;
    heartContainer.appendChild(heart);
  }
}

function resizeCanvas() {
  const scale = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * scale;
  canvas.height = window.innerHeight * scale;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function createConfetti(count = 170) {
  const colors = ["#b84d67", "#edabb9", "#c79a53", "#fff4e8", "#d9a6b1"];
  particles = Array.from({ length: count }, (_, index) => ({
    x: window.innerWidth * (0.25 + Math.random() * 0.5),
    y: window.innerHeight * (0.38 + Math.random() * 0.08),
    vx: (Math.random() - 0.5) * (index % 2 ? 11 : 8),
    vy: -5 - Math.random() * 10,
    gravity: 0.14 + Math.random() * 0.08,
    size: 5 + Math.random() * 7,
    rotation: Math.random() * Math.PI,
    rotationSpeed: (Math.random() - 0.5) * 0.22,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: Math.random() > 0.78 ? "heart" : "paper"
  }));
}

function drawHeart(x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI);
  ctx.beginPath();
  ctx.moveTo(0, size * 0.2);
  ctx.bezierCurveTo(-size, -size * 0.55, -size * 1.5, size * 0.6, 0, size);
  ctx.bezierCurveTo(size * 1.5, size * 0.6, size, -size * 0.55, 0, size * 0.2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((particle) => particle.y < window.innerHeight + 30);

  particles.forEach((particle) => {
    particle.vy += particle.gravity;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.995;
    particle.rotation += particle.rotationSpeed;

    if (particle.shape === "heart") {
      drawHeart(particle.x, particle.y, particle.size * 0.28, particle.color);
      return;
    }

    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = particle.color;
    ctx.fillRect(-particle.size / 2, -particle.size / 3, particle.size, particle.size * 0.66);
    ctx.restore();
  });

  if (particles.length > 0) {
    animationFrame = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    animationFrame = null;
  }
}

function launchConfetti(count = 170) {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  createConfetti(count);
  animateConfetti();
}

function renderPage(index) {
  currentPage = Math.max(0, Math.min(index, pages.length - 1));
  pages.forEach((page, pageIndex) => {
    const isActive = pageIndex === currentPage;
    page.classList.toggle("active", isActive);
    page.setAttribute("aria-hidden", String(!isActive));
  });

  Array.from(progress.children).forEach((dot, dotIndex) => {
    const isActive = dotIndex === currentPage;
    dot.classList.toggle("active", isActive);
    if (isActive) {
      dot.setAttribute("aria-current", "step");
    } else {
      dot.removeAttribute("aria-current");
    }
  });

  pageLabel.textContent = journeyLabels[currentPage];
  counter.textContent = `${String(currentPage + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`;
  backButton.disabled = currentPage === 0;
  nextButton.hidden = currentPage === pages.length - 1;
  celebration.scrollTop = 0;
}

function makeProgressDots() {
  journeyLabels.forEach((label, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "progress-dot";
    dot.setAttribute("aria-label", `Go to ${label}`);
    dot.addEventListener("click", () => renderPage(index));
    progress.appendChild(dot);
  });
}

function celebrate() {
  if (envelopeOpened) return;
  envelopeOpened = true;
  envelope.classList.add("open");
  window.setTimeout(() => {
    welcome.classList.add("opened");
    celebration.classList.add("visible");
    celebration.setAttribute("aria-hidden", "false");
    renderPage(0);
    resizeCanvas();
    launchConfetti();
  }, 850);
}

envelope.addEventListener("click", celebrate);

backButton.addEventListener("click", () => renderPage(currentPage - 1));
nextButton.addEventListener("click", () => renderPage(currentPage + 1));

document.querySelectorAll(".memory-card").forEach((card) => {
  card.addEventListener("click", () => {
    const isFlipped = card.classList.toggle("flipped");
    card.setAttribute("aria-pressed", String(isFlipped));
  });
});

wishButton.addEventListener("click", () => {
  if (wishButton.disabled) return;
  wishButton.classList.add("bloomed");
  wishButton.disabled = true;
  wishButton.setAttribute("aria-pressed", "true");
  wishHint.textContent = "Your wish has bloomed!";
  wishResponse.textContent = "Inshallah our nikkah will happen soon my wife🫴🫂. Don't worry Aamina Allah is with us🫂🫂. Inshallah he will take care of everything🫴🫂 ♥";
  launchConfetti(100);
});

giftButton.addEventListener("click", () => {
  const isOpen = giftButton.classList.toggle("opened");
  giftButton.setAttribute("aria-expanded", String(isOpen));
  giftMessage.classList.toggle("visible", isOpen);
  giftMessage.setAttribute("aria-hidden", String(!isOpen));
  giftHint.textContent = isOpen ? "Surprise, my love!" : "Tap the gift to open it";
  if (isOpen) launchConfetti(110);
});

replayButton.addEventListener("click", () => {
  celebration.classList.remove("visible");
  celebration.setAttribute("aria-hidden", "true");
  welcome.classList.remove("opened");
  envelopeOpened = false;
  renderPage(0);

  document.querySelectorAll(".memory-card").forEach((card) => {
    card.classList.remove("flipped");
    card.setAttribute("aria-pressed", "false");
  });
  wishButton.classList.remove("bloomed");
  wishButton.disabled = false;
  wishButton.setAttribute("aria-pressed", "false");
  wishHint.textContent = "Tap to bloom";
  wishResponse.textContent = "";
  giftButton.classList.remove("opened");
  giftButton.setAttribute("aria-expanded", "false");
  giftMessage.classList.remove("visible");
  giftMessage.setAttribute("aria-hidden", "true");
  giftHint.textContent = "Tap the gift to open it";
  particles = [];
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  window.setTimeout(() => envelope.classList.remove("open"), 500);
});

makeProgressDots();
renderPage(0);
createFloatingHearts();
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
