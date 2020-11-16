
const prevTaken = [[0, 5], [0, 6], [1, 6], [1, 5], [2, 5], [2, 6], [3, 6], [3, 5], [4, 5], [4, 6], [5, 6], [5, 5], [6, 5], [6, 6], [13, 0], [13, 2], [13, 1], [13, 3], [13, 4], [13, 5], [13, 6], [13, 7], [13, 8], [14, 8], [14, 7], [14, 6], [14, 5], [14, 4], [14, 3], [14, 2], [14, 1], [14, 0], [17, 4], [17, 5], [18, 5], [19, 5], [19, 4], [18, 4], [8, 8], [8, 9], [9, 9], [9, 8], [10, 8], [10, 9]];

const gridWidth = 500;
const gridHeight = 250;

const rows = 10;
const columns = 10;

const cellWidth = gridWidth / columns;

const allCells = [];
const takenCells = [];

const grid = document.querySelector('.grid');
grid.style.width = gridWidth + "px";
grid.style.height = gridHeight + "px";

let x = 0;
let y = 0;

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < columns; j++) {
    const coordinate = [j, i];
    allCells.push(coordinate);

    const cell = document.createElement('div');
    cell.classList.add('cell');

    cell.style.width = cellWidth + 'px';
    cell.style.height = cellWidth + 'px';

    cell.style.left = (x * cellWidth) + 'px';
    cell.style.top = (y * cellWidth) + 'px';

    const label = document.createElement('p');
    label.innerHTML = j + ', ' + i;

    // if sell was previosuly selected
    for (let x = 0; x < prevTaken.length; x++) {
      const check = prevTaken[x];

      if (check[0] == coordinate[0] && check[1] == coordinate[1]) {
        takenCells.push(coordinate);

        cell.style.backgroundColor = "#1d42f7";
        cell.style.borderColor = "#000";
        cell.style.color = "#fff";

        break
      }
    }

    cell.appendChild(label);
    grid.appendChild(cell);

    cell.addEventListener('click', (e) => toggleCell(e, coordinate));
    x++;
  }

  x = 0;
  y++;
}

document.getElementById('export').addEventListener('click', () => exportJSON());

const toggleCell = function (e, coordinate) {
  let taken = true;
  // current taken cells
  for (let i = 0; i < takenCells.length; i++) {
    const cell = takenCells[i];

    // cell exists
    if (cell[0] == coordinate[0] && cell[1] == coordinate[1]) {
      takenCells.splice(i, 1);
      taken = false;
      break;
    }
  }

  if (taken) {
    takenCells.push(coordinate);
  }

  e.target.style.backgroundColor = taken ? "#1d42f7" : "transparent";
  e.target.style.borderColor = taken ? "#000" : "#000";
  e.target.style.color = taken ? "#fff" : "#000";
}

const exportJSON = function () {
  var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(takenCells));

  var a = document.createElement('a');
  a.href = 'data:' + data;
  a.download = 'data.json';
  a.innerHTML = 'download JSON';

  a.click();
}



