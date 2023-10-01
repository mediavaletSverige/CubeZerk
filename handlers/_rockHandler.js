import { collisionBox, rockBehavior } from './_factoryHandler.js';

export default class {
  constructor(game) {
    this._rocks = [];
    this.game = game;
    this.boundary = 30;
    this.margin = this.boundary * 4;
    this.collisionX = this.margin + Math.random() * (this.game.width - this.margin * 2);
    this.collisionY = this.margin + Math.random() * (this.game.height - this.margin * 2);
    this.rockImage = document.getElementById('rock');
    this.spriteWidth = 64;
    this.spriteHeight = 64;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;
    this.minDistance = 40;
    this.hasBeenDeleted = false;
  }

  drawRock(context) {
    context.drawImage(
      this.rockImage,
      0,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );
    collisionBox.call(this, context, this.boundary, 0.5);
  }

  rockBehavior() {
    this._rocks.forEach((rock) => rockBehavior.call(rock, this.constructor));
  }
}
