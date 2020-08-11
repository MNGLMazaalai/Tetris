const cellSize = 25,
  width = 10,
  height = 20;
let currentShapePos,
  oneSave,
  currentShape,
  currentShapeData,
  allShapePos = [],
  gameBoardData = []; // y, x

import { shapes } from './shapes.js';
// require('pixi-layers');
const app = new PIXI.Application({
  width: width * cellSize,
  height: height * cellSize,
  // backgroundColor: 0xffffff,
});
document.body.appendChild(app.view);
// container.rotation = (Math.PI * 2 * 360) / 90;
const gameBoard = new PIXI.Container();
const cellTexture = PIXI.Texture.from('assets/cell.png');

app.stage.addChild(gameBoard);
window.addEventListener('keydown', checkKey);
// document.body.onkeydown = checkKey;

// draw game board
for (let i = 0; i < width * height; i++) {
  const boardCell = renderSprite(
    cellSize,
    cellSize,
    (i % width) * cellSize,
    Math.floor(i / width) * cellSize,
    cellTexture
  );
  boardCell.alpha = 0.1;
  gameBoard.addChild(boardCell);
}
let game = startGame();
// render function for sprite with texture
function renderSprite(width, height, x, y, texture) {
  const sprite = new PIXI.Sprite(texture);
  sprite.width = width;
  sprite.height = height;
  sprite.x = x;
  sprite.y = y;
  return sprite;
}
//function for starting game
function startGame() {
  for (let i = 0; i < height; i++) {
    let tmp = [];
    allShapePos.push(new Array(width));
    for (let i = 0; i < width; i++) tmp.push(0);
    gameBoardData.push(tmp);
  }

  currentShape = addShape();
  return setInterval(function () {
    shapeFall();
  }, 1000);
}
// function for checking if it is able to fall
function checkFall() {
  for (let i = 0; i < currentShape.length; i++) {
    let x = currentShape[i].x / cellSize;
    let y = currentShape[i].y / cellSize;
    if (y + 1 >= height) return false;
    if (y + 1 >= 0 && gameBoardData[y + 1][x] == 1) return false;
  }
  return true;
}
// function for finishing game
function gameOver() {
  alert("Game over!!!");
  document.body.onkeydown = null;
  clearInterval(game);

}
//function for clearing line
function checkDestroy() {
  for (let i = 0; i < height; i++) {
    let cnt = 0;
    for (let j = 0; j < width; j++) {
      if (gameBoardData[i][j]) cnt++;
    }
    if (cnt != 10) continue
    for (let j = 0; j < 10; j++) {
      gameBoard.removeChild(allShapePos[i][j]);
      allShapePos[i][j] = null;
      gameBoardData[i][j] = 0;
    }
    for (let y = i; y > 0; y--) {
      for (let x = 0; x < width; x++) {
        if (allShapePos[y - 1][x] != null) {
          allShapePos[y][x] = allShapePos[y - 1][x];
          allShapePos[y - 1][x] = null;
          allShapePos[y][x].y += cellSize;
        }
      }
    }
    
    for (let y = i; y > 0; y--) {
      for (let x = 0; x < width; x++) {
        if (allShapePos[y][x] != null) {
          gameBoardData[y][x] = 1;
        } else {
          gameBoardData[y][x] = 0;
        }
      }
    }
  }
}
// add current shape to board
function addCurrentShape(currentShape) {
  for (let i = 0; i < currentShape.length; i++) {
    let x = currentShape[i].x / cellSize;
    let y = currentShape[i].y / cellSize;
    allShapePos[y][x] = currentShape[i];
  }
}
// drop shape on the gameBoard
function dropShape() {
  for (let i = 0; i < currentShape.length; i++) {
    let x = currentShape[i].x / cellSize;
    let y = currentShape[i].y / cellSize;
    if (y < 0 || x < 0) {
      gameOver();
      return;
    }
    if (y >= 0 && y < height && x >= 0 && x < width) gameBoardData[y][x] = 1;
  }
  oneSave = 0;
  addCurrentShape(currentShape);
  currentShape = addShape();
}
//make shape fall one grid
function shapeFall() {

  let curMove = checkFall();
  if (curMove == false && oneSave == 2) {
    dropShape(currentShape);
    return;
  }
  if (curMove == false) {
    oneSave += 1;
    return;
  }
  currentShapePos[0] += 1;
  for (let i = 0; i < currentShape.length; i++) {
    currentShape[i].y += cellSize;
  }
}
// function for creating shape
function addShape() {
  let curIdx = Math.floor(Math.random() * shapes.length);
  currentShapeData = shapes[curIdx];
  let len = currentShapeData.length;
  let newCurrentShape = [],
    cnt = 1;
  currentShapePos = [-1, 3];
  if (
    gameBoardData[0][3] == 1 ||
    gameBoardData[0][4] == 1 ||
    gameBoardData[0][5] == 1 ||
    gameBoardData[0][6] == 1
  )
    currentShapePos[0] -= 1;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (currentShapeData[i][j] == 0) continue;
      currentShapeData[i][j] = cnt;
      cnt += 1;
      const currentShapeCell = renderSprite(
        cellSize,
        cellSize,
        (currentShapePos[1] + j) * cellSize,
        (currentShapePos[0] + i) * cellSize,
        PIXI.Texture.from('assets/shapeCell' + curIdx + '.png')
      );
      newCurrentShape.push(currentShapeCell);
      gameBoard.addChild(currentShapeCell);
    }
  }
  drawShadow(newCurrentShape);
  return newCurrentShape;
}
// function for rotating shapes
function rotateShape() {
  let len = currentShapeData.length;
  for (let i = 0; i < currentShape.length; i++) {
    let x = currentShape[i].x / cellSize - currentShapePos[1];
    let y = currentShape[i].y / cellSize - currentShapePos[0];
    let a = x + currentShapePos[0];
    let b = len - 1 - y + currentShapePos[1];
    // if (b < 0 || b >= width) return;
    if (b < 0) {
      moveRight();
    }
    if (b >= width) {
      moveLeft();
    }
    if (
      a >= 0 &&
      b >= 0 &&
      a < height &&
      b < width &&
      gameBoardData[a][b] == 1
    )
      return;
  }
  for (let i = 0; i < currentShape.length; i++) {
    let x = currentShape[i].x / cellSize - currentShapePos[1];
    let y = currentShape[i].y / cellSize - currentShapePos[0];
    currentShape[i].y = (x + currentShapePos[0]) * cellSize;
    currentShape[i].x = (len - 1 - y + currentShapePos[1]) * cellSize;
  }
}
// function for moving current shape left
function moveLeft() {
  for (let i = 0; i < currentShape.length; i++) {
    let x = currentShape[i].x / cellSize;
    let y = currentShape[i].y / cellSize;
    if (x - 1 < 0) return;
    if (y >= 0 && x - 1 >= 0 && gameBoardData[y][x - 1] == 1) return;
  }
  currentShapePos[1] -= 1;
  for (let i = 0; i < currentShape.length; i++) {
    currentShape[i].x -= cellSize;
  }
}
// function for moving current shape left
function moveRight() {
  for (let i = 0; i < currentShape.length; i++) {
    let x = currentShape[i].x / cellSize;
    let y = currentShape[i].y / cellSize;
    if (x + 1 >= width) return;
    if (y >= 0 && x + 1 >= 0 && gameBoardData[y][x + 1] == 1) return;
  }
  currentShapePos[1] += 1;
  for (let i = 0; i < currentShape.length; i++) {
    currentShape[i].x += cellSize;
  }
}
// keyboard event handle
function checkKey(e) {
  e = e || window.event;
  let cur;
  if (e.keyCode != 32 && (e.keyCode < 37 || e.keyCode > 40)) return;
  if (e.keyCode == 32) {
    while (checkFall()) {
      currentShapePos[0] += 1;
      for (let i = 0; i < currentShape.length; i++) {
        currentShape[i].y += cellSize;
      }
    }
    dropShape();
  }
  if (e.keyCode == '37') moveLeft();
  if (e.keyCode == '38') rotateShape();
  if (e.keyCode == '39') moveRight();
  if (e.keyCode == '40') {
    if (checkFall()) {
      currentShapePos[0] += 1;
      for (let i = 0; i < currentShape.length; i++) {
        currentShape[i].y += cellSize;
      }
    }
  }
}