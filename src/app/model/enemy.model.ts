import { ISnake } from "./snake.model";
import { Timer } from "./timer.type";

export interface IEnemy extends ISnake{
    movementInterval?: Timer
}