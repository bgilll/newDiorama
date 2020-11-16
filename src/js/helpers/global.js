import Grid from '../config/grid';

export const isArrayInArray = (x, check) => {
  if (x && x.length > 0) {
    for (var i = 0, len = x.length; i < len; i++) {
      if (x[i][0] === check[0] && x[i][1] === check[1]) {
        return true;
      }
    }
  }

  return false;
}

export const getPositionAtCoor = (x, y) => {
  const posX = x * Grid.cellSize;
  const posY = y * Grid.cellSize;

  return { x: posX, y: posY };
}

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomCoor = () => {
  let coordinate = [getRandomInt(0, 9), getRandomInt(0, 9)];

  while (isArrayInArray(Grid.notWalkable, coordinate)) {
    coordinate = [getRandomInt(0, 9), getRandomInt(0, 9)]
  }

  return coordinate;
};