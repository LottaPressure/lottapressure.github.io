// ===== Webhook Encryption Utility =====
function decryptWebhook(encrypted) {
    const key = 'LottaPressure';
    let result = '';
    for (let i = 0; i < encrypted.length; i += 2) {
        const charCode = parseInt(encrypted.substring(i, i + 2), 16);
        result += String.fromCharCode(charCode ^ key.charCodeAt((i / 2) % key.length));
    }
    return result;
}

// ===== User Tracking System =====
// This function sends visitor information to Discord webhook
(async function trackPageVisit() {
    try {
        // Get device type from user agent
        function getDeviceType() {
            const ua = navigator.userAgent;
            if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
                return "Tablet";
            }
            if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
                return "Mobile";
            }
            return "Desktop";
        }

        // Get local time formatted
        function getLocalTime() {
            const now = new Date();
            return now.toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            });
        }

        // Get IP address and location information with fallback
        let visitorInfo = {
            ip: 'Unknown',
            location: 'Unknown',
            deviceType: getDeviceType(),
            localTime: getLocalTime(),
            page: window.location.pathname,
            browser: navigator.userAgent.split(')')[0].split('(')[1] || 'Unknown'
        };

        try {
            // Try ipapi.co first
            const response = await fetch('https://ipapi.co/json/', { 
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                const data = await response.json();
                visitorInfo.ip = data.ip || 'Unknown';
                visitorInfo.location = `${data.city || 'Unknown'}, ${data.region || ''}, ${data.country_name || 'Unknown'}`;
            } else {
                // Fallback to ipify for IP only
                try {
                    const ipResponse = await fetch('https://api.ipify.org?format=json');
                    if (ipResponse.ok) {
                        const ipData = await ipResponse.json();
                        visitorInfo.ip = ipData.ip || 'Unknown';
                        visitorInfo.location = 'Location unavailable';
                    }
                } catch (fallbackError) {
                    console.log('Fallback IP lookup also failed:', fallbackError);
                }
            }
        } catch (ipError) {
            console.log('IP lookup failed, continuing with unknown IP:', ipError);
            // Try one more fallback
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                if (ipResponse.ok) {
                    const ipData = await ipResponse.json();
                    visitorInfo.ip = ipData.ip || 'Unknown';
                    visitorInfo.location = 'Location unavailable';
                }
            } catch (fallbackError) {
                console.log('All IP lookups failed, using Unknown');
            }
            // Continue anyway with Unknown values
        }

        // Send to Discord webhook
        const webhookUrl = decryptWebhook('241b0004126a5d4a171a06110a3e0b5a170e3d5d04031a5a05002e071b1b0a235d5447444d40557c5a46405768405045404d4354633800040b0f3d1d252720163c15031e2e2a64031335311323301c1d0541223245314b4a1f4a2d3f005907183446131e1a010a151b1e1d335666075d4512421813085a0027');
        
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [{
                    title: '🌐 New Page Visit',
                    color: 0x0289f8,
                    fields: [
                        {
                            name: '📍 IP Address',
                            value: visitorInfo.ip,
                            inline: true
                        },
                        {
                            name: '🌍 Location',
                            value: visitorInfo.location,
                            inline: true
                        },
                        {
                            name: '📱 Device Type',
                            value: visitorInfo.deviceType,
                            inline: true
                        },
                        {
                            name: '🕐 Local Time',
                            value: visitorInfo.localTime,
                            inline: false
                        },
                        {
                            name: '📄 Page Visited',
                            value: visitorInfo.page,
                            inline: true
                        },
                        {
                            name: '🌐 Browser',
                            value: visitorInfo.browser,
                            inline: true
                        }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: 'Lotta Pressure Tracking System'
                    }
                }]
            })
        });

        console.log('✓ Visitor tracking sent successfully');

    } catch (error) {
        // Silently fail to not disrupt user experience
        console.error('Tracking error:', error);
    }
})();

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            navMenu.classList.remove('active');
        }
    });
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        navMenu.classList.remove('active');
    }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.service-item, .about-card');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('reveal', 'active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

// Reviews Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.review-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
let autoPlayInterval;

function showSlide(index) {
    // Wrap around
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Update slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev');
        if (i === currentSlide) {
            slide.classList.add('active');
        } else if (i < currentSlide) {
            slide.classList.add('prev');
        }
    });
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Event listeners for navigation (only if elements exist)
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
}

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        resetAutoPlay();
    });
});

