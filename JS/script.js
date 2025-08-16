// ====== Mobile Navigation Toggle ======
// Mobile Menu Toggle with Full Keyboard Support
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links a, .nav-links button');

// Toggle menu function
function toggleMenu() {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', !isExpanded);
  navMenu.classList.toggle('active');
  
  // Focus management
  if (!isExpanded) {
    navLinks[0].focus();
  }
}

// Click handler
menuToggle.addEventListener('click', toggleMenu);

// Keyboard handler (Space/Enter)
menuToggle.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    toggleMenu();
  }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
    toggleMenu();
  }
});

// Focus trap for mobile menu
navMenu.addEventListener('keydown', (e) => {
  if (!navMenu.classList.contains('active')) return;

  if (e.key === 'Tab') {
    const focusableElements = navLinks;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }

  // Close on Escape
  if (e.key === 'Escape') {
    toggleMenu();
    menuToggle.focus();
  }
});

// ====== Smooth Scrolling ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Focus the target for keyboard users
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.addEventListener('blur', function() {
        target.removeAttribute('tabindex');
      }, { once: true });
    }
  });
});

// ====== Card Animation on Scroll ======
const animateCards = () => {
  const cards = document.querySelectorAll('.card, .gallery-item');
  const triggerBottom = window.innerHeight * 0.85;

  cards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < triggerBottom) {
      card.classList.add('show');
    }
  });
};

// Run once on load and on scroll
window.addEventListener('load', animateCards);
window.addEventListener('scroll', animateCards);

// ====== Contact Form Validation ======
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form elements
    const name = this.querySelector('#name');
    const email = this.querySelector('#email');
    const message = this.querySelector('#message');
    const status = this.querySelector('.form__status');
    
    // Reset previous states
    status.textContent = '';
    status.removeAttribute('aria-invalid');
    [name, email, message].forEach(field => {
      field.removeAttribute('aria-invalid');
    });

    // Validate fields
    let isValid = true;
    
    if (!name.value.trim()) {
      name.setAttribute('aria-invalid', 'true');
      isValid = false;
    }
    
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.setAttribute('aria-invalid', 'true');
      isValid = false;
    }
    
    if (!message.value.trim()) {
      message.setAttribute('aria-invalid', 'true');
      isValid = false;
    }

    // Show status
    if (isValid) {
      status.textContent = 'Message sent successfully!';
      this.reset();
    } else {
      status.textContent = 'Please fill all required fields correctly.';
      status.setAttribute('aria-invalid', 'true');
      // Focus first invalid field
      const firstInvalid = this.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }
  });
}

// ====== Lightbox Gallery ======
const initLightbox = () => {
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const lightboxDesc = lightbox.querySelector('#lightbox-desc');
  const galleryItems = document.querySelectorAll('[data-lightbox]');
  let currentIndex = 0;

  // Open lightbox
  function openLightbox(index) {
    const item = galleryItems[index];
    const img = item.querySelector('img');
    const desc = item.querySelector('figcaption')?.textContent || '';
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxDesc.textContent = desc;
    lightbox.hidden = false;
    lightbox.querySelector('.lightbox__close').focus();
    currentIndex = index;
    
    // Trap focus in lightbox
    document.addEventListener('keydown', trapLightboxFocus);
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.hidden = true;
    galleryItems[currentIndex].focus();
    document.removeEventListener('keydown', trapLightboxFocus);
  }

  // Navigation
  function navigateLightbox(direction) {
    currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  }

  // Focus trap
  function trapLightboxFocus(e) {
    if (e.key === 'Tab') {
      const focusable = lightbox.querySelectorAll('button, [tabindex]');
      const first = focusable[0];
      const last = focusable[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
    
    // Close on Escape
    if (e.key === 'Escape') {
      closeLightbox();
    }
    
    // Arrow navigation
    if (e.key === 'ArrowLeft') {
      navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
      navigateLightbox(1);
    }
  }

  // Set up gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  // Lightbox controls
  lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox__prev').addEventListener('click', () => navigateLightbox(-1));
  lightbox.querySelector('.lightbox__next').addEventListener('click', () => navigateLightbox(1));
};

// Initialize lightbox if exists
if (document.querySelector('.lightbox')) {
  initLightbox();
}