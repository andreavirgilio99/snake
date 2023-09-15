import { Component, HostListener, OnInit } from '@angular/core';

type Coordinates = {x: number, y: number}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'snake';

  mouseX = 0;
  mouseY = 0;

  snake: Coordinates[] = [{x: 0, y: 0}]
  food: Coordinates[] = [];

  speed = 50; // più è alta più è lento
  movementIntervals: {interval: any, waitTime: number}[] = [];

  @HostListener('document:mousemove', ['$event'])
  mouseEvent(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }
  
    ngOnInit(): void {
      this.snakeMovementConfig();
      this.foodSpawningConfig();
    }

    snakeMovementConfig(){
      this.snake.forEach((segment, index) =>{
        const waitTime = 16 + index;
        const segInterval = setInterval(() => {
          // Calcola la differenza tra la posizione del serpente e quella del cursore
          const dx = segment.x - this.mouseX;
          const dy = segment.y - this.mouseY;
    
          // Muovi il serpente verso la posizione del cursore
          segment.x -= dx / this.speed;
          segment.y -= dy / this.speed;

          this.checkFoodCollision(segment)
        }, waitTime); // Aggiorna la posizione ogni 16 ms (circa 60 FPS) + index

        this.movementIntervals.push({interval: segInterval, waitTime: waitTime})
      })
    }

    getRandomPosition(): Coordinates{
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const randomX = Math.random() * screenWidth;
      const randomY = Math.random() * screenHeight;

      return {x: randomX, y: randomY}
    }

    foodSpawningConfig(){
      setInterval(() =>{
        this.food.push(this.getRandomPosition())
      }, 5 * 1000)
    }

    checkFoodCollision(segment: Coordinates) {
      for(let i = 0; i < this.food.length; i++) {
        const food = this.food[i];
        const distance = Math.sqrt(Math.pow(segment.x - food.x, 2) + Math.pow(segment.y - food.y, 2));
        
        if (distance < 10) {
          this.food.splice(i, 1);
          this.addSnakeSegment();
          break;
        }
      }
    }

    addSnakeSegment(){ //dovrebbe essere alle coordinate dell'ultimo segmento
      const lastSegment = this.snake[this.snake.length -1];
      const newSegment: Coordinates = {x: lastSegment.x, y: lastSegment.y}
      this.snake.push(newSegment)

      const lastInterval = this.movementIntervals.length -1;
      const waitTime = 16 + ((this.movementIntervals[lastInterval].waitTime -16) +1);

        const segInterval = setInterval(() => {
          
          const dx = newSegment.x - this.mouseX;
          const dy = newSegment.y - this.mouseY;
    
          newSegment.x -= dx / this.speed;
          newSegment.y -= dy / this.speed;

          this.checkFoodCollision(newSegment)
        }, waitTime);

        this.movementIntervals.push({interval: segInterval, waitTime: waitTime})
    }
}
