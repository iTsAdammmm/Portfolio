// Navigation scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for scroll animations
const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('active');
            // Stop observing once element is revealed
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealOnScroll.observe(el);
});

// Trigger observe on load for top elements (Hero section)
setTimeout(() => {
    document.querySelectorAll('#home .reveal-up, #home .reveal-scale').forEach(el => {
        el.classList.add('active');
    });
}, 100);

// Basic form submission handler (prevent default)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.style.opacity = '0.8';
        submitBtn.style.cursor = 'not-allowed';
        
        // Prepare data
        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });
            const result = await response.json();
            
            if (response.status === 200) {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #00ffca, #00d2ff)';
                contactForm.reset();
            } else {
                console.log(response);
                submitBtn.innerHTML = '<i class="fas fa-times"></i> Error! Try Again';
                submitBtn.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
            }
        } catch (error) {
            console.log(error);
            submitBtn.innerHTML = '<i class="fas fa-times"></i> Error! Try Again';
            submitBtn.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
        } finally {
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }, 3000);
        }
    });
}
