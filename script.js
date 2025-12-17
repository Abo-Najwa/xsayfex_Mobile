// Matrix Rain Background
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテト';
const charArray = chars.split('');
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff88';
    ctx.font = fontSize + 'px Share Tech Mono';

    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Typing Effect
const commands = [
    'Initializing xsayfex mobile pentest framework...',
    'frida -U -f com.target.app -l bypass.js --no-pause',
    'Dumping application binary with frida-ios-dump...',
    'objection -g "App" explore -> ios sslpinning disable',
    'grep -rn "api_key|secret|token" decompiled/',
    'Intercepting HTTPS traffic via Burp Suite...',
    'class-dump -H Binary -o headers/',
    'keychain-dumper -a -> Extracting credentials...',
    'drozer console -> run app.package.attacksurface',
    'jadx -d decompiled/ target.apk',
    'Analyzing native .so libraries with IDA Pro...',
    'Mobile security assessment by xsayfex ready.'
];

let commandIndex = 0;
let charIndex = 0;
const typedText = document.getElementById('typed-text');

function typeCommand() {
    if (!typedText) return;

    if (charIndex < commands[commandIndex].length) {
        typedText.textContent += commands[commandIndex][charIndex];
        charIndex++;
        setTimeout(typeCommand, 50);
    } else {
        setTimeout(() => {
            typedText.textContent = '';
            charIndex = 0;
            commandIndex = (commandIndex + 1) % commands.length;
            typeCommand();
        }, 2000);
    }
}

typeCommand();

// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar Active State
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Animate Stats Counter
const stats = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateStats() {
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCount = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        };

        updateCount();
    });
}

// Intersection Observer for Stats Animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateStats();
        }
    });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
    statsObserver.observe(statsBar);
}

// Cards Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .tool-card, .vuln-card, .timeline-item, .info-block, .advanced-card, .resource-card, .code-terminal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');

if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Add mobile nav styles dynamically
const mobileNavStyles = document.createElement('style');
mobileNavStyles.textContent = `
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(10, 10, 15, 0.98);
            padding: 2rem;
            gap: 1rem;
            border-bottom: 1px solid var(--border);
            animation: slideDown 0.3s ease;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    }
    
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .nav-link.active {
        color: var(--primary);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(mobileNavStyles);

// Checklist Interactive
document.querySelectorAll('.checklist-cat li').forEach(item => {
    item.addEventListener('click', () => {
        const checkbox = item.textContent.trim();
        if (checkbox.startsWith('☐')) {
            item.textContent = item.textContent.replace('☐', '☑');
            item.style.color = '#00ff88';
        } else if (checkbox.startsWith('☑')) {
            item.textContent = item.textContent.replace('☑', '☐');
            item.style.color = '';
        }
    });
    item.style.cursor = 'pointer';
});

// Glitch Effect Enhancement
const glitchText = document.querySelector('.glitch');
if (glitchText) {
    setInterval(() => {
        glitchText.style.textShadow = `
            ${Math.random() * 4 - 2}px 0 #ff00ff,
            ${Math.random() * 4 - 2}px 0 #00d4ff
        `;
        setTimeout(() => {
            glitchText.style.textShadow = `
                0 0 10px #00ff88,
                0 0 20px #00ff88,
                0 0 40px #00ff88
            `;
        }, 50);
    }, 3000);
}

// Console Easter Egg
console.log(`
%c██╗  ██╗███████╗ █████╗ ██╗   ██╗███████╗███████╗██╗  ██╗
%c╚██╗██╔╝██╔════╝██╔══██╗╚██╗ ██╔╝██╔════╝██╔════╝╚██╗██╔╝
%c ╚███╔╝ ███████╗███████║ ╚████╔╝ █████╗  █████╗   ╚███╔╝ 
%c ██╔██╗ ╚════██║██╔══██║  ╚██╔╝  ██╔══╝  ██╔══╝   ██╔██╗ 
%c██╔╝ ██╗███████║██║  ██║   ██║   ██║     ███████╗██╔╝ ██╗
%c╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚══════╝╚═╝  ╚═╝
`,
    'color: #00ff88', 'color: #00ff88', 'color: #00d4ff',
    'color: #00d4ff', 'color: #ff00ff', 'color: #ff00ff'
);

console.log('%c🔒 M0BPWNR - Mobile App Penetration Testing', 'color: #00ff88; font-size: 18px; font-weight: bold;');
console.log('%c👤 Created by: Abdulaziz (@xsayfex)', 'color: #00d4ff; font-size: 14px;');
console.log('%c⚡ iOS & Android Security Assessment Professional', 'color: #ff00ff; font-size: 12px;');
console.log('%cInspecting the code? A true hacker at heart! 🎯', 'color: #ffaa00; font-style: italic;');
