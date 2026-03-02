const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionText = document.querySelector('.question');
const subtext = document.getElementById('subtext');
const yayContainer = document.getElementById('yayContainer');
const buttonContainer = document.querySelector('.button-container');

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

noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

yesBtn.addEventListener('click', () => {
    questionText.innerHTML = 'donya will you be my valentine? <br> YAY! 🎉';
    buttonContainer.style.display = 'none';
    subtext.style.display = 'none';
    yayContainer.style.display = 'block';
});
