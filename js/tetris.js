const cellSize = 25,
  width = 10,
  height = 20,
  currentShapePos = [];
import { shapes } from './shapes.js';
// require('pixi-layers');
let app = new PIXI.Application({
  width: width * cellSize,
  height: height * cellSize,
  // backgroundColor: 0xffffff,
});
document.body.appendChild(app.view);
// container.rotation = (Math.PI * 2 * 360) / 90;
const gameBoard = new PIXI.Container();
const cellTexture = PIXI.Texture.from('assets/cell.png');

app.stage.addChild(gameBoard);
// draw game board border

// draw game board
for (let i = 0; i < width * height; i++) {
  const boardCell = renderSprite(
    cellSize,
    cellSize,
    (i % width) * cellSize,
    Math.floor(i / width) * cellSize,
    cellTexture
  );
  gameBoard.addChild(boardCell);
}
let game = startGame();
// render function for sprite with texture
function renderSprite(width, height, x, y, texture) {
  const sprite = new PIXI.Sprite(texture);
  sprite.zIndex = -1;
  sprite.width = width;
  sprite.height = height;
  sprite.x = x;
  sprite.y = y;
  return sprite;
}

//function for starting game
function startGame() {
  dropShape();
}

// function for froping shape
function dropShape() {
  let curIdx = Math.floor(Math.random()) % shapes.length;
  let currentShapeData = shapes[curIdx];
  let currentShape = [];
  let currentShapePos = [-2, 3]; // y, x
  let len = currentShapeData.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (currentShapeData[i][j] == 0) continue;
      const currentShapeCell = renderSprite(
        cellSize,
        cellSize,
        (currentShapePos[1] + j) * cellSize,
        (currentShapePos[0] + i) * cellSize,
        PIXI.Texture.from('assets/shapeCell' + curIdx + '.png')
      );
      currentShape.push(currentShapeCell);
      gameBoard.addChild(currentShapeCell);
    }
  }
  return currentShape;
  // gameBoard.addChild(currentShape);
}
