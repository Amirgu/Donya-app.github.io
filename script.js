const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionText = document.querySelector('.question');
const subtext = document.getElementById('subtext');
const yayContainer = document.getElementById('yayContainer');
const buttonContainer = document.querySelector('.button-container');

let yesScale = 1;

function growYesButton() {
    yesScale = Math.min(yesScale + 0.12, 2.8);
    yesBtn.style.transform = `scale(${yesScale})`;
}

function moveNoButton() {
    const containerRect = buttonContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const maxLeft = containerRect.width - btnRect.width;
    const maxTop = containerRect.height - btnRect.height;

    const newLeft = Math.max(0, Math.random() * maxLeft);
    const newTop = Math.max(0, Math.random() * maxTop);

    noBtn.style.left = `${newLeft}px`;
    noBtn.style.top = `${newTop}px`;
    noBtn.style.transform = 'translate(0, 0)';

    growYesButton();
}

['mouseenter', 'mouseover', 'touchstart', 'focus', 'pointerdown'].forEach((eventName) => {
    noBtn.addEventListener(eventName, (event) => {
        if (eventName === 'touchstart' || eventName === 'pointerdown') {
            event.preventDefault();
        }
        moveNoButton();
    });
});

buttonContainer.addEventListener('mousemove', (event) => {
    const noRect = noBtn.getBoundingClientRect();
    const distance = Math.hypot(
        event.clientX - (noRect.left + noRect.width / 2),
        event.clientY - (noRect.top + noRect.height / 2)
    );

    if (distance < 90) {
        moveNoButton();
    }
});

yesBtn.addEventListener('click', () => {
    questionText.innerHTML = 'donya will you be my valentine? <br> YAY! 🎉';
    buttonContainer.style.display = 'none';
    subtext.style.display = 'none';
    yayContainer.style.display = 'block';
});
