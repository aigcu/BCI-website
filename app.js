// Code generated with the help of chatGPT
const canvas = document.getElementById('interactiveCanvas');
const ctx = canvas.getContext('2d');
// HTML els
const mobileNavBtn = document.getElementById("hamburger-menu");
const mobileLinks = document.querySelectorAll(".nav-right a");
const nav = document.querySelector("nav");
const bodyEl = document.querySelector('body');

mobileNavBtn.addEventListener("click", function () {
    nav.classList.toggle("nav-active");
    if (nav.classList.contains("nav-active")) {
        bodyEl.style.overflowY = "hidden";
    } else {
        bodyEl.style.overflowY = "auto";
    }
});

mobileLinks.forEach((l) => l.addEventListener("click", () => {
    nav.classList.remove("nav-active");
    bodyEl.style.overflowY = "auto";
}))


function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('resize', createParticles);

const particles = [];
const mouse = {
    x: null,
    y: null,
    radius: 100
};

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.speedX = Math.random() * 0.2 - 0.1; // horizontal movement
        this.speedY = Math.random() * 0.2 - 0.1; //vertical movement
        this.driftFactor = 0.01;
        this.color = `#2DD4BF`;
    }

    update() {
        // Update particle drift to create a floating effect
        this.speedX += (Math.random() - 0.5) * this.driftFactor;
        this.speedY += (Math.random() - 0.5) * this.driftFactor;
        this.x += this.speedX;
        this.y += this.speedY;

        // Interaction with the mouse: particles are pushed away when close
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * 10;
            let directionY = forceDirectionY * force * 10;

            this.x -= directionX;
            this.y -= directionY;
        }

        // Boundary checks: keep particles inside the canvas
        if (this.x - this.size < 0) {
            this.x = this.size;
            this.speedX *= -0.5;
        }
        if (this.x + this.size > canvas.width) {
            this.x = canvas.width - this.size;
            this.speedX *= -0.5;
        }
        if (this.y - this.size < 0) {
            this.y = this.size;
            this.speedY *= -0.5;
        }
        if (this.y + this.size > canvas.height) {
            this.y = canvas.height - this.size;
            this.speedY *= -0.5;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

function createParticles() {
    const numberOfParticles = 3_000;
    particles.length = 0;
    for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
    }
}

function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
}

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
});

canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

function animate() {
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

createParticles();
animate();
resizeCanvas();
