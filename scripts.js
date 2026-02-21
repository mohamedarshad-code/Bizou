/**
 * BIZOU CAFE & GRILL — scripts.js
 * Optimized for Smoothness
 */

$(document).ready(function() {
  'use strict';

  // ── 1. Custom Cursor setup ──
  if (!$('.cursor-dot').length) {
    $('body').append('<div class="cursor-dot" aria-hidden="true"></div><div class="cursor-ring" aria-hidden="true"></div>');
  }
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    // Smooth lerping (Linear Interpolation) for the ring
    dotX += (mouseX - dotX) * 0.2;
    dotY += (mouseY - dotY) * 0.2;
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;

    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states for cursor
  $('a, button, .tab-btn, .time-slot, select, input, textarea').on('mouseenter', function() {
    $('.cursor-ring').css({ width: '60px', height: '60px', background: 'rgba(74,99,99,0.05)' });
  }).on('mouseleave', function() {
    $('.cursor-ring').css({ width: '32px', height: '32px', background: 'none' });
  });

  // ── 2. Preloader ──
  $(window).on('load', function() {
    setTimeout(() => {
      $('.preloader').addClass('hidden');
    }, 1200);
  });

  // ── 3. Navbar Scroll Effect ──
  $(window).on('scroll', function() {
    if ($(window).scrollTop() > 50) {
      $('.navbar').addClass('scrolled');
    } else {
      $('.navbar').removeClass('scrolled');
    }
  });

  // ── 4. Mobile Menu ──
  $('.hamburger').on('click', function() {
    $(this).toggleClass('active');
    $('.nav-links').toggleClass('open');
  });

  // ── 5. Scroll Reveal ──
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Standard reveal is one-time
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  $('.reveal, .reveal-left, .reveal-right, .service-teaser, .blog-card, .menu-card').each(function() {
    revealObserver.observe(this);
  });

  // ── 6. Stats Count Up ──
  const countUp = (el) => {
    const target = parseInt($(el).attr('data-target'));
    const suffix = $(el).attr('data-suffix') || '';
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const update = () => {
      current += increment;
      if (current < target) {
        $(el).text(Math.ceil(current) + suffix);
        requestAnimationFrame(update);
      } else {
        $(el).text(target + suffix);
      }
    };
    update();
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  $('.stat-num').each(function() {
    statsObserver.observe(this);
  });

  // ── 7. Testimonials Slider ──
  let currentSlide = 0;
  const slides = $('.testimonial-slide');
  const totalSlides = slides.length;
  const dotsContainer = $('.slider-dots');

  // Create dots
  slides.each(function(i) {
    dotsContainer.append(`<span class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`);
  });

  function showSlide(index) {
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;
    currentSlide = index;
    
    const offset = -currentSlide * 100;
    $('.testimonial-track').css({
      'transform': `translateX(${offset}%)`,
      'transition': 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
    });
    $('.slider-dot').removeClass('active').eq(currentSlide).addClass('active');
  }

  $('.slider-btn.next').on('click', () => showSlide(currentSlide + 1));
  $('.slider-btn.prev').on('click', () => showSlide(currentSlide - 1));
  $('.slider-dot').on('click', function() {
    showSlide($(this).data('index'));
  });

  // Auto play
  setInterval(() => showSlide(currentSlide + 1), 6000);

  // ── 8. Menu Filter ──
  $('.tab-btn').on('click', function() {
    const filter = $(this).attr('data-category');
    $('.tab-btn').removeClass('active');
    $(this).addClass('active');

    if (filter === 'all') {
      $('.menu-card').css('display', 'block').hide().fadeIn(400);
    } else {
      $('.menu-card').hide();
      $(`.menu-card[data-category="${filter}"]`).fadeIn(400);
    }
  });

  // ── 9. FAQ Accordion ──
  $('.faq-question').on('click', function() {
    const parent = $(this).parent();
    const answer = parent.find('.faq-answer');
    
    if (parent.hasClass('active')) {
      answer.css('max-height', '0');
      parent.removeClass('active');
    } else {
      $('.faq-item.active .faq-answer').css('max-height', '0');
      $('.faq-item.active').removeClass('active');
      
      const scrollH = answer[0].scrollHeight;
      answer.css('max-height', scrollH + 'px');
      parent.addClass('active');
    }
  });

  // ── 10. Form Validation ──
  $('#contactForm').on('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    $(this).find('[required]').each(function() {
      if (!$(this).val()) {
        $(this).parent().addClass('error');
        isValid = false;
      } else {
        $(this).parent().removeClass('error');
      }
    });

    if (isValid) {
      $(this).fadeOut(400, function() {
        $('.form-success').fadeIn();
      });
    }
  });

  // ── 11. Time Slot Selection ──
  $('.time-slot').on('click', function() {
    $('.time-slot').removeClass('active').css('background', 'var(--bg-section)');
    $(this).addClass('active').css('background', 'var(--gold)');
  });

});
