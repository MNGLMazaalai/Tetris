import { shapes } from './shapes.js';
let app = new PIXI.Application({
  width: 550,
  height: 550,
  // backgroundColor: 0xffffff,
});
document.body.appendChild(app.view);
// container.rotation = (Math.PI * 2 * 360) / 90;
const gameBoard = new PIXI.Container();
const cellTexture = PIXI.Texture.from('assets/cell.png');
const shapeTexture = PIXI.Texture.from('assets/shapeCell.png');
const cellSize = 25,
  marginLeft = 7.5,
  marginTop = 5,
  width = 10,
  height = 20;

app.stage.addChild(gameBoard);
// border
var bg = new PIXI.Sprite(PIXI.Texture.WHITE);
bg.width = width * cellSize + 10;
bg.height = height * cellSize + 10;
bg.x = marginLeft * cellSize - 5;
bg.tint = 0x393939;
gameBoard.addChild(bg);

//cells
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
//
function renderSprite(width, height, x, y, texture) {
  const sprite = new PIXI.Sprite(texture);
  sprite.width = width;
  sprite.height = height;
  sprite.x = x + marginLeft * cellSize;
  sprite.y = y + marginTop;
  return sprite;
}
