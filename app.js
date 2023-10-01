import Game from './handlers/_gameHandler.js';

window.addEventListener('load', function () {
  const gameScreen = document.getElementById('gameScreen');
  const gameScreenContext = gameScreen.getContext('2d');
  gameScreen.width = 1280;
  gameScreen.height = 720;

  gameScreenContext.lineWidth = 5;
  gameScreenContext.fillStyle = 'white';
  gameScreenContext.strokeStyle = 'white';

  const game = new Game(gameScreen);

  // p1 = amount of objects to spaw, p2 = object distance
  game.populateBuildings(5, game.building.minDistance);
  game.populateRocks(25, game.rock.minDistance);

  void (function animateMovement() {
    gameScreenContext.clearRect(0, 0, gameScreen.width, gameScreen.height);

    game.renderSafeArea(gameScreenContext);
    game.renderCar(gameScreenContext);
    game.renderBuilding(gameScreenContext);
    game.renderRock(gameScreenContext);

    window.requestAnimationFrame(animateMovement);
  })();
});
