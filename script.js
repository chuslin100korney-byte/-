/* =========================================================
   ООО Квинтет принт — скрипты
   ========================================================= */

(function () {
  'use strict';

  /* ===== Тема ===== */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('qp-theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('qp-theme', next);
    });
  }

  /* ===== Шапка при скролле ===== */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ===== Мобильное меню ===== */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', isOpen);
    });
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
      });
    });
  }

  /* ===== Анимация появления ===== */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  /* ===== Слайдер (зацикленный, по порядку, каждые 3 секунды) ===== */
  const track = document.getElementById('sliderTrack');
  if (track) {
    const slides = Array.from(track.children);
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    let currentIndex = 0;
    let autoplayTimer = null;

    // Создаем точки
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider__dot' + (i === 0 ? ' is-active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    function goTo(index) {
      // Зацикливание
      currentIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentIndex));
      resetAutoplay();
    }

    function next() { goTo(currentIndex + 1); }
    function prev() { goTo(currentIndex - 1); }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    function startAutoplay() {
      autoplayTimer = setInterval(next, 3000); // Каждые 3 секунды
    }
    
    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    startAutoplay();

    // Свайпы на телефоне
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
    }, { passive: true });
  }

  /* ===== FAQ ===== */
  document.querySelectorAll('.faq__item').forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        document.querySelectorAll('.faq__item').forEach(other => {
          other.classList.remove('is-open');
          other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq__answer').style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add('is-open');
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  /* ===== Модальное окно ===== */
  const modal = document.getElementById('modal');
  const orderForm = document.getElementById('orderForm');
  const serviceSelect = document.getElementById('service');
  const toast = document.getElementById('toast');

  window.openModal = function(serviceName) {
    if (!modal) return;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (serviceName && serviceSelect) serviceSelect.value = serviceName;
    setTimeout(() => document.getElementById('name').focus(), 100);
  }

  window.closeModal = function() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => window.openModal(btn.dataset.service || ''));
  });
  document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', window.closeModal);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) window.closeModal();
  });

  /* ===== Маска телефона ===== */
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '');
      if (digits.startsWith('8')) digits = '7' + digits.slice(1);
      if (!digits.startsWith('7')) digits = '7' + digits;
      digits = digits.slice(0, 11);
      let formatted = '+7';
      if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
      if (digits.length >= 5) formatted += ') ' + digits.slice(4, 7);
      if (digits.length >= 8) formatted += '-' + digits.slice(7, 9);
      if (digits.length >= 10) formatted += '-' + digits.slice(9, 11);
      e.target.value = formatted;
    });
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) phoneInput.value = '+7 (';
    });
    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value === '+7 (' || phoneInput.value === '+7') phoneInput.value = '';
    });
  }

  /* ===== Отправка формы ===== */
  function showError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (field) field.classList.add('is-invalid');
    if (errorEl) errorEl.textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll('.form__error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form input, .form select, .form textarea').forEach(el => el.classList.remove('is-invalid'));
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 4000);
  }

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const name = document.getElementById('name').value.trim();
      const address = document.getElementById('address').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const comment = document.getElementById('comment').value.trim();

      let hasError = false;
      if (name.length < 2) { showError('name', 'Укажите имя'); hasError = true; }
      if (address.length < 5) { showError('address', 'Укажите адрес'); hasError = true; }
      if (phone.replace(/\D/g, '').length !== 11) { showError('phone', 'Введите номер'); hasError = true; }
      if (!service) { showError('service', 'Выберите услугу'); hasError = true; }
      if (comment.length < 3) { showError('comment', 'Укажите модель'); hasError = true; }

      if (hasError) return;

      const submitBtn = orderForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем...';

      const formData = new FormData(orderForm);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      fetch(orderForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })
        .then(response => {
          clearTimeout(timeoutId);
          if (response.ok) {
            orderForm.reset();
            window.closeModal();
            showToast('Заявка отправлена! Мы свяжемся с вами.');
          } else { throw new Error(); }
        })
        .catch(() => {
          clearTimeout(timeoutId);
          orderForm.submit();
        })
        .finally(() => {
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }, 500);
        });
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
