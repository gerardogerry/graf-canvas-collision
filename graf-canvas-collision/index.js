const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.originalColor = color;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.flashing = false;
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

        context.fillStyle = "#000";
        context.font = "16px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.text, this.posX, this.posY);
    }

    update() {
        this.posX += this.dx;
        this.posY += this.dy;

        if (this.posX + this.radius > canvas.width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.posY + this.radius > canvas.height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    checkCollision(other) {
        let dx = this.posX - other.posX;
        let dy = this.posY - other.posY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + other.radius;
    }

    handleCollision(other) {
        let tempDx = this.dx;
        let tempDy = this.dy;
        this.dx = other.dx;
        this.dy = other.dy;
        other.dx = tempDx;
        other.dy = tempDy;
        
        this.flashing = true;
        other.flashing = true;
        setTimeout(() => {
            this.flashing = false;
            other.flashing = false;
        }, 200);
    }
}

let circles = [];

function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * (canvas.height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        let speed = Math.random() * 4 + 1;
        let text = `C${i + 1}`;
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

function detectCollisions() {
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (circles[i].checkCollision(circles[j])) {
                circles[i].handleCollision(circles[j]);
                circles[i].color = "#0000FF";
                circles[j].color = "#0000FF";
            } else if (!circles[i].flashing) {
                circles[i].color = circles[i].originalColor;
            }
            if (!circles[j].flashing) {
                circles[j].color = circles[j].originalColor;
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => {
        circle.update();
        circle.draw(ctx);
    });
    detectCollisions();
    requestAnimationFrame(animate);
}

generateCircles(10);
animate();