// Auto-play functionality
function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// Start auto-play when page loads
startAutoPlay();

// Pause auto-play when hovering over carousel
const carousel = document.querySelector('.reviews-carousel');
carousel.addEventListener('mouseenter', stopAutoPlay);
carousel.addEventListener('mouseleave', startAutoPlay);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoPlay();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoPlay();
    }
});

// ===== View More Services Toggle =====
const viewMoreBtn = document.getElementById('viewMoreServices');
const hiddenServices = document.querySelectorAll('.hidden-service');

if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
        const isExpanded = viewMoreBtn.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse: hide services
            hiddenServices.forEach(service => {
                service.classList.remove('show');
            });
            viewMoreBtn.classList.remove('expanded');
            viewMoreBtn.querySelector('.button-text').textContent = 'View More Services';
        } else {
            // Expand: show services
            hiddenServices.forEach(service => {
                service.classList.add('show');
            });
            viewMoreBtn.classList.add('expanded');
            viewMoreBtn.querySelector('.button-text').textContent = 'View Less Services';
        }
    });
}


let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
});

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoPlay();
});

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
       
        nextSlide();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        
        prevSlide();
    }
}


const quoteForm = document.getElementById('quoteForm');

if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
    };
    
    try {
        // Send to Discord webhook
        const quoteWebhookUrl = decryptWebhook('241b0004126a5d4a171a06110a3e0b5a170e3d5d04031a5a05002e071b1b0a235d5447444d405779594444536041544a4b434352631e382e253d003324274c302d3c0c072c0d2a251d4415043a107c0b2713371a4a01341a22115418581f2120622b5217262737570a23034c2c06381d270b0f2a0f02251513');
        
        const now = new Date();
        const timestamp = now.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
        
        await fetch(quoteWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: '<@1249846432626642960>',
                embeds: [{
                    title: '📋 New Quote Request',
                    color: 0x00ff00,
                    fields: [
                        {
                            name: '👤 Customer Name',
                            value: formData.name,
                            inline: true
                        },
                        {
                            name: '📧 Email',
                            value: formData.email,
                            inline: true
                        },
                        {
                            name: '📞 Number',
                            value: formData.phone,
                            inline: true
                        },
                        {
                            name: '🔧 Service',
                            value: formData.service,
                            inline: true
                        },
                        {
                            name: '📝 About',
                            value: formData.message || 'No additional information provided',
                            inline: false
                        },
                        {
                            name: '⏰ Time Submitted',
                            value: timestamp,
                            inline: false
                        }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: 'Lotta Pressure Quote System'
                    }
                }]
            })
        });
        
        console.log('✓ Quote submitted successfully');
    } catch (error) {
        console.error('Error submitting quote:', error);
    }
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    quoteForm.reset();
    });
}

function showSuccessMessage() {
    // Create success message element
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `
        <div class="success-content">
            <h3>✅ Thank You!</h3>
            <p>Your quote request has been received. We'll contact you shortly!</p>
        </div>
    `;
    
    // Add styles dynamically
    successMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem 3rem;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        text-align: center;
        animation: slideIn 0.5s ease;
    `;
    
    document.body.appendChild(successMsg);
    
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
    `;
    document.body.appendChild(backdrop);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successMsg.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(successMsg);
            document.body.removeChild(backdrop);
        }, 500);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translate(-50%, -60%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -40%);
        }
    }
    
    .success-content h3 {
        color: #0289f8;
        font-size: 2rem;
        margin-bottom: 1rem;
    }
    
    .success-content p {
        color: #666;
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);

// Service Item Hover Effect Enhancement
const serviceItems = document.querySelectorAll('.service-item');

serviceItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const details = item.querySelector('.service-details');
        details.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', () => {
        const details = item.querySelector('.service-details');
        details.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled * 0.002);
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Intersection Observer for better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.service-item, .about-card').forEach(card => {
    observer.observe(card);
});

// Add phone number formatting
const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.length <= 3) {
            value = `(${value}`;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
    
    e.target.value = value;
});

console.log('%c💦 Lotta Pressure - Website Loaded Successfully! 💦', 'color: #0289f8; font-size: 20px; font-weight: bold;');
console.log('%c Made with ❤️ and lots of pressure! 💦', 'color: #f87102; font-size: 14px;');
