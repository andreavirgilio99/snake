import { ICoordinates } from "./coordinates.model";

export interface ISnake{
    segments: ICoordinates[];
    speed: number;
}