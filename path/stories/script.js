const gridItems = document.querySelectorAll('.grid-item');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modal-text');
const modalImage = document.getElementById('modal-image');
const closeButton = document.querySelector('.close-button');

gridItems.forEach(item => {
    item.addEventListener('click', () => {
        const text = item.dataset.text;
        const imageSrc = item.dataset.image;
        const link = item.dataset.link;

        let html = '';
        if (text) {
            html += `<div style="margin-bottom:20px;">${text}</div>`;
        }
        if (link) {
            html += `<a href="story3.html" class="read-here-btn" style="display:inline-block;margin-top:10px;padding:8px 18px;background:#007bff;color:#fff;border-radius:6px;text-decoration:none;font-weight:500;font-size:1em;">Читать здесь</a>`;
        }
        modalText.innerHTML = html;
        modalImage.src = imageSrc;
        modal.style.display = 'block';

        // Навешиваем обработчик на кнопку, чтобы открывать в этом же окне
        const btn = document.querySelector('.read-here-btn');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = link;
            });
        }
    });
});


closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});



