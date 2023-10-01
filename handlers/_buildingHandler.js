import { collisionBox } from './_factoryHandler.js';

export default class {
  constructor(game) {
    this._buildings = [];
    this.game = game;
    this.collisionX = Math.random() * this.game.width;
    this.collisionY = Math.random() * this.game.height;
    this.buildingCollision = false;
    this.buildingsImage = document.getElementById('buildings');
    this.spriteWidth = 250;
    this.spriteHeight = 250;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5;
    this.randomSpriteX = Math.floor(Math.random() * 4);
    this.randomSpriteY = Math.floor(Math.random() * 3);
    this.boundary = 120;
    this.minDistance = 185;
  }

  drawBuilding(context) {
    context.drawImage(
      this.buildingsImage,
      this.randomSpriteX * this.spriteWidth,
      this.randomSpriteY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );
    collisionBox.call(this, context, this.boundary, 0.5);
  }
}
