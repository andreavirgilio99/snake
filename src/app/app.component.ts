import { Component, HostListener, OnInit } from '@angular/core';

type Coordinates = { x: number; y: number };
type Snake = {segments: Coordinates[], speed: number}

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

  speed = 4;
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
  setInterval(() => {
    const dx = this.mouseX - this.snake[0].x;
    const dy = this.mouseY - this.snake[0].y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const ratio = this.speed / distance;

      this.snake[0].x += dx * ratio;
      this.snake[0].y += dy * ratio;

      const segmentSpacing = 10; // Distanza desiderata tra i segmenti

      for (let i = 1; i < this.snake.length; i++) {
        const dxSegment = this.snake[i - 1].x - this.snake[i].x;
        const dySegment = this.snake[i - 1].y - this.snake[i].y;
        const distanceSegment = Math.sqrt(dxSegment * dxSegment + dySegment * dySegment);

        if (distanceSegment > 0) {
          const targetDistance = segmentSpacing + 1; // Distanza target (segmentSpacing + 1 per evitare sovrapposizioni)
          const ratioSegment = targetDistance / distanceSegment; // Calcolo del rapporto
          this.snake[i].x = this.snake[i - 1].x - dxSegment * ratioSegment;
          this.snake[i].y = this.snake[i - 1].y - dySegment * ratioSegment;
        }
      }

      this.checkFoodCollision(this.snake[0]);

      if (this.checkCollisionWithSegments()) {
        alert('Hai perso! Il tuo punteggio: ' + (this.snake.length - 1));
        this.resetGame();
      }

    }
  }, 16);
}

  getRandomPosition(): Coordinates {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const randomX = Math.random() * screenWidth;
    const randomY = Math.random() * screenHeight;

    return { x: randomX, y: randomY };
  }

  checkCollisionWithSegments(): boolean {
    for (let i = 2; i < this.snake.length; i++) {
      const segment = this.snake[i];
      const dx = this.snake[0].x - segment.x;
      const dy = this.snake[0].y - segment.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        return true;
      }
    }
    return false; 
  }

  resetGame() {
    this.snake = [{ x: 0, y: 0 }];
    this.food = [];
    this.speed = 4;
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
        this.speed += 0.5;
        this.addSnakeSegment();
        break;
      }
    }
  }

  addSnakeSegment() {
    const lastSegment = this.snake[this.snake.length - 1];
    const newSegment: Coordinates = { x: lastSegment.x, y: lastSegment.y };
    this.snake.push(newSegment);

    if(this.snake.length % 5 == 0){
      this.addEnemy()
    }
  }

  addEnemy(){

  }
}