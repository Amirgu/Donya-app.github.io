// Splash screen — start music and reveal page
const splash = document.getElementById('splash');
const startBtn = document.getElementById('startBtn');
const bgMusic = document.getElementById('bgMusic');
const card = document.querySelector('.card');

startBtn.addEventListener('click', () => {
    bgMusic.play();
    splash.classList.add('hidden');
    setTimeout(() => {
        splash.style.display = 'none';
        card.style.display = '';
        document.getElementById('subtext').style.display = '';
    }, 800);
});

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionText = document.querySelector('.question');
const subtext = document.getElementById('subtext');
const yayContainer = document.getElementById('yayContainer');
const buttonContainer = document.querySelector('.button-container');

let yesScale = 1;
const FLEE_RADIUS = 150;
const MIN_FLEE_DISTANCE = 120;

// Smooth YES button growth with CSS transition
function growYesButton() {
    yesScale = Math.min(yesScale + 0.08, 3.2);
    yesBtn.style.transform = `scale(${yesScale})`;
}

// Move NO button away from cursor position (flee in opposite direction)
function fleeFrom(cursorX, cursorY) {
    const containerRect = buttonContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    // Vector from cursor to button center
    let dx = btnCenterX - cursorX;
    let dy = btnCenterY - cursorY;
    const dist = Math.hypot(dx, dy);

    // Normalize and apply minimum flee distance
    if (dist > 0) {
        dx = (dx / dist) * MIN_FLEE_DISTANCE;
        dy = (dy / dist) * MIN_FLEE_DISTANCE;
    } else {
        // Cursor is exactly on button — flee in a random direction
        const angle = Math.random() * Math.PI * 2;
        dx = Math.cos(angle) * MIN_FLEE_DISTANCE;
        dy = Math.sin(angle) * MIN_FLEE_DISTANCE;
    }

    // Add some randomness to make it unpredictable
    dx += (Math.random() - 0.5) * 60;
    dy += (Math.random() - 0.5) * 60;

    // Calculate new position relative to container
    let newLeft = (btnCenterX + dx) - containerRect.left - btnRect.width / 2;
    let newTop = (btnCenterY + dy) - containerRect.top - btnRect.height / 2;

    // Clamp within container bounds
    const maxLeft = containerRect.width - btnRect.width;
    const maxTop = containerRect.height - btnRect.height;
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    // If clamped position is still too close to cursor, teleport to opposite side
    const newCenterX = containerRect.left + newLeft + btnRect.width / 2;
    const newCenterY = containerRect.top + newTop + btnRect.height / 2;
    const newDist = Math.hypot(newCenterX - cursorX, newCenterY - cursorY);

    if (newDist < FLEE_RADIUS * 0.6) {
        // Teleport to a far corner or random far position
        const corners = [
            { left: 0, top: 0 },
            { left: maxLeft, top: 0 },
            { left: 0, top: maxTop },
            { left: maxLeft, top: maxTop },
        ];
        // Pick the corner farthest from cursor
        let bestCorner = corners[0];
        let bestDist = 0;
        for (const c of corners) {
            const cx = containerRect.left + c.left + btnRect.width / 2;
            const cy = containerRect.top + c.top + btnRect.height / 2;
            const d = Math.hypot(cx - cursorX, cy - cursorY);
            if (d > bestDist) {
                bestDist = d;
                bestCorner = c;
            }
        }
        newLeft = bestCorner.left;
        newTop = bestCorner.top;
    }

    noBtn.style.left = `${newLeft}px`;
    noBtn.style.top = `${newTop}px`;
    noBtn.style.transform = 'translate(0, 0)';

    growYesButton();
}

// Track mouse across the ENTIRE document for maximum evasion
document.addEventListener('mousemove', (event) => {
    const noRect = noBtn.getBoundingClientRect();
    const noCenterX = noRect.left + noRect.width / 2;
    const noCenterY = noRect.top + noRect.height / 2;
    const distance = Math.hypot(event.clientX - noCenterX, event.clientY - noCenterY);

    if (distance < FLEE_RADIUS) {
        fleeFrom(event.clientX, event.clientY);
    }
});

// Direct interaction events on the NO button — instant flee
['mouseenter', 'mouseover', 'pointerdown', 'touchstart', 'focus', 'click'].forEach((eventName) => {
    noBtn.addEventListener(eventName, (event) => {
        event.preventDefault();
        event.stopPropagation();
        const rect = noBtn.getBoundingClientRect();
        fleeFrom(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
});

// Touch move tracking — for mobile devices
document.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    const noRect = noBtn.getBoundingClientRect();
    const noCenterX = noRect.left + noRect.width / 2;
    const noCenterY = noRect.top + noRect.height / 2;
    const distance = Math.hypot(touch.clientX - noCenterX, touch.clientY - noCenterY);

    if (distance < FLEE_RADIUS) {
        fleeFrom(touch.clientX, touch.clientY);
    }
}, { passive: true });

// Touch start tracking — for mobile tap attempts
document.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    const noRect = noBtn.getBoundingClientRect();
    const noCenterX = noRect.left + noRect.width / 2;
    const noCenterY = noRect.top + noRect.height / 2;
    const distance = Math.hypot(touch.clientX - noCenterX, touch.clientY - noCenterY);

    if (distance < FLEE_RADIUS) {
        fleeFrom(touch.clientX, touch.clientY);
    }
}, { passive: true });

// YES button click — celebrate!
yesBtn.addEventListener('click', () => {
    questionText.innerHTML = 'donya will you be my valentine? <br> YAY! 🎉';
    buttonContainer.style.display = 'none';
    subtext.style.display = 'none';
    yayContainer.style.display = 'block';
});
