const args = ["1", "2"];

let jobs = [];

for (let i = 0; i < 20; i++) {
  jobs.push(
    Bun.$`./tester/Tester --command "bun index.ts" --games 50 --silent --seed ${i} --layout ${
      args[i % 2]
    }`
      .text()
      .then((r) => parseFloat(r.split("\n")[2].split(" ").at(-1)!))
  );
}

const res = await Promise.all(jobs);

console.log(res.reduce((a, b) => a + b, 0) / res.length);
