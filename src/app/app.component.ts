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
      // Calcola la direzione dalla testa al mouse
      const dx = this.mouseX - this.snake[0].x;
      const dy = this.mouseY - this.snake[0].y;

      // Calcola la distanza totale
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        // Normalizza la direzione per mantenere una velocità costante
        const ratio = this.speed / distance;

        // Muovi la testa del serpente con velocità costante nella direzione del mouse
        this.snake[0].x += dx * ratio;
        this.snake[0].y += dy * ratio;

        // Aggiorna la posizione degli altri segmenti del serpente
        for (let i = 1; i < this.snake.length; i++) {
          const dxSegment = this.snake[i - 1].x - this.snake[i].x;
          const dySegment = this.snake[i - 1].y - this.snake[i].y;
          const distanceSegment = Math.sqrt(dxSegment * dxSegment + dySegment * dySegment);

          if (distanceSegment > 0) {
            const ratioSegment = distanceSegment / this.speed;
            this.snake[i].x += dxSegment / distanceSegment * ratioSegment;
            this.snake[i].y += dySegment / distanceSegment * ratioSegment;
          }
        }

        this.checkFoodCollision(this.snake[0]);
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