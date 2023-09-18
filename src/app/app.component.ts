import { Component, HostListener, OnInit } from '@angular/core';
import { Timer } from './model/timer.type';
import { IEnemy } from './model/enemy.model';
import { ISnake } from './model/snake.model';
import { ICoordinates } from './model/coordinates.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'snake';

  mouseX = 0;
  mouseY = 0;

  snake: ISnake = {
    segments: [{ x: 0, y: 0 }],
    speed: 4
  }

  enemies: IEnemy[] = [];

  food: ICoordinates[] = [];
  foodInterval!: Timer;

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
      const dx = this.mouseX - this.snake.segments[0].x;
      const dy = this.mouseY - this.snake.segments[0].y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const ratio = this.snake.speed / distance;

        this.snake.segments[0].x += dx * ratio;
        this.snake.segments[0].y += dy * ratio;

        const segmentSpacing = 10; // Distanza desiderata tra i segmenti

        for (let i = 1; i < this.snake.segments.length; i++) {
          const dxSegment = this.snake.segments[i - 1].x - this.snake.segments[i].x;
          const dySegment = this.snake.segments[i - 1].y - this.snake.segments[i].y;
          const distanceSegment = Math.sqrt(dxSegment * dxSegment + dySegment * dySegment);

          if (distanceSegment > 0) {
            const targetDistance = segmentSpacing + 1; // Distanza target (segmentSpacing + 1 per evitare sovrapposizioni)
            const ratioSegment = targetDistance / distanceSegment; // Calcolo del rapporto
            this.snake.segments[i].x = this.snake.segments[i - 1].x - dxSegment * ratioSegment;
            this.snake.segments[i].y = this.snake.segments[i - 1].y - dySegment * ratioSegment;
          }
        }

        this.checkFoodCollision(this.snake.segments[0]);

        if (this.checkCollisionWithSegments()) {
          this.gameOver()
        }

      }
    }, 16);
  }

  getRandomPosition(): ICoordinates {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const randomX = Math.random() * screenWidth;
    const randomY = Math.random() * screenHeight;

    return { x: randomX, y: randomY };
  }

  checkCollisionWithSegments(): boolean {
    for (let i = 2; i < this.snake.segments.length; i++) {
      const segment = this.snake.segments[i];
      const dx = this.snake.segments[0].x - segment.x;
      const dy = this.snake.segments[0].y - segment.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        return true;
      }
    }
    return false;
  }

  resetGame() {
    this.snake.segments = [{ x: 0, y: 0 }];
    this.food = [];
    this.snake.speed = 4;
    
    this.enemies.forEach(enemy =>{
      clearInterval(enemy.movementInterval)
    })

    this.enemies = []
  }

  foodSpawningConfig() {
    this.foodInterval = setInterval(() => {
      this.food.push(this.getRandomPosition());
    }, 5 * 1000);
  }

  checkFoodCollision(segment: ICoordinates) {
    for (let i = 0; i < this.food.length; i++) {
      const food = this.food[i];
      const distance = Math.sqrt(
        Math.pow(segment.x - food.x, 2) + Math.pow(segment.y - food.y, 2)
      );

      if (distance < 15) {
        this.food.splice(i, 1);
        this.snake.speed += 0.5;
        this.addSnakeSegment();
        break;
      }
    }
  }

  checkEnemyCollision(enemy: IEnemy){
    for(let i = 0; i < enemy.segments.length; i++){
      for(let i2 = 0; i2 < this.snake.segments.length; i2++){
        const enemySegment = enemy.segments[i];
        const snakeSegment = this.snake.segments[i2];

        const distance = Math.sqrt(
          Math.pow(enemySegment.x - snakeSegment.x, 2) + Math.pow(enemySegment.y - snakeSegment.y, 2)
        );

        if(distance < 15){
          this.gameOver();
          break;
        }
      }
    }
  }

  addSnakeSegment() {
    const lastSegment = this.snake.segments[this.snake.segments.length - 1];
    const newSegment: ICoordinates = { x: lastSegment.x, y: lastSegment.y };
    this.snake.segments.push(newSegment);

    if (this.snake.segments.length % 5 == 0) {
      this.addEnemy()
    }
  }

  gameOver() {
    alert('Hai perso! Il tuo punteggio: ' + (this.snake.segments.length - 1));
    this.resetGame();
  }

  addEnemy() {
    const newEnemy: IEnemy = {
      speed: this.snake.speed -2,
      segments: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ]
    }

    const enemyTimer: Timer = setInterval(() => {
      const dx = this.snake.segments[0].x - newEnemy.segments[0].x;
      const dy = this.snake.segments[0].y - newEnemy.segments[0].y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const ratio = newEnemy.speed / distance;

        newEnemy.segments[0].x += dx * ratio;
        newEnemy.segments[0].y += dy * ratio;

        const segmentSpacing = 10;

        for (let i = 1; i < newEnemy.segments.length; i++) {
          const dxSegment = newEnemy.segments[i - 1].x - newEnemy.segments[i].x;
          const dySegment = newEnemy.segments[i - 1].y - newEnemy.segments[i].y;
          const distanceSegment = Math.sqrt(dxSegment * dxSegment + dySegment * dySegment);

          if (distanceSegment > 0) {
            const targetDistance = segmentSpacing + 1; 
            const ratioSegment = targetDistance / distanceSegment;
            newEnemy.segments[i].x = newEnemy.segments[i - 1].x - dxSegment * ratioSegment;
            newEnemy.segments[i].y = newEnemy.segments[i - 1].y - dySegment * ratioSegment;
          }
        }

        this.checkEnemyCollision(newEnemy)
      }
    }, 16)

    newEnemy.movementInterval = enemyTimer;
    this.enemies.push(newEnemy)
  }
}