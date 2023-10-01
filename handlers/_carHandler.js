import { collisionBox, carBehavior } from './_factoryHandler.js';

export default class {
  constructor(game) {
    this.game = game;
    this.carImage = document.getElementById('car');
    this.buildingImage = document.getElementById('buildings');
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.speedX = 0;
    this.speedY = 0;
    this.dx = 0;
    this.dy = 0;
    this.spriteWidth = 250;
    this.spriteHeight = 250;
    this.width = 50;
    this.height = 50;
    this.spriteX;
    this.spriteY;
    this.frameX;
    this.frameY;
    this.speed = 3;
    this.boundary = 25;
    this.hasBeenDeleted = false;
  }

  drawCar(context) {
    context.drawImage(
      this.carImage,
      0,
      this.frameY * this.spriteWidth,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );
    collisionBox.call(this, context, this.boundary, 0.5);
  }

  carBehavior = () => carBehavior.call(this, this.constructor);
}
