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

function isValidMove(state: number[][], x: number, y: number): boolean {
  return !(state[y][x] !== 0 || state[y][x] === -1);
}

function makeMove(state: number[][], x: number, y: number): number[][] {
  const newState = stateTo(state);
  newState[y][x] = 1; // Assuming 1 represents a valid move in the state
  return newState;
}

function gameIsOver(state: number[][]): boolean {
  // Implement the condition for determining if the game is over
  return !state.some((s) => s.includes(0));
}

const LOOKAHEAD_DEPTH = 3;

function minimax(
  state: number[][],
  depth: number,
  maximizingPlayer: boolean,
  alpha: number,
  beta: number,
  grid: number[][]
): number {
  if (depth === 0 || gameIsOver(state)) {
    return calculatePoints(state, grid);
  }

  if (maximizingPlayer) {
    let maxEval = Number.NEGATIVE_INFINITY;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width / 2; x++) {
        if (isValidMove(state, x, y)) {
          const newState = makeMove(state, x, y);
          const ev = minimax(newState, depth - 1, false, alpha, beta, grid);
          maxEval = Math.max(maxEval, ev);
          alpha = Math.max(alpha, ev);
          if (beta <= alpha) {
            break;
          }
        }
      }
    }
    return maxEval;
  } else {
    let minEval = Number.POSITIVE_INFINITY;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width / 2; x++) {
        if (isValidMove(state, x, y)) {
          const newState = makeMove(state, x, y);
          const ev = minimax(newState, depth - 1, true, alpha, beta, grid);
          minEval = Math.min(minEval, ev);
          beta = Math.min(beta, ev);
          if (beta <= alpha) {
            break;
          }
        }
      }
    }
    return minEval;
  }
}

function findBestMove(state: number[][], grid: number[][]): [number, number] {
  let bestEval = Number.NEGATIVE_INFINITY;
  let bestMove: [number, number] = [0, 0];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width / 2; x++) {
      if (isValidMove(state, x, y)) {
        const newState = makeMove(state, x, y);
        const ev = minimax(
          newState,
          LOOKAHEAD_DEPTH,
          false,
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
          grid
        );
        if (ev > bestEval) {
          bestEval = ev;
          bestMove = [x, y];
        }
      }
    }
  }
  return bestMove;
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

  const bestMove = findBestMove(state, grid);
  const x = bestMove[0];
  const y = bestMove[1];

  state[y][x] = first;
  state[y][width - x - 1] = second;

  console.log(`${first} ${x} ${y}`);
}

async function readStdin(onLineRead: (line: string) => unknown) {
  const stream = await Bun.stdin.stream();
  const decoder = new TextDecoder();

  let remainingData = "";

  for await (const chunk of stream) {
    const str = decoder.decode(chunk);

    remainingData += str;

    let lines = remainingData.split(/\r?\n/);
    while (lines.length > 1) {
      onLineRead(lines.shift()!);
    }
    remainingData = lines[0];
  }
}
readStdin(onLineRead);
