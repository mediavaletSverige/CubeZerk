export let development = true;

export const collisionBox = function (context, minDistance, alpha) {
  if (!development) return;
  context.beginPath();
  context.arc(this.collisionX, this.collisionY, minDistance, 0, Math.PI * 2);
  context.save();
  context.globalAlpha = alpha;
  context.fill();
  context.restore();
  context.stroke();
};

const objectDistance = (x, y) => (y ** 2 + x ** 2) ** (1 / 2);

const collision = function (objA, objB, targetBoundary, sourceBoundary) {
  const dx = objA.collisionX - objB.collisionX;
  const dy = objA.collisionY - objB.collisionY;
  const distance = objectDistance(dx, dy);
  return [distance < targetBoundary + sourceBoundary, distance, targetBoundary + sourceBoundary, dx, dy];
};

export const populate = function (newObj, numObjects, minDistance) {
  let tries = 0;
  const arr = Object.entries(this).find((el) => el.indexOf('_') !== 0)[0];

  while (tries < 10000) {
    if (this[arr].length === numObjects) break;
    let preObj = new newObj(this.game);
    let objCollision = false;
    this[arr].forEach((el) => {
      const dx = preObj.collisionX - el.collisionX;
      const dy = preObj.collisionY - el.collisionY;

      const objDistance = objectDistance(dx, dy);

      if (objDistance < minDistance * 2) objCollision = true;
    });

    if (
      !objCollision &&
      preObj.spriteX > 0 &&
      preObj.spriteY > 0 &&
      preObj.spriteX < this.game.safeWidth - preObj.width &&
      preObj.spriteY < this.game.safeHeight - preObj.height
    )
      this[arr].push(preObj);

    tries++;
  }
};

let buildingCrashTimer = null;
let rockCrashTimer = null;

export const carBehavior = function (Car, collisionXOffset = 0, collisionYOffset = 0) {
  this.spriteX = this.collisionX - this.width * 0.5 - collisionXOffset;
  this.spriteY = this.collisionY - this.height * 0.5 - collisionYOffset;
  this.dx = this.game.mouse.x - this.collisionX;
  this.dy = this.game.mouse.y - this.collisionY;

  const angle = Math.atan2(this.dy, this.dx);
  const directions = [-1.17, -0.39, 0.39, 1.17, 1.96, 2.74];
  this.frameY = directions.findIndex((dir) => angle < dir);

  if (angle < -1.96) this.frameY = 7;
  if (angle < -2.74 || angle > 2.74) this.frameY = 6;

  const distance = objectDistance(this.dx, this.dy);
  this.speedX = (distance > this.speed && this.dx / distance) || 0;
  this.speedY = (distance > this.speed && this.dy / distance) || 0;
  this.collisionX += this.speedX * this.speed;
  this.collisionY += this.speedY * this.speed;

  // Car interacting with buildings
  this.game.building._buildings.forEach((building) => {
    let [coll, dist, rad, dx, dy] = collision(this, building, building.boundary, this.game.car.boundary);

    if (!coll) return;

    this.speed = 1;
    const unitX = dx / dist;
    const unitY = dy / dist;
    this.collisionX = building.collisionX + (rad + 5) * unitX;
    this.collisionY = building.collisionY + (rad + 5) * unitY;

    if (buildingCrashTimer) clearTimeout(buildingCrashTimer);
    buildingCrashTimer = setTimeout(() => {
      this.speed = 3;
      buildingCrashTimer = null;
    }, 10000);
  });

  // Car interacting with rocks
  this.game.rock._rocks.forEach((rock) => {
    let [coll, dist, rad, dx, dy] = collision(this, rock, rock.boundary, this.game.car.boundary);

    if (!coll) return;

    const unitX = dx / dist;
    const unitY = dy / dist;
    rock.collisionX = this.collisionX - rad * unitX;
    rock.collisionY = this.collisionY - rad * unitY;

    if (!buildingCrashTimer) {
      this.speed = 1;
      if (rockCrashTimer) clearTimeout(rockCrashTimer);
      rockCrashTimer = setTimeout(() => (this.speed = 3), 100);
    }
  });

  // Car interacting with edge
  const rX = this.collisionX;
  const rY = this.collisionY;
  const sX = this.game.safeWidth;
  const sY = this.game.safeHeight;

  const north = rY < 62.5;
  const east = rX > sX + 62.5;
  const south = rY > sY + 62.5;
  const west = rX < 62.5;

  let fallingCar = false;
  let spinningCar;

  if (north || east || south || west) {
    this.boundary = null;
    fallingCar = true;
    this.hasBeenDeleted = true;
  }

  if (fallingCar) {
    fallingCar = false;
    const fallingRockTimer = setInterval(() => {
      this.width *= 0.9;
      this.height *= 0.9;
      if (spinningCar.width <= 10) {
        clearTimeout(fallingRockTimer);
      }
    }, 100);
  }
};

