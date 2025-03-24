const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = "#ff8";

let score = 0;
let circles = [];

class Circle {
    constructor(x, radius, color, text, speed) {
        this.posX = x;
        this.posY = -radius;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.strokeStyle = "#000";
        context.lineWidth = 2;
        context.stroke();
        context.closePath();
    }

    update() {
        this.posY += this.speed;
        if (this.posY - this.radius > canvas.height) {
            this.posY = -this.radius;
            this.posX = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        }
    }

    containsPoint(x, y) {
        return Math.sqrt((x - this.posX) ** 2 + (y - this.posY) ** 2) < this.radius;
    }
}

function generateCircles() {
    setInterval(() => {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        let speed = Math.random() * 4 + 1;
        let text = `C${circles.length + 1}`;
        circles.push(new Circle(x, radius, color, text, speed));
    }, 500); // Genera un nuevo círculo cada 500ms
}

function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Eliminados: ${score}`, canvas.width - 20, 30);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => {
        circle.update();
        circle.draw(ctx);
    });
    drawScore();
    requestAnimationFrame(animate);
}

canvas.addEventListener("click", function(event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    let initialLength = circles.length;
    
    circles = circles.filter(circle => !circle.containsPoint(mouseX, mouseY));
    
    if (circles.length < initialLength) {
        score++;
    }
});

generateCircles();
animate();
