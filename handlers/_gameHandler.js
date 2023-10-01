import { populate } from './_factoryHandler.js';
import Car from './_carHandler.js';
import Building from './_buildingHandler.js';
import Rock from './_rockHandler.js';

export default class {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.width = this.gameScreen.width;
    this.height = this.gameScreen.height;
    this.safeWidth = this.width - 125;
    this.safeHeight = this.height - 125;
    this.car = new Car(this);
    this.building = new Building(this);
    this.rock = new Rock(this);
    this.rockTimer = 0;
    this.rockInterval = 500;
    this.mouse = { x: this.width * 0.5, y: this.height * 0.5, clicked: false };

    this.mouseEventHandler = function (event) {
      gameScreen.addEventListener(event, (e) => {
        if (this.mouse.clicked) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
        if (event === 'mousedown') this.mouse.clicked = true;
        if (event === 'mouseup') this.mouse.clicked = false;
      });
    };

    this.mouseEventHandler('mousedown');
    this.mouseEventHandler('mouseup');
    this.mouseEventHandler('mousemove');
  }

  populateBuildings(numBuildings, minDistance) {
    populate.apply(this.building, [Building, numBuildings, minDistance]);
  }

  populateRocks(numRocks, minDistance) {
    populate.apply(this.rock, [Rock, numRocks, minDistance]);
  }

  renderRock(context) {
    this.rock._rocks.forEach((rock) => rock.drawRock(context));
    this.rock.rockBehavior();
  }

  renderCar(context) {
    this.car.drawCar(context);
    this.car.carBehavior();
  }

  renderBuilding(context) {
    this.building._buildings.forEach((building) => building.drawBuilding(context));
  }

  renderSafeArea(context) {
    const x = (this.width - this.safeWidth) / 2;
    const y = (this.height - this.safeHeight) / 2;
    context.beginPath();
    context.fillStyle = 'darkgray';
    context.fillRect(x, y, this.safeWidth, this.safeHeight);
  }
}
