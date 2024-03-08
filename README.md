# Splitter

## Requirements

Install the dependencies

- [Bun](https://bun.sh) and run: `bun install`
- dotnet8
- Clone [splitter](https://github.com/Lucrasoft/Splitter), restore the packages and run `dotnet publish -c Release --self-contained false`. After that, move the binaries to the `tester` folder in the project root.

> [!TIP]
> If you want to use `dotnet8` on a Raspbery Pi:
> 
> ```sh
> curl -fsSL https://raw.githubusercontent.com/pjgpetecodes/dotnet8pi/main/install.sh | sudo bash
> ```

## Running

Clone the [splitter repo](https://github.com/Lucrasoft/Splitter) and run
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
