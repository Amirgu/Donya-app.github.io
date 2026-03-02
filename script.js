const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionText = document.querySelector('.question');
const subtext = document.getElementById('subtext');
const yayContainer = document.getElementById('yayContainer');
const buttonContainer = document.querySelector('.button-container');
const card = document.querySelector('.card');

let yesScale = 1;
let isCelebrating = false;

function growYesButton(step = 0.12) {
    yesScale = Math.min(yesScale + step, 2.8);
    yesBtn.style.transform = `scale(${yesScale.toFixed(2)})`;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function moveNoButtonRandom() {
    const containerRect = buttonContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const maxLeft = Math.max(0, containerRect.width - btnRect.width);
    const maxTop = Math.max(0, containerRect.height - btnRect.height);

    noBtn.style.left = `${Math.random() * maxLeft}px`;
    noBtn.style.top = `${Math.random() * maxTop}px`;
}

function repelNoButton(cursorX, cursorY) {
    if (isCelebrating) {
        return;
    }

    const containerRect = buttonContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const dx = btnCenterX - cursorX;
    const dy = btnCenterY - cursorY;
    const distance = Math.hypot(dx, dy);
    const dangerRadius = 170;

    if (distance >= dangerRadius) {
        return;
    }

    const strength = (dangerRadius - distance) / dangerRadius;
    const pushDistance = 180 * strength + 40;
    const normalizedX = distance === 0 ? (Math.random() - 0.5) : dx / distance;
    const normalizedY = distance === 0 ? (Math.random() - 0.5) : dy / distance;

    const currentLeft = noBtn.offsetLeft;
    const currentTop = noBtn.offsetTop;

    const maxLeft = containerRect.width - btnRect.width;
    const maxTop = containerRect.height - btnRect.height;

    const jitter = () => (Math.random() - 0.5) * 22;

    const nextLeft = clamp(currentLeft + normalizedX * pushDistance + jitter(), 0, maxLeft);
    const nextTop = clamp(currentTop + normalizedY * pushDistance + jitter(), 0, maxTop);

    noBtn.style.left = `${nextLeft}px`;
    noBtn.style.top = `${nextTop}px`;

    growYesButton(0.04 + strength * 0.07);
}

noBtn.addEventListener('mouseenter', (event) => {
    event.preventDefault();
    moveNoButtonRandom();
    growYesButton(0.2);
});

noBtn.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    moveNoButtonRandom();
    growYesButton(0.24);
});

noBtn.addEventListener('touchstart', (event) => {
    event.preventDefault();
    moveNoButtonRandom();
    growYesButton(0.24);
}, { passive: false });

card.addEventListener('mousemove', (event) => {
    repelNoButton(event.clientX, event.clientY);
});

yesBtn.addEventListener('click', () => {
    isCelebrating = true;
    questionText.innerHTML = 'donya will you be my valentine? <br> YAY! 🎉';
    buttonContainer.style.display = 'none';
    subtext.style.display = 'none';
    yayContainer.style.display = 'block';
});

// Set an initial random position so "No" is already harder to catch.
moveNoButtonRandom();
