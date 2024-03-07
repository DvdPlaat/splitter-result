# splitter

## Running

Clone the splitter repo and run
```
dotnet publish -c Release -r linux-x64 --self-contained false
mv ./Tester/bin/Release/net8.0/linux-x64 <THISREPOPATH>/tester
./test.sh # After that this is all you need to run to start it
```
You do need to install [Bun](https://bun.sh) tho this only works on linux while maybe not when you see this cause they are working on windows support

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.27. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
