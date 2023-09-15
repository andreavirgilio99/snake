import { Component, HostListener, OnInit } from '@angular/core';

type Coordinates = { x: number; y: number };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'snake';

  mouseX = 0;
  mouseY = 0;

  snake: Coordinates[] = [{ x: 0, y: 0 }];
  food: Coordinates[] = [];

  speed = 50; // più è alta più è lento
  movementInterval: any;
  foodInterval: any;

  @HostListener('document:mousemove', ['$event'])
  mouseEvent(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  ngOnInit(): void {
    this.snakeMovementConfig();
    this.foodSpawningConfig();
  }

  snakeMovementConfig() {
    this.movementInterval = setInterval(() => {
      // Calcola la direzione dalla testa ai nuovi segmenti
      for (let i = this.snake.length - 1; i >= 1; i--) {
        const dx = this.snake[i - 1].x - this.snake[i].x;
        const dy = this.snake[i - 1].y - this.snake[i].y;

        // Imposta una distanza fissa tra i segmenti
        const distance = Math.sqrt(dx * dx + dy * dy);
        const targetDistance = 10; // Distanza desiderata tra i segmenti

        if (distance > targetDistance) {
          const ratio = targetDistance / distance;
          this.snake[i].x = this.snake[i - 1].x - dx * ratio;
          this.snake[i].y = this.snake[i - 1].y - dy * ratio;
        }

        this.checkFoodCollision(this.snake[i]);
      }

      // Calcola la direzione dalla testa al mouse
      const dx = this.mouseX - this.snake[0].x;
      const dy = this.mouseY - this.snake[0].y;

      // Aggiungi "smoothing" al movimento della testa
      this.snake[0].x += dx / (this.speed * 2);
      this.snake[0].y += dy / (this.speed * 2);

      this.checkFoodCollision(this.snake[0]);
    }, 16);
  }

  getRandomPosition(): Coordinates {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const randomX = Math.random() * screenWidth;
    const randomY = Math.random() * screenHeight;

    return { x: randomX, y: randomY };
  }

  foodSpawningConfig() {
    this.foodInterval = setInterval(() => {
      this.food.push(this.getRandomPosition());
    }, 5 * 1000);
  }

  checkFoodCollision(segment: Coordinates) {
    for (let i = 0; i < this.food.length; i++) {
      const food = this.food[i];
      const distance = Math.sqrt(
        Math.pow(segment.x - food.x, 2) + Math.pow(segment.y - food.y, 2)
      );

      if (distance < 10) {
        this.food.splice(i, 1);
        this.addSnakeSegment();
        break;
      }
    }
  }

  addSnakeSegment() {
    const lastSegment = this.snake[this.snake.length - 1];
    const newSegment: Coordinates = { x: lastSegment.x, y: lastSegment.y };
    this.snake.push(newSegment);
  }
}