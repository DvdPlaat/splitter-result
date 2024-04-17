export interface Point {
  x: number;
  y: number;
}

class Grids {
  public static EMPTY: number = 0;
  public static FIELD: number = 1;
  public static STAR: number = 2;
  public static HEART: number = 3;
}

export function countIslands(state: number[][]): Point[][] {
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

class DisjointUnionSets {
  private rank: number[];
  private parent: number[];

  constructor(n: number) {
    this.rank = new Array(n).fill(0);
    this.parent = new Array(n).fill(0).map((_, index) => index);
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

  const starPlaces: Point[] = [];
  const heartPlaces: Point[] = [];
  grid.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === Grids.STAR) starPlaces.push({ x, y });
      else if (value === Grids.HEART) heartPlaces.push({ x, y });
    });
  });

  const stateCopy: number[][] = state.map((row) =>
    [...row].map((cell) => (cell === 0 ? 1 : 0))
  );

  const res: Point[][] = countIslands(stateCopy);

  points += Math.max(0, 2 - res.length);

  for (let i = 1; i <= 6; i++) {
    const stateCopy: number[][] = state.map((row) =>
      [...row].map((cell) => (cell === i ? 1 : 0))
    );

    const res: Point[][] = countIslands(stateCopy);
    const groupSize = res.filter((c) => c.length === i);

    let received = groupSize.length * i * 2;
    received +=
      (res.filter((c) => i !== 1 && c.length + 1 === i).length * i) / 4;
    received +=
      (res.filter((c) => i !== 1 && i !== 2 && c.length + 2 === i).length * i) /
      9;
    const toomuch = res.filter((c) => c.length > i).length * 1.2;
    const notEnough = res.filter((c) => c.length < i).length;
    points += received - toomuch - Math.min(notEnough, 6);

    res
      .filter((c) => c.length === i)
      .forEach((arr) => {
        if (arr.some((c) => starPlaces.some((p) => p.x === c.x && p.y === c.y)))
          points += i;
      });

    const heartsReached = heartPlaces.filter(
      (heart) => state[heart.y][heart.x] === i
    ).length;
    if (heartsReached === heartPlaces.length) points += heartsReached + 2;
  }

  for (const star of starPlaces) {
    let val = state[star.y][star.x];
    if (val == 1) continue;
    points += val === 0 ? 2 : val;

    let yMin = Math.max(0, star.y - 1);
    let yMax = Math.min(state.length - 1, star.y + 1);
    let xMin = Math.max(0, star.x - 1);
    let xMax = Math.min(state[0].length - 1, star.x + 1);

    for (let y = yMin; y <= yMax; y++) {
      for (let x = xMin; x <= xMax; x++) {
        if (x === star.x && y === star.y) continue;

        if (state[y][x] === 0) points += 0.005;
        if (state[y][x] === val) points += val / 9;
      }
    }
  }

  return points;
}
