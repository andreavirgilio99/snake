import { Component, HostListener, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'snake';

  x = 0; //snake x
  y = 0; //snake y

  mouseX = 0;
  mouseY = 0;

  speed = 50; // Velocità di movimento del serpente
  interval: any; // Variabile per l'intervallo

  @HostListener('document:mousemove', ['$event'])
  mouseEvent(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }
  
    ngOnInit(): void {
      this.interval = setInterval(() => {
        // Calcola la differenza tra la posizione del serpente e quella del cursore
        const dx = this.x - this.mouseX;
        const dy = this.y - this.mouseY;
  
        // Muovi il serpente verso la posizione del cursore
        this.x -= dx / this.speed;
        this.y -= dy / this.speed;
      }, 16); // Aggiorna la posizione ogni 16 ms (circa 60 FPS)
    }
}
