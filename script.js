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
let isSwiping = false;

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
    track.style.transition = 'transform 0.3s ease';
    
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

// Обработчики свайпов для телефона (вешаем на весь контейнер)
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    isSwiping = true;
}

function handleTouchMove(event) {
    if (!isSwiping) return;
    touchEndX = event.touches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    
    // Легкое сопротивление при свайпе - показываем что происходит движение
    const items = getWorkItems();
    const slideWidth = items[0]?.offsetWidth + 20 || 270;
    const offset = currentIndex * itemsPerView * slideWidth;
    const dragOffset = offset + deltaX * 0.5; // 0.5 - сопротивление для плавности
    
    track.style.transform = `translateX(-${dragOffset}px)`;
    track.style.transition = 'none';
}

function handleTouchEnd(event) {
    if (!isSwiping) return;
    isSwiping = false;
    
    const deltaX = touchEndX - touchStartX;
    const threshold = 50; // Минимальное расстояние для свайпа
    
    if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
            prevSlide();
        } else {
            nextSlide();
        }
    } else {
        // Возвращаем на место если свайп был слишком короткий
        const items = getWorkItems();
        const slideWidth = items[0]?.offsetWidth + 20 || 270;
        const offset = currentIndex * itemsPerView * slideWidth;
        track.style.transform = `translateX(-${offset}px)`;
        track.style.transition = 'transform 0.3s ease';
    }
    
    // Сброс
    touchStartX = 0;
    touchEndX = 0;
}

function initSlider() {
    updateItemsPerView();
    updateDots();
    goToSlide(0);
    
    if (prevBtn && nextBtn) {
        const newPrevBtn = prevBtn.cloneNode(true);
        const newNextBtn = nextBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        
        window.prevBtn = newPrevBtn;
        window.nextBtn = newNextBtn;
        
        newPrevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
        });
        newNextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
        });
    }
    
    // Добавляем обработчики свайпов на контейнер слайдера
    const sliderContainerElem = document.querySelector('.works-slider');
    if (sliderContainerElem) {
        sliderContainerElem.removeEventListener('touchstart', handleTouchStart);
        sliderContainerElem.removeEventListener('touchmove', handleTouchMove);
        sliderContainerElem.removeEventListener('touchend', handleTouchEnd);
        sliderContainerElem.addEventListener('touchstart', handleTouchStart);
        sliderContainerElem.addEventListener('touchmove', handleTouchMove);
        sliderContainerElem.addEventListener('touchend', handleTouchEnd);
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
    }, 5000);
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
