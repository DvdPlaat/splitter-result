import { readFile, writeFile } from "fs/promises";
const args = ["1", "2"];
console.time("run");
let jobs = [];

import "./matrix";

for (let i = 0; i < 6; i++) {
  jobs.push(
    Bun.$`./tester/Tester --command "bun index.ts" --games 40 --silent --seed ${i} --layout ${
      args[i % 2]
    }`
      .text()
      .then((r) => parseFloat(r.split("\n")[2].split(" ").at(-1)!))
  );
}

const res = await Promise.all(jobs);

console.timeEnd("run");

let avg = parseFloat((res.reduce((a, b) => a + b, 0) / res.length).toFixed(2));
let oldAvg = parseFloat(
  await readFile("avg.txt", "utf-8").catch((e) => avg.toString())
);
let max = await readFile("max.txt", "utf-8")
  .catch((e) => "0")
  .then((x) => parseFloat(x));

let change = avg - oldAvg;
let color = change < 0 ? "\x1b[31m" : "\x1b[32m"; // Red for decrease, green for increase

// Output the information
console.log(`${avg}${color} ${change.toFixed(2)}\x1b[0m`);
console.log(`(${oldAvg}) max: ${max}\x1b[90m`);

if (avg > max) {
  writeFile("max.txt", avg.toString());
}

writeFile("avg.txt", avg.toString());
