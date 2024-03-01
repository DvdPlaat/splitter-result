import { Matrix, calculatePoints } from "./matrix";
import { test, expect, describe } from "bun:test";

describe("ScoreTests", () => {
  const gridC: number[][] = [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ];

  const gridD: number[][] = [[2]];

  const gridE: number[][] = [
    [0, 1, 1, 1, 1, 0],
    [3, 1, 1, 3, 1, 1],
    [0, 1, 1, 1, 1, 0],
  ];

  const gridF: number[][] = [
    [3, 3],
    [1, 1],
    [2, 2],
  ];

  const calculatePointsWrapper = (grid: number[][], state: number[][]) => {
    return calculatePoints(state, grid);
  };

  test("TestAllGroups", () => {
    const state: number[][] = [
      [0, 0, 0, 0, 0],
      [3, 3, 3, 4, 4],
      [1, 2, 2, 4, 4],
      [0, 0, 0, 0, 0],
    ];

    expect(calculatePointsWrapper(gridC, state)).toBe(10);
  });

  test("TestZero", () => {
    const state: number[][] = [
      [0, 0, 0, 0, 0],
      [3, 2, 3, 5, 4],
      [1, 1, 2, 4, 4],
      [0, 0, 0, 0, 0],
    ];

    expect(calculatePointsWrapper(gridC, state)).toBe(3);
  });

  test("TestDouble", () => {
    const state: number[][] = [[1]];

    expect(calculatePointsWrapper(gridD, state)).toBe(2);
  });

  test("TestHearts", () => {
    const state: number[][] = [
      [0, 6, 6, 6, 6, 0],
      [4, 1, 1, 4, 2, 3],
      [0, 6, 6, 6, 6, 0],
    ];

    expect(calculatePointsWrapper(gridE, state)).toBe(12);
  });

  test("TestRandom", () => {
    const state: number[][] = [
      [0, 0, 0, 0, 0],
      [3, 3, 3, 5, 4],
      [1, 5, 2, 4, 4],
      [0, 0, 0, 0, 0],
    ];

    expect(calculatePointsWrapper(gridC, state)).toBe(5);
  });

  test("TestBigGrid", () => {
    const state: number[][] = [
      [1, 1, 1, 0, 0, 1, 3, 1],
      [1, 1, 3, 3, 3, 1, 1, 1],
      [0, 6, 1, 1, 1, 1, 5, 0],
      [0, 1, 1, 0, 0, 3, 5, 0],
      [0, 1, 1, 1, 6, 5, 5, 0],
      [1, 1, 1, 1, 2, 2, 5, 1],
      [2, 2, 1, 0, 0, 1, 2, 1],
    ];

    // expect(calculatePointsWrapper(Grids.GridB, state)).toBe(15);
  });

  test("TestWeirdGrid", () => {
    const state: number[][] = [
      [2, 2],
      [4, 4],
      [4, 4],
    ];

    expect(calculatePointsWrapper(gridF, state)).toBe(19);
  });

  test("TestGridA", () => {
    const state: number[][] = [
      [0, 0, 2, 4, 5, 1, 0, 0],
      [0, 1, 3, 3, 3, 1, 1, 0],
      [5, 6, 1, 1, 1, 1, 5, 5],
      [3, 1, 1, 6, 6, 3, 5, 4],
      [1, 1, 1, 1, 6, 5, 5, 5],
      [0, 1, 1, 1, 2, 2, 5, 0],
      [0, 0, 1, 6, 6, 1, 0, 0],
    ];

    // expect(calculatePointsWrapper(Grids.GridA, state)).toBe(7);
  });
  test("Random", () => {
    expect(
      calculatePoints(
        [
          [0, 0, 5, 3, 5, 5, 0, 0],
          [0, 6, 3, 5, 3, 4, 5, 0],
          [3, 3, 6, 3, 5, 5, 2, 5],
          [1, 5, 3, 1, 6, 6, 4, 3],
          [3, 2, 4, 0, 0, 6, 4, 2],
          [0, 5, 1, 2, 4, 6, 5, 0],
          [0, 0, 6, 2, 3, 2, 0, 0],
        ],
        [
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [2, 1, 1, 1, 1, 1, 1, 2],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
        ]
      )
    ).toBe(15);
  });
});
