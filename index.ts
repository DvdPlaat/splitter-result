import { calculatePoints } from "./matrix";

enum Stages {
  Data = 0,
  Grid = 1,
  Dices = 2,
}

let stage: Stages = Stages.Data;

let width: number;
let height: number;
let rounds: number;

let state: number[][];
let grid: number[][] = [];

function rollDice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let gridIdx = 0;

function stateTo(s?: number[][]) {
  return (s ?? state).map((x) => x.map((z) => (z == -1 ? 0 : z)));
}

function onLineRead(line: string) {
  if (stage === Stages.Data) {
    const data = line.split(" ").map(Number);
    width = data[0];
    height = data[1];
    rounds = data[2];
    state = Array(height)
      .fill([])
      .map(() => []);
    stage = Stages.Grid;
  } else if (stage === Stages.Grid) {
    const rowData = line
      .split(" ")
      .map(Number)
      .map((x) => (x == 0 ? -1 : 0));
    state[gridIdx] = rowData;
    gridIdx++;

    const cc = line.split(" ").map(Number);
    grid.push(cc);
    if (gridIdx === height) {
      stage = Stages.Dices;
    }
  } else if (stage === Stages.Dices) {
    handleDiceLine(line);
  }
}

function handleDiceLine(line: string) {
  rounds--;
  const rollData = line.split(" ").map(Number);
  const first = rollData[0];
  const second = rollData[1];
  let x: number = 0;
  let y: number = 0;
  let num = 0;

  //   let currentPoints = calculatePoints(stateTo(), grid);

  let bestMovePoints = 0;
  let bestMove: [number, number, number] = [0, 0, 0];

  let tries = 100;

  while (true) {
    if (!(state[y][x] !== 0 || state[y][x] === -1) && tries <= 0) {
      if (bestMovePoints != 0) {
        num = bestMove[0];
        x = bestMove[1];
        y = bestMove[2];
      } else {
        num = first;
      }
      break;
    }
    x = rollDice(0, width / 2 - 1);
    y = rollDice(0, height - 1);

    let copy = stateTo(structuredClone(state));
    copy[y][x] = first;
    copy[y][width - x - 1] = second;

    let flip = () => {
      copy[y][x] = second;
      copy[y][width - x - 1] = first;
      return true;
    };
    if (calculatePoints(copy, grid) > bestMovePoints) {
      if (!(state[y][x] !== 0 || state[y][x] === -1)) {
        bestMovePoints = calculatePoints(copy, grid);
        bestMove = [first, x, y];
      }
    } else if (flip() && calculatePoints(copy, grid) > bestMovePoints) {
      if (!(state[y][x] !== 0 || state[y][x] === -1)) {
        bestMovePoints = calculatePoints(copy, grid);
        bestMove = [second, x, y];
      }
    } else {
      tries--;
    }
  }
  state[y][x] = num;
  state[y][width - x - 1] = num == first ? second : second;

  console.log(`${num} ${x} ${y}`);
}

async function readStdin(onLineRead: (line: string) => void) {
  const stream = await Bun.stdin.stream();
  const decoder = new TextDecoder();

  let remainingData = "";

  for await (const chunk of stream) {
    const str = decoder.decode(chunk);

    remainingData += str; // Append the chunk to the remaining data

    // Split the remaining data by newline character
    let lines = remainingData.split(/\r?\n/);
    // Loop through each line, except the last one
    while (lines.length > 1) {
      // Remove the first line from the array and pass it to the callback
      onLineRead(lines.shift()!);
    }
    // Update the remaining data with the last incomplete line
    remainingData = lines[0];
  }
}
readStdin(onLineRead);
