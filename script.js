let score = 0;

const contentSection = document.querySelector('.content');

function OnScore() {
    document.getElementById("stars").value = score + "⭐";
    localStorage.setItem('score', score.toString());
}

function OnAppl(element) {
    element.style.backgroundColor = element.getAttribute('color');

    const span = element.querySelector('span');
    if (span) {
        span.textContent = element.getAttribute('title') || "";
    }

    let plus = parseInt(element.getAttribute('plus')) || 0;
    let minus = parseInt(element.getAttribute('minus')) || 0;
    const textarea = element.querySelector('textarea');

    if (textarea) {
        textarea.value = "+".repeat(plus) + "-".repeat(minus);
    }

    const stars = element.getAttribute('stars') || "0";
    const starCounter = element.querySelector('.star-counter');
    if (starCounter) {
        starCounter.textContent = "☆ " + stars;
    }
}

function OnApplAll() {
    let papers = document.querySelectorAll('.paper');
    papers.forEach(p => OnAppl(p));
}

function OnAdd(element) {
    let plus = parseInt(element.getAttribute('plus')) || 0;
    let minus = parseInt(element.getAttribute('minus')) || 0;
    let stars = parseInt(element.getAttribute('stars')) || 0;

    if (plus < 65 && minus === 0) {
        element.setAttribute('plus', plus + 1);
    } else if (minus > 0) {
        element.setAttribute('minus', minus - 1);
    }

    if (plus + 1 === 65) {
        stars += 1;
        score += 1;
        OnScore();
        element.setAttribute('plus', 0);
        element.setAttribute('minus', 0);
        element.setAttribute('stars', stars);
    }

    const starCounter = element.querySelector('.star-counter');
    if (starCounter) {
        starCounter.textContent = "☆ " + stars;
    }

    OnAppl(element);
    saveData();
}

function OnMinus(element) {
    let plus = parseInt(element.getAttribute('plus')) || 0;
    let minus = parseInt(element.getAttribute('minus')) || 0;

    if (plus + minus < 65) {
        element.setAttribute('minus', minus + 1);
    }

    OnAppl(element);
    saveData();
}

function saveData() {
    const papers = document.querySelectorAll('.paper');
    let data = [];

    papers.forEach(p => {
        data.push({
            title: p.getAttribute('title'),
            color: p.getAttribute('color'),
            plus: p.getAttribute('plus'),
            minus: p.getAttribute('minus'),
            stars: p.getAttribute('stars') || "0"
        });
    });

    localStorage.setItem('papersData', JSON.stringify(data));
}

function loadData() {
    let savedScore = localStorage.getItem('score');
    if (savedScore !== null) {
        score = parseInt(savedScore, 10);
    } else {
        score = 0;
    }
    OnScore();

    const dataStr = localStorage.getItem('papersData');
    if (!dataStr) return;

    const data = JSON.parse(dataStr);
    contentSection.innerHTML = "";

    data.forEach(item => {
        const newPaper = document.createElement('div');
        newPaper.classList.add('paper');
        newPaper.setAttribute('title', item.title);
        newPaper.setAttribute('color', item.color);
        newPaper.setAttribute('plus', item.plus);
        newPaper.setAttribute('minus', item.minus);
        newPaper.setAttribute('stars', item.stars || "0");
        newPaper.setAttribute('draggable', true);
        newPaper.style.position = "relative";

        newPaper.innerHTML = `
            <span style="font-weight:bold; display:block; margin-bottom: 5px;">${item.title}</span>
            <div class="star-counter" style="position: absolute; top: 5px; right: 5px; font-weight:bold; color: #333;">⭐ ${item.stars || 0}</div>
            <hr/>
            <textarea readonly></textarea>
            <button class="m" aria-label="Remove minus">-</button>
            <button class="p" aria-label="Add plus">+</button>`;

        contentSection.appendChild(newPaper);
        OnAppl(newPaper);
    });
}

contentSection.addEventListener('click', (e) => {
    const target = e.target;

    if (target.classList.contains('p')) {
        const paper = target.closest('.paper');
        if (paper) OnAdd(paper);
    }

    if (target.classList.contains('m')) {
        const paper = target.closest('.paper');
        if (paper) OnMinus(paper);
    }
});

document.getElementById('toggleSidebar').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

document.getElementById('addButton').addEventListener('click', () => {
    const titleInput = document.getElementById('titleI');
    const colorSelect = document.getElementById('colors');
    const title = titleInput.value.trim();
    const color = colorSelect.value;

    if (title === "") {
        alert("Veuillez entrer un titre");
        return;
    }

    const newPaper = document.createElement('div');
    newPaper.classList.add('paper');
    newPaper.setAttribute('title', title);
    newPaper.setAttribute('color', color);
    newPaper.setAttribute('plus', 0);
    newPaper.setAttribute('minus', 0);
    newPaper.setAttribute('stars', 0);
    newPaper.setAttribute('draggable', true);
    newPaper.style.position = "relative";

    newPaper.innerHTML = `
        <span style="font-weight:bold; display:block; margin-bottom: 5px;">${title}</span>
        <div class="star-counter" style="position: absolute; top: 5px; right: 5px; font-weight:bold; color: #333;">⭐ 0</div>
        <hr/>
        <textarea readonly></textarea>
        <button class="m" aria-label="Remove minus">-</button>
        <button class="p" aria-label="Add plus">+</button>
    `;

    contentSection.appendChild(newPaper);

    OnAppl(newPaper);
    saveData();

    titleInput.value = "";
    colorSelect.selectedIndex = 0;
});

document.getElementById('resetButton').addEventListener('click', () => {
    if (confirm("هل أنت متأكد من إعادة التعيين؟ سيتم حذف كل البيانات المحفوظة.")) {
        localStorage.removeItem('papersData');
        localStorage.removeItem('score');
        contentSection.innerHTML = "";
        score = 0;
        OnScore();
    }
});

window.addEventListener('load', () => {
    loadData();
});
