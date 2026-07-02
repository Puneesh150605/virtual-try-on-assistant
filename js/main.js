// Main JavaScript File for Glam Up

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    console.log("DOM loaded, initializing components...");
    
    // Ensure all scripts are loaded
    checkScriptsLoaded();
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('open');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('open');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Close mobile menu if it's open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('open');
            }
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll reveal animation
    window.addEventListener('scroll', revealOnScroll);
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const revealTop = reveal.getBoundingClientRect().top;
            const revealPoint = 150;
            
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    }
    
    // Create sparkle effect for hero section
    const heroSection = document.getElementById('home');
    if (heroSection) {
        for (let i = 0; i < 20; i++) {
            createSparkle(heroSection);
        }
    }
    
    function createSparkle(container) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random properties
        const size = Math.random() * 6 + 2;
        const duration = Math.random() * 2 + 1;
        const delay = Math.random() * 5;
        
        // Set styles
        sparkle.style.left = `${posX}%`;
        sparkle.style.top = `${posY}%`;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.animationDuration = `${duration}s`;
        sparkle.style.animationDelay = `${delay}s`;
        
        container.appendChild(sparkle);
    }
    
    // Select all color swatches
    const colorSwatches = document.querySelectorAll('[data-color]');
    colorSwatches.forEach(swatch => {
        swatch.classList.add('color-swatch');
        swatch.addEventListener('click', function() {
            // Remove selected class from siblings
            const siblings = Array.from(this.parentElement.children);
            siblings.forEach(sibling => sibling.classList.remove('selected'));
            
            // Add selected class to clicked swatch
            this.classList.add('selected');
        });
    });
    
    // Before & After comparison slider functionality
    const beforeAfterContainer = document.getElementById('before-after-container');
    const beforeImage = document.getElementById('before-image');
    const comparisonSlider = document.getElementById('comparison-slider');
    
    if (beforeAfterContainer && beforeImage && comparisonSlider) {
        let isDragging = false;
        
        const moveSlider = (clientX) => {
            if (!isDragging) return;
            const rect = beforeAfterContainer.getBoundingClientRect();
            let position = ((clientX - rect.left) / rect.width) * 100;
            if (position < 0) position = 0;
            if (position > 100) position = 100;
            
            beforeImage.style.width = `${position}%`;
            comparisonSlider.style.left = `${position}%`;
        };
        
        comparisonSlider.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        comparisonSlider.addEventListener('touchstart', (e) => {
            isDragging = true;
        });
        
        beforeAfterContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            moveSlider(e.clientX);
        });
        beforeAfterContainer.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                isDragging = true;
                moveSlider(e.touches[0].clientX);
            }
        });
        
        window.addEventListener('mousemove', (e) => {
            if (isDragging) moveSlider(e.clientX);
        });
        window.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches && e.touches.length > 0) {
                moveSlider(e.touches[0].clientX);
            }
        });
        
        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('touchend', () => { isDragging = false; });
    }

    // Product Shop Now buttons feedback
    const shopButtons = document.querySelectorAll('#products button');
    shopButtons.forEach(btn => {
        if (btn.textContent.trim() === 'Shop Now') {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const card = this.closest('.bg-white');
                const productName = card ? card.querySelector('h3')?.textContent : 'Product';
                showToast(`Added "${productName}" to your bag! 🛍️`, 'success');
            });
        }
    });
    
    // Newsletter subscribe feedback
    const newsletterBtn = document.querySelector('#products input[type="email"] + button');
    const newsletterInput = document.querySelector('#products input[type="email"]');
    if (newsletterBtn && newsletterInput) {
        newsletterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = newsletterInput.value.trim();
            if (email && email.includes('@')) {
                showToast('Thank you for subscribing to Glam Up VIP recommendations! ✨', 'success');
                newsletterInput.value = '';
            } else {
                showToast('Please enter a valid email address.', 'error');
            }
        });
    }
    
    // Toast notification helper
    function showToast(message, type = 'success') {
        const existingToast = document.getElementById('glam-toast');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.id = 'glam-toast';
        toast.className = `fixed top-24 right-6 px-6 py-4 rounded-xl shadow-2xl z-50 transform transition-all duration-300 translate-y-0 opacity-100 flex items-center gap-3 text-white font-medium ${type === 'success' ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-red-500'}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} text-xl"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
    
    // Check if chatbot script is loaded
    function checkScriptsLoaded() {
        console.log("Scripts loaded and ready");
    }
    
    // Handle makeup tab functionality
    const makeupTabs = document.querySelectorAll('.makeup-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (makeupTabs.length && tabContents.length) {
        makeupTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                makeupTabs.forEach(t => {
                    t.classList.remove('active', 'border-b-2', 'border-pink-500', 'text-pink-500');
                });
                
                // Hide all tab contents
                tabContents.forEach(content => {
                    content.classList.add('hidden');
                });
                
                // Add active class to clicked tab
                this.classList.add('active', 'border-b-2', 'border-pink-500', 'text-pink-500');
                
                // Show corresponding tab content
                const tabId = this.getAttribute('data-tab');
                const tabContent = document.getElementById(`${tabId}-tab`);
                if (tabContent) {
                    tabContent.classList.remove('hidden');
                }
            });
        });
    }
    
    // Add interactive sparkle effect to the try-on section
    const tryOnSection = document.getElementById('try-on');
    
    if (tryOnSection) {
        // Create sparkles periodically
        setInterval(() => {
            createSparkle(tryOnSection);
        }, 300);
    }
}); 