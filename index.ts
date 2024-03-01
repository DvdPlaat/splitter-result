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

function onLineRead(line: string) {
  // console.log(`>${line}`)
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
    gridIdx++;
    const rowData = line
      .split(" ")
      .map(Number)
      .map((x) => (x == 0 ? -1 : 0));
    state[gridIdx] = rowData;

    const cc = line.split(" ").map(Number);
    grid.push(cc);
    if (gridIdx === height) {
      stage = Stages.Dices;
    }
  } else if (stage === Stages.Dices) {
    rounds--;
    const rollData = line.split(" ").map(Number);
    const first = rollData[0];
    const second = rollData[1];
    let x: number = 0,
      y: number = 0;

    while (true) {
      if (!(state[y][x] !== 0 || state[y][x] === -1)) break;
      x = rollDice(0, width / 2 - 1);
      y = rollDice(0, height);
    }
    state[y][x] = first;
    state[y][width - x - 1] = second;
    // console.log(`--- GRID --- ${grid.map(x=>x.join(" ").replaceAll("-1", "X")).join("\n")}`)
    console.log(`${first} ${x} ${y - 1}`);

    console.log("# rounds " + rounds);
    if (rounds == 1) {
      Bun.write(Bun.file("compare.json"), JSON.stringify({ grid, state }));
      console.log(
        `Points calculated: ${calculatePoints(
          state
            .filter((x) => x.length)
            .map((x) => x.map((z) => (z == -1 ? 0 : z))),
          grid
        )}`
      );
    }
  }
}

async function readStdin(onLineRead) {
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
      onLineRead(lines.shift());
    }
    // Update the remaining data with the last incomplete line
    remainingData = lines[0];
  }
}
readStdin(onLineRead);
