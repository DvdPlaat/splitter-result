const args = ["1", "2"];
console.time("run");
let jobs = [];

for (let i = 0; i < 5; i++) {
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
console.log(
  "AVG POINTS:",
  (res.reduce((a, b) => a + b, 0) / res.length).toFixed(2)
);
