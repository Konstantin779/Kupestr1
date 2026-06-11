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

// Карусель слайдер для раздела "Наши работы" с поддержкой свайпов
const track = document.getElementById('worksTrack');
const prevBtn = document.getElementById('worksPrev');
const nextBtn = document.getElementById('worksNext');
const dotsContainer = document.getElementById('worksDots');
const sliderContainer = document.querySelector('.works-slider-container');

let currentIndex = 0;
let itemsPerView = 4;
let totalItems = 0;
let autoSlideInterval;

// Переменные для свайпов
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

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

// Обработчики свайпов для телефона
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    touchEndX = event.touches[0].clientX;
    touchEndY = event.touches[0].clientY;
}

function handleTouchEnd() {
    // Проверяем горизонтальный свайп (игнорируем вертикальную прокрутку)
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Если горизонтальное движение больше вертикального (свайп влево/вправо)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
        if (deltaX > 0) {
            // Свайп вправо - предыдущий слайд
            prevSlide();
        } else {
            // Свайп влево - следующий слайд
            nextSlide();
        }
    }
    
    // Сброс
    touchStartX = 0;
    touchEndX = 0;
    touchStartY = 0;
    touchEndY = 0;
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
    
    // Добавляем обработчики свайпов для слайдера
    if (track) {
        track.removeEventListener('touchstart', handleTouchStart);
        track.removeEventListener('touchmove', handleTouchMove);
        track.removeEventListener('touchend', handleTouchEnd);
        track.addEventListener('touchstart', handleTouchStart);
        track.addEventListener('touchmove', handleTouchMove);
        track.addEventListener('touchend', handleTouchEnd);
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