export const rockBehavior = async function (Rock, collisionXOffset = 0, collisionYOffset = 0) {
  this.spriteX = this.collisionX - this.width * 0.5 - collisionXOffset;
  this.spriteY = this.collisionY - this.height * 0.5 - collisionYOffset;
  this.dx = this.collisionX;
  this.dy = this.collisionY;

  const distance = objectDistance(this.dx, this.dy);
  this.speedX = (distance > this.speed && this.dx / distance) || 0;
  this.speedY = (distance > this.speed && this.dy / distance) || 0;

  // Rock interacting with buildings
  this.game.building._buildings.forEach((building) => {
    let [coll, dist, rad, dx, dy] = collision(this, building, building.boundary, this.game.rock.boundary);

    if (!coll) return;

    const unitX = dx / dist;
    const unitY = dy / dist;

    this.collisionX = building.collisionX + (rad + 2) * unitX;
    this.collisionY = building.collisionY + (rad + 2) * unitY;
  });

  // Rocks interacting with each other
  this.game.rock._rocks.forEach((sourceRock, sourceIndex) => {
    // Rocks interacting with edge
    const rX = sourceRock.collisionX;
    const rY = sourceRock.collisionY;
    const sX = this.game.safeWidth;
    const sY = this.game.safeHeight;

    const north = rY < 62.5;
    const east = rX > sX + 62.5;
    const south = rY > sY + 62.5;
    const west = rX < 62.5;

    let fallingRock = false;
    let spinningRock;

    if (north || east || south || west) {
      if (this.game.rock._rocks[sourceIndex].rockImage.id === 'rock') {
        fallingRock = true;
        spinningRock = new Rock(this.game);
        spinningRock.boundary = null;
        spinningRock.collisionX = west ? rX - 20 : east ? rX + 20 : rX;
        spinningRock.collisionY = north ? rY - 20 : south ? rY + 20 : rY;
        spinningRock.hasBeenDeleted = true;
        spinningRock.rockImage = document.getElementById('fallingRock');
        this.game.rock._rocks[sourceIndex] = spinningRock;
      }
    }

    if (fallingRock) {
      fallingRock = false;
      this.game.rock._rocks[sourceIndex] = spinningRock;
      const fallingRockTimer = setInterval(() => {
        spinningRock.width *= 0.9;
        spinningRock.height *= 0.9;
        spinningRock.boundary = 0;
        this.game.rock._rocks[sourceIndex] = spinningRock;
        if (spinningRock.width <= 10) {
          delete this.game.rock._rocks[sourceIndex];
          clearTimeout(fallingRockTimer);
        }
      }, 100);
    }

    this.game.rock._rocks.forEach((targetRock, targetIndex) => {
      if (sourceIndex === targetIndex) return;
      if (sourceRock.hasBeenDeleted || targetRock.hasBeenDeleted) return;

      let [coll, dist, rad, dx, dy] = collision(sourceRock, targetRock, targetRock.boundary, sourceRock.boundary);

      if (!coll) return;

      const unitX = dx / dist;
      const unitY = dy / dist;
      const overlap = rad * 2 - dist;

      sourceRock.collisionX -= overlap * unitX;
      sourceRock.collisionY -= overlap * unitY;
      targetRock.collisionX += overlap * unitX;
      targetRock.collisionY += overlap * unitY;
    });
  });
};
