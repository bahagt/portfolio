class PortfolioApp {
  constructor() {
    this.navItems = document.querySelectorAll('.nav-item');
    this.contentSections = document.querySelectorAll('.content-section');
    this.centerLogo = document.querySelector('.center-logo');
    this.loadingScreen = document.getElementById('loadingScreen');
    
    this.defaultCenterIconClass = 'fas fa-home';
    this.activeIconClass = null;
    this.isAnimating = false;
    
    this.init();
  }

  init() {
    this.showLoadingScreen();
    this.setupEventListeners();
    this.initializeActiveState();
    this.createParticles();
    this.animateSkillBars();
    
    // Hide loading screen after animations
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 2000);
  }

  showLoadingScreen() {
    this.loadingScreen.classList.remove('hidden');
  }

  hideLoadingScreen() {
    this.loadingScreen.classList.add('hidden');
  }

  setupEventListeners() {
    this.navItems.forEach((item, index) => {
      const navButton = item.querySelector('.nav-button');
      
      // Mouse events
      navButton.addEventListener('mouseenter', () => this.handleMouseEnter(item));
      navButton.addEventListener('mouseleave', () => this.handleMouseLeave());
      navButton.addEventListener('click', (e) => this.handleNavClick(item, e));
      
      // Touch events for mobile
      navButton.addEventListener('touchstart', (e) => this.handleTouchStart(item, e));
      navButton.addEventListener('touchend', (e) => this.handleTouchEnd(item, e));
      
      // Add staggered animation delay
      item.style.animationDelay = `${0.1 * index}s`;
    });

    // Center logo interactions
    this.centerLogo.addEventListener('click', () => this.handleCenterLogoClick());
    this.centerLogo.addEventListener('mouseenter', () => this.handleCenterLogoHover());
    
    // Intersection Observer for animations
    this.setupIntersectionObserver();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
  }

  handleMouseEnter(item) {
    if (this.isAnimating) return;
    
    const hoverIconClass = item.getAttribute('data-icon');
    this.updateCenterLogo(hoverIconClass);
    this.createRippleEffect(item.querySelector('.nav-button'));
  }

  handleMouseLeave() {
    if (this.isAnimating) return;
    
    if (this.activeIconClass) {
      this.updateCenterLogo(this.activeIconClass);
    } else {
      this.updateCenterLogo(this.defaultCenterIconClass);
    }
  }

  handleNavClick(item, event) {
    if (this.isAnimating) return;
    
    event.preventDefault();
    this.isAnimating = true;
    
    // Create ripple effect
    this.createRippleEffect(item.querySelector('.nav-button'), event);
    
    // Update active states
    this.updateActiveStates(item);
    
    // Switch content with animation
    this.switchContent(item);
    
    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }

  handleTouchStart(item, event) {
    const button = item.querySelector('.nav-button');
    button.style.transform = 'translate(-50%, -50%) scale(1.1)';
    button.style.transition = 'transform 0.1s ease';
    
    this.createRippleEffect(button, event.touches[0]);
  }

  handleTouchEnd(item, event) {
    const button = item.querySelector('.nav-button');
    
    setTimeout(() => {
      button.style.transform = '';
      button.style.transition = '';
    }, 100);
    
    // Prevent double-tap zoom
    event.preventDefault();
  }

  handleCenterLogoClick() {
    this.createRippleEffect(this.centerLogo);
    
    // Rotate through all sections
    const currentActive = document.querySelector('.nav-item.active');
    const currentIndex = Array.from(this.navItems).indexOf(currentActive);
    const nextIndex = (currentIndex + 1) % this.navItems.length;
    const nextItem = this.navItems[nextIndex];
    
    this.handleNavClick(nextItem, { preventDefault: () => {} });
  }

  handleCenterLogoHover() {
    this.createRippleEffect(this.centerLogo);
  }

  createRippleEffect(element, event = null) {
    const ripple = element.querySelector('.button-ripple, .logo-ripple');
    if (!ripple) return;
    
    // Reset ripple
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.opacity = '1';
    
    // Calculate position
    let x = 50, y = 50;
    if (event) {
      const rect = element.getBoundingClientRect();
      x = ((event.clientX - rect.left) / rect.width) * 100;
      y = ((event.clientY - rect.top) / rect.height) * 100;
    }
    
    // Animate ripple
    requestAnimationFrame(() => {
      ripple.style.left = x + '%';
      ripple.style.top = y + '%';
      ripple.style.width = '200px';
      ripple.style.height = '200px';
      ripple.style.transition = 'all 0.6s ease-out';
      
      setTimeout(() => {
        ripple.style.opacity = '0';
      }, 300);
    });
  }

  updateActiveStates(activeItem) {
    // Remove active class from all items
    this.navItems.forEach(nav => nav.classList.remove('active'));
    
    // Add active class to clicked item
    activeItem.classList.add('active');
    
    // Update center logo
    this.activeIconClass = activeItem.getAttribute('data-icon');
    this.updateCenterLogo(this.activeIconClass);
  }

  switchContent(activeItem) {
    const contentId = activeItem.getAttribute('data-content');
    const targetSection = document.getElementById(contentId);
    
    if (!targetSection) return;
    
    // Fade out current section
    const currentSection = document.querySelector('.content-section.active');
    if (currentSection) {
      currentSection.style.opacity = '0';
      currentSection.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        currentSection.classList.remove('active');
        
        // Fade in new section
        targetSection.classList.add('active');
        targetSection.style.opacity = '0';
        targetSection.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
          targetSection.style.transition = 'all 0.4s ease-out';
          targetSection.style.opacity = '1';
          targetSection.style.transform = 'translateY(0)';
        });
        
        // Trigger section-specific animations
        this.triggerSectionAnimations(contentId);
      }, 200);
    }
  }

  triggerSectionAnimations(sectionId) {
    switch (sectionId) {
      case 'skills':
        setTimeout(() => this.animateSkillBars(), 300);
        break;
      case 'projects':
        this.animateProjectCards();
        break;
      case 'education':
        this.animateEducationItems();
        break;
    }
  }

  updateCenterLogo(iconClass) {
    this.centerLogo.innerHTML = `<i class="${iconClass}"></i><div class="logo-ripple"></div>`;
  }

  initializeActiveState() {
    const initialActiveItem = document.querySelector('.nav-item.active');
    if (initialActiveItem) {
      this.activeIconClass = initialActiveItem.getAttribute('data-icon');
      this.updateCenterLogo(this.activeIconClass);
    } else {
      this.updateCenterLogo(this.defaultCenterIconClass);
    }
  }

  animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
      const progressBar = item.querySelector('.skill-progress');
      const level = item.getAttribute('data-level');
      
      setTimeout(() => {
        progressBar.style.width = level + '%';
      }, index * 100);
    });
  }

  animateProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.5s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 150);
    });
  }

  animateEducationItems() {
    const educationItems = document.querySelectorAll('.education-item');
    
    educationItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-30px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.5s ease-out';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, index * 200);
    });
  }

  createParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(33, 150, 243, 0.5);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: floatParticle ${5 + Math.random() * 10}s infinite ease-in-out;
        animation-delay: ${Math.random() * 5}s;
      `;
      
      particlesContainer.appendChild(particle);
    }
    
    // Add particle animation to CSS
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes floatParticle {
        0%, 100% {
          transform: translateY(0) translateX(0) scale(1);
        }
        25% {
          transform: translateY(-10px) translateX(10px) scale(1.1);
        }
        50% {
          transform: translateY(10px) translateX(-10px) scale(0.9);
        }
        75% {
          transform: translateY(-5px) translateX(5px) scale(1.05);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // New method for Intersection Observer (assuming it's intended to be here)
  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'skills') {
            this.animateSkillBars();
          } else if (entry.target.id === 'projects') {
            this.animateProjectCards();
          } else if (entry.target.id === 'education') {
            this.animateEducationItems();
          }
        }
      });
    }, observerOptions);

    this.contentSections.forEach(section => {
      observer.observe(section);
    });
  }

  // New method for keyboard navigation (assuming it's intended to be here)
  handleKeyboardNavigation(event) {
    const activeItem = document.querySelector('.nav-item.active');
    let nextItem = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextItem = activeItem.nextElementSibling || this.navItems[0];
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextItem = activeItem.previousElementSibling || this.navItems[this.navItems.length - 1];
    }

    if (nextItem && nextItem.classList.contains('nav-item')) {
      this.handleNavClick(nextItem, { preventDefault: () => {} });
    }
  }
}

// Instantiate the app
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});