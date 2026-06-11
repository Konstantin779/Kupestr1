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

// === МОДАЛЬНОЕ ОКНО ===
const modalOverlay = document.getElementById('modalOverlay');
const callRequestBtn = document.getElementById('callRequestBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const callRequestForm = document.getElementById('callRequestForm');
const userPhone = document.getElementById('userPhone');
const formStatus = document.getElementById('formStatus');

// Открыть модалку
if (callRequestBtn) {
    callRequestBtn.addEventListener('click', () => {
        modalOverlay.style.display = 'flex';
        userPhone.value = '';
        formStatus.textContent = '';
        formStatus.className = 'form-status';
    });
}

// Закрыть модалку
function closeModal() {
    modalOverlay.style.display = 'none';
}
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

// Отправка формы на почту
if (callRequestForm) {
    callRequestForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const phone = userPhone.value.trim();
        if (!phone) {
            formStatus.textContent = 'Введите номер телефона';
            formStatus.className = 'form-status error';
            return;
        }
        
        formStatus.textContent = 'Отправка...';
        formStatus.className = 'form-status';
        
        try {
            const formData = new FormData();
            formData.append('email', 'pozhalov.mikhail@mail.ru');
            formData.append('phone', phone);
            formData.append('_subject', 'Новая заявка на звонок с сайта kupe102.ru');
            formData.append('_captcha', 'false');
            
            const response = await fetch('https://formsubmit.co/ajax/pozhalov.mikhail@mail.ru', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                formStatus.textContent = 'Спасибо! Мы перезвоним вам в ближайшее время.';
                formStatus.className = 'form-status';
                userPhone.value = '';
                setTimeout(() => {
                    closeModal();
                }, 2000);
            } else {
                throw new Error('Ошибка отправки');
            }
        } catch (error) {
            formStatus.textContent = 'Ошибка отправки. Попробуйте позже или позвоните по номеру.';
            formStatus.className = 'form-status error';
        }
    });
}

// === КАРУСЕЛЬ СЛАЙДЕР ===
const track = document.getElementById('worksTrack');
const prevBtn = document.getElementById('worksPrev');
const nextBtn = document.getElementById('worksNext');
const dotsContainer = document.getElementById('worksDots');

let currentIndex = 0;
let itemsPerView = 4;
let totalItems = 0;
let isTransitioning = false;

let touchStartX = 0;
let touchStartY = 0;

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
        dot.addEventListener('click', () => {
            if (!isTransitioning) {
                goToSlide(i);
            }
        });
        dotsContainer.appendChild(dot);
    }
}

function goToSlide(index) {
    if (isTransitioning) return;
    
    const items = getWorkItems();
    totalItems = items.length;
    const maxIndex = Math.ceil(totalItems / itemsPerView) - 1;
    const newIndex = Math.max(0, Math.min(index, maxIndex));
    
    if (newIndex === currentIndex) return;
    
    isTransitioning = true;
    currentIndex = newIndex;
    
    const slideWidth = items[0]?.offsetWidth + 20 || 270;
    const offset = currentIndex * itemsPerView * slideWidth;
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    track.style.transform = `translateX(-${offset}px)`;
    
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
    
    setTimeout(() => {
        isTransitioning = false;
    }, 450);
}

function nextSlide() {
    if (isTransitioning) return;
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
    if (isTransitioning) return;
    const items = getWorkItems();
    totalItems = items.length;
    const maxIndex = Math.ceil(totalItems / itemsPerView) - 1;
    if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
    } else {
        goToSlide(maxIndex);
    }
}

function handleTouchStart(event) {
    if (isTransitioning) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    if (isTransitioning) return;
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
        if (deltaX > 0) {
            prevSlide();
        } else {
            nextSlide();
        }
    }
}

function initSlider() {
    updateItemsPerView();
    updateDots();
    
    const items = getWorkItems();
    if (items.length > 0) {
        const slideWidth = items[0]?.offsetWidth + 20 || 270;
        const offset = currentIndex * itemsPerView * slideWidth;
        track.style.transition = 'none';
        track.style.transform = `translateX(-${offset}px)`;
        
        setTimeout(() => {
            track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }, 50);
    }
    
    if (prevBtn && nextBtn) {
        const newPrevBtn = prevBtn.cloneNode(true);
        const newNextBtn = nextBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        
        newPrevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
        });
        newNextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
        });
    }
    
    const sliderContainer = document.querySelector('.works-slider');
    if (sliderContainer) {
        sliderContainer.removeEventListener('touchstart', handleTouchStart);
        sliderContainer.removeEventListener('touchend', handleTouchEnd);
        sliderContainer.addEventListener('touchstart', handleTouchStart);
        sliderContainer.addEventListener('touchend', handleTouchEnd);
    }
}

window.addEventListener('resize', () => {
    currentIndex = 0;
    initSlider();
});

document.addEventListener('DOMContentLoaded', () => {
    initSlider();
});
