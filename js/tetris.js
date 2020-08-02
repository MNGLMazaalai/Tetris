const cellSize = 25,
  width = 10,
  height = 20;
let currentShapePos,
  gameBoardData = []; // y, x

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
  let tmp = [];
  for (let i = 0; i < 10; i++) tmp.push(0);
  for (let i = 0; i < 20; i++) gameBoardData.push(tmp);
  // console.log(gameBoardData);
  let currentShape = dropShape();
  // shapeFall(currentShape);
  return setInterval(function () {
    shapeFall(currentShape);
  }, 1000);
}
function shapeFall(currentShape) {
  currentShapePos[0] += 1;
  for (let i = 0; i < currentShape.length; i++) {
    currentShape[i].y += cellSize;
  }
}
// function for froping shape
function dropShape() {
  let curIdx = Math.floor(Math.random()) % shapes.length;
  let currentShapeData = shapes[curIdx];
  let len = currentShapeData.length;
  let currentShape = [];
  currentShapePos = [-2, 3];
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
