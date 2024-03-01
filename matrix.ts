interface Point {
  x: number;
  y: number;
}

class Grids {
  public static EMPTY: number = 0;
  public static FIELD: number = 1;
  public static STAR: number = 2;
  public static HEART: number = 3;
}

export class Matrix {
  public static countIslands(state: number[][]): Point[][] {
    const n: number = state.length;
    const m: number = state[0].length;
    const dus: DisjointUnionSets = new DisjointUnionSets(n * m);

    for (let j = 0; j < n; j++) {
      for (let k = 0; k < m; k++) {
        if (state[j][k] === 0) continue;

        if (j + 1 < n && state[j + 1][k] === 1)
          dus.union(j * m + k, (j + 1) * m + k);
        if (j - 1 >= 0 && state[j - 1][k] === 1)
          dus.union(j * m + k, (j - 1) * m + k);
        if (k + 1 < m && state[j][k + 1] === 1)
          dus.union(j * m + k, j * m + k + 1);
        if (k - 1 >= 0 && state[j][k - 1] === 1)
          dus.union(j * m + k, j * m + k - 1);
      }
    }

    const islandSets: Map<number, Point[]> = new Map();
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < m; k++) {
        if (state[j][k] === 1) {
          const root: number = dus.find(j * m + k);
          if (!islandSets.has(root)) islandSets.set(root, []);
          islandSets.get(root)!.push({ x: k, y: j });
        }
      }
    }

    const islandTuples: Point[][] = Array.from(islandSets.values());

    return islandTuples;
  }
}

class DisjointUnionSets {
  private rank: number[];
  private parent: number[];
  private n: number;

  constructor(n: number) {
    this.rank = new Array(n).fill(0);
    this.parent = new Array(n).fill(0).map((_, index) => index);
    this.n = n;
  }

  public find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  public union(x: number, y: number): void {
    const xRoot: number = this.find(x);
    const yRoot: number = this.find(y);

    if (xRoot === yRoot) return;

    if (this.rank[xRoot] < this.rank[yRoot]) this.parent[xRoot] = yRoot;
    else if (this.rank[yRoot] < this.rank[xRoot]) this.parent[yRoot] = xRoot;
    else {
      this.parent[yRoot] = xRoot;
      this.rank[xRoot] += 1;
    }
  }
}

export function calculatePoints(state: number[][], grid: number[][]): number {
  let points: number = 0;

  for (let i = 1; i <= 6; i++) {
    const stateCopy: number[][] = state.map((row) => [...row]);
    for (let k = 0; k < stateCopy.length; k++) {
      for (let j = 0; j < stateCopy[0].length; j++) {
        if (stateCopy[k][j] !== i) stateCopy[k][j] = Grids.EMPTY;
        else stateCopy[k][j] = 1;
      }
    }

    const res: Point[][] = Matrix.countIslands(stateCopy);
    console.log("# len: " + res.length);
    const received: number = res.filter((c) => c.length === i).length * i;
    points += received;

    const starPlaces: Point[] = [];
    const heartPlaces: Point[] = [];

    grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === Grids.STAR) starPlaces.push({ x, y });
        else if (value === Grids.HEART) heartPlaces.push({ x, y });
      });
    });

    res
      .filter((c) => c.length === i)
      .forEach((arr) => {
        if (arr.some((c) => starPlaces.some((p) => p.x === c.x && p.y === c.y)))
          points += i;
      });

    let heartsReached: number = 0;
    heartPlaces.forEach((heart) => {
      if (state[heart.y][heart.x] === i) heartsReached += 1;
    });

    if (heartsReached !== 0 && heartsReached === heartPlaces.length)
      points += 5;
  }

  return points;
}
