// Плавная прокрутка по разделам
document.querySelectorAll('.navigation-link, .footer-links a, .hero-link, .about-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const hash = this.getAttribute('href');
        if (hash && hash.startsWith('#') && hash !== '#') {
            e.preventDefault();
            const target = document.querySelector(hash);
            if (target) {
                const navHeight = document.querySelector('.navigation').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Карусель слайдер для раздела "Наши работы"
const track = document.getElementById('worksTrack');
const prevBtn = document.getElementById('worksPrev');
const nextBtn = document.getElementById('worksNext');
const dotsContainer = document.getElementById('worksDots');

let currentIndex = 0;
let itemsPerView = 4;
let totalItems = 0;
let autoSlideInterval;

function updateItemsPerView() {
    if (window.innerWidth <= 768) {
        itemsPerView = 1;
    } else if (window.innerWidth <= 992) {
        itemsPerView = 2;
    } else if (window.innerWidth <= 1200) {
        itemsPerView = 3;
    } else {
        itemsPerView = 4;
    }
}

function getWorkItems() {
    return document.querySelectorAll('.work-item');
}

function updateDots() {
    if (!dotsContainer) return;
    const items = getWorkItems();
    totalItems = items.length;
    const dotsCount = Math.ceil(totalItems / itemsPerView);
    
    dotsContainer.innerHTML = '';
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function goToSlide(index) {
    const items = getWorkItems();
    totalItems = items.length;
    const maxIndex = Math.ceil(totalItems / itemsPerView) - 1;
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    
    const slideWidth = items[0]?.offsetWidth + 20 || 270;
    const offset = currentIndex * itemsPerView * slideWidth;
    track.style.transform = `translateX(-${offset}px)`;
    
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

function nextSlide() {
    const items = getWorkItems();
    totalItems = items.length;
    const maxIndex = Math.ceil(totalItems / itemsPerView) - 1;
    if (currentIndex < maxIndex) {
        goToSlide(currentIndex + 1);
    } else {
        goToSlide(0);
    }
}

function prevSlide() {
    const items = getWorkItems();
    totalItems = items.length;
    const maxIndex = Math.ceil(totalItems / itemsPerView) - 1;
    if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
    } else {
        goToSlide(maxIndex);
    }
}

function initSlider() {
    updateItemsPerView();
    updateDots();
    goToSlide(0);
    
    if (prevBtn && nextBtn) {
        prevBtn.removeEventListener('click', prevSlide);
        nextBtn.removeEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }
}

window.addEventListener('resize', () => {
    initSlider();
});

setTimeout(() => {
    initSlider();
}, 100);

function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
        if (window.innerWidth <= 768) {
            nextSlide();
        }
    }, 4000);
}

function stopAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
}

if (track) {
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);
    startAutoSlide();
}

document.addEventListener('DOMContentLoaded', () => {
    initSlider();
});
