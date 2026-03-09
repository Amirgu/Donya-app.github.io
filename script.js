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
    questionText.innerHTML = 'wanna go on a date donya ? <br> YAY! 🎉';
    buttonContainer.style.display = 'none';
    subtext.style.display = 'none';
    yayContainer.style.display = 'block';
});

// Mobile flappy game (pink theme)
const flappyCanvas = document.getElementById('flappyCanvas');
const mobileScore = document.getElementById('mobileScore');
const restartFlappyBtn = document.getElementById('restartFlappyBtn');

if (flappyCanvas && mobileScore && restartFlappyBtn) {
    const ctx = flappyCanvas.getContext('2d');
    const W = flappyCanvas.width;
    const H = flappyCanvas.height;
    const GRAVITY = 0.38;
    const FLAP = -6.2;
    const PIPE_SPEED = 2.2;
    const PIPE_WIDTH = 64;
    const GAP = 140;
    const PIPE_INTERVAL = 1400;

    let bird;
    let pipes;
    let score;
    let gameOver;
    let started;
    let lastPipeAt;

    function resetGame() {
        bird = { x: 78, y: H / 2, r: 15, vy: 0 };
        pipes = [];
        score = 0;
        gameOver = false;
        started = false;
        lastPipeAt = performance.now();
        mobileScore.textContent = 'Score : 0';
    }

    function addPipe() {
        const minTop = 70;
        const maxTop = H - GAP - 70;
        const topHeight = Math.random() * (maxTop - minTop) + minTop;
        pipes.push({ x: W + 20, top: topHeight, passed: false });
    }

    function drawBg() {
        const gradient = ctx.createLinearGradient(0, 0, 0, H);
        gradient.addColorStop(0, '#ffc1df');
        gradient.addColorStop(1, '#ffecf6');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#ff9ac6';
        for (let i = 0; i < 6; i++) {
            const x = (i * 70 + (performance.now() * 0.02)) % (W + 80) - 40;
            ctx.beginPath();
            ctx.arc(x, 90 + (i % 2) * 36, 18, 0, Math.PI * 2);
            ctx.arc(x + 16, 90 + (i % 2) * 36, 14, 0, Math.PI * 2);
            ctx.arc(x - 16, 90 + (i % 2) * 36, 14, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawBird() {
        ctx.beginPath();
        ctx.fillStyle = '#ff4fa2';
        ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(bird.x + 5, bird.y - 5, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4a1530';
        ctx.beginPath();
        ctx.arc(bird.x + 6, bird.y - 5, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff2f8d';
        ctx.font = '14px Arial';
        ctx.fillText('❤', bird.x - 6, bird.y + 5);
    }

    function drawPipes() {
        for (const pipe of pipes) {
            ctx.fillStyle = '#ff7eb7';
            ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
            ctx.fillRect(pipe.x, pipe.top + GAP, PIPE_WIDTH, H - (pipe.top + GAP));

            ctx.fillStyle = '#ff4fa2';
            ctx.fillRect(pipe.x - 4, pipe.top - 14, PIPE_WIDTH + 8, 14);
            ctx.fillRect(pipe.x - 4, pipe.top + GAP, PIPE_WIDTH + 8, 14);
        }
    }

    function drawOverlay() {
        if (!started || gameOver) {
            ctx.fillStyle = 'rgba(255,255,255,0.55)';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#c2185b';
            ctx.textAlign = 'center';
            ctx.font = 'bold 24px Arial';
            ctx.fillText(gameOver ? 'Perdu 💔' : 'Tap pour jouer 💖', W / 2, H / 2 - 12);
            ctx.font = 'bold 16px Arial';
            ctx.fillText(gameOver ? 'Utilise Rejouer' : 'Évite les colonnes roses', W / 2, H / 2 + 24);
            ctx.textAlign = 'start';
        }
    }

    function checkCollision(pipe) {
        const hitPipeX = bird.x + bird.r > pipe.x && bird.x - bird.r < pipe.x + PIPE_WIDTH;
        const hitTop = bird.y - bird.r < pipe.top;
        const hitBottom = bird.y + bird.r > pipe.top + GAP;
        return hitPipeX && (hitTop || hitBottom);
    }

    function update(now) {
        drawBg();

        if (started && !gameOver) {
            bird.vy += GRAVITY;
            bird.y += bird.vy;

            if (now - lastPipeAt > PIPE_INTERVAL) {
                addPipe();
                lastPipeAt = now;
            }

            for (const pipe of pipes) {
                pipe.x -= PIPE_SPEED;

                if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
                    pipe.passed = true;
                    score += 1;
                    mobileScore.textContent = `Score : ${score}`;
                }

                if (checkCollision(pipe)) {
                    gameOver = true;
                }
            }

            pipes = pipes.filter((pipe) => pipe.x + PIPE_WIDTH > -10);

            if (bird.y + bird.r >= H || bird.y - bird.r <= 0) {
                gameOver = true;
            }
        }

        drawPipes();
        drawBird();
        drawOverlay();
        requestAnimationFrame(update);
    }

    function flap() {
        if (gameOver) return;
        started = true;
        bird.vy = FLAP;
    }

    flappyCanvas.addEventListener('pointerdown', flap);
    flappyCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        flap();
    }, { passive: false });

    restartFlappyBtn.addEventListener('click', () => {
        resetGame();
    });

    resetGame();
    requestAnimationFrame(update);
}
