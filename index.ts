import { calculatePoints } from "./matrix";
import { appendFile } from "fs/promises";
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

async function log(x: any) {
  appendFile("log.txt", x.toString() + "\n");
}

function handleDiceLine(line: string) {
  rounds--;
  const rollData = line.split(" ").map(Number);
  const first = rollData[0];
  const second = rollData[1];

  let bestMovePoints = -Infinity;
  let bestMove: [number, number, number] = [0, 0, 0];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width / 2; x++) {
      if (state[y][x] !== 0 || state[y][x] === -1) continue;

      const copy = stateTo(state);
      copy[y][x] = first;
      copy[y][width - x - 1] = second;
      let points = calculatePoints(copy, grid);

      if (points > bestMovePoints) {
        bestMovePoints = points;
        bestMove = [first, x, y];
      }

      copy[y][x] = second;
      copy[y][width - x - 1] = first;
      points = calculatePoints(copy, grid);

      if (points > bestMovePoints) {
        bestMovePoints = points;
        bestMove = [second, x, y];
      }
    }
  }

  const [num, x, y] = bestMove;

  state[y][x] = num;
  state[y][width - x - 1] = num == first ? second : first;

  console.log(`${num} ${x} ${y} `);
  // if (rounds == 0) {
  //   Bun.write(
  //     `boards/${Date.now()}_${crypto.randomUUID()}`,
  //     state
  //       .map((x) => x.join(" "))
  //       .join("\n")
  //       .replaceAll("-1", "0")
  //   );
  // }
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
