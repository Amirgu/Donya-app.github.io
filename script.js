const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionText = document.querySelector('.question');
const subtext = document.getElementById('subtext');
const yayContainer = document.getElementById('yayContainer');
const buttonContainer = document.querySelector('.button-container');
let yesScale = 1;

function growYesButton() {
    yesScale += 0.12;
    yesBtn.style.transform = `scale(${yesScale.toFixed(2)})`;
}

function moveNoButton() {
    const containerRect = buttonContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const newLeft = Math.random() * (containerRect.width - btnRect.width);
    const newTop = Math.random() * (containerRect.height - btnRect.height);

    noBtn.style.left = `${newLeft}px`;
    noBtn.style.top = `${newTop}px`;

    if (noBtn.style.position !== 'absolute') {
        noBtn.style.position = 'absolute';
    }
}

function isMouseCloseToNoButton(event) {
    const rect = noBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
    return distance < 110;
}

noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('mouseenter', (e) => {
    e.preventDefault();
    moveNoButton();
    growYesButton();
});
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
    growYesButton();
});
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
    growYesButton();
});

document.addEventListener('mousemove', (event) => {
    if (isMouseCloseToNoButton(event)) {
        moveNoButton();
    }
});

yesBtn.addEventListener('click', () => {
    questionText.innerHTML = 'donya will you be my valentine? <br> YAY! 🎉';
    buttonContainer.style.display = 'none';
    subtext.style.display = 'none';
    yayContainer.style.display = 'block';
});
