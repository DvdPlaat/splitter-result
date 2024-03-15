import { calculatePoints, countIslands, type Point } from "./matrix";
import { test, expect, describe } from "bun:test";

function string2Islands(input: string) {
  return countIslands(
    input
      .trim()
      .split("\n")
      .map((x) => x.trim().split("").map(Number))
  );
}

describe("CountIslands", () => {
  test("CountIslands", () => {
    expect(
      string2Islands(`
    11111
    00000
    11111
    00000
    11111
    00000
    `).length
    ).toBe(3);
  });
  test("CountMoreIslands", () => {
    expect(
      string2Islands(`
    11111
    11111
    11111
    11111
    11111
    11111
    `).length
    ).toBe(1);
  });

  test("CountStars!", () => {
    expect(
      string2Islands(`
    1010101
    0101010
    1010101
    0101010
    `).length
    ).toBe(14);
  });

  test("should return correct number of islands and their coordinates", () => {
    const input = `
      11111
      00000
      11111
      00000
      11111
      00000
    `;
    const expectedOutput = [
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
        { x: 4, y: 0 },
      ],
      [
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 2 },
      ],
      [
        { x: 0, y: 4 },
        { x: 1, y: 4 },
        { x: 2, y: 4 },
        { x: 3, y: 4 },
        { x: 4, y: 4 },
      ],
    ];
    expect(string2Islands(input)).toEqual(expectedOutput);
  });

  test("should handle single island", () => {
    const input = `
      10001
      11111
      11111
      11111
      10001
    `;
    const expectedOutput = [
      [
        { x: 0, y: 0 },
        { x: 4, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 4, y: 1 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 2 },
        { x: 0, y: 3 },
        { x: 1, y: 3 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
        { x: 4, y: 3 },
        { x: 0, y: 4 },
        { x: 4, y: 4 },
      ],
    ];
    expect(string2Islands(input)).toEqual(expectedOutput);
  });

  test("should find islands in a grid", () => {
    const input = `
      11111
      00000
      11111
      00000
      11111
      00000
    `;
    const expectedOutput: Point[][] = [
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
        { x: 4, y: 0 },
      ],
      [
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 2 },
      ],
      [
        { x: 0, y: 4 },
        { x: 1, y: 4 },
        { x: 2, y: 4 },
        { x: 3, y: 4 },
        { x: 4, y: 4 },
      ],
    ];

    const result = string2Islands(input);
    expect(result).toEqual(expectedOutput);
  });

  test("should handle a grid with no islands", () => {
    const input = `
      00000
      00000
      00000
      00000
      00000
    `;
    const expectedOutput: Point[][] = [];
    const result = string2Islands(input);
    expect(result).toEqual(expectedOutput);
  });

  test("should handle an empty input", () => {
    expect(countIslands([[]])).toEqual([]);
  });

  test("should handle a single-row input", () => {
    expect(countIslands([[1, 0, 1]])).toEqual([
      [{ x: 0, y: 0 }],
      [{ x: 2, y: 0 }],
    ]);
  });

  test("should handle a single-column input", () => {
    expect(countIslands([[1], [0], [1]])).toEqual([
      [{ x: 0, y: 0 }],
      [{ x: 0, y: 2 }],
    ]);
  });
});
