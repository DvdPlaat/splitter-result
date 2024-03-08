# Splitter

This project was created using `bun init` in bun v1.0.27. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime. It also depens on [this](https://github.com/Lucrasoft/Splitter) repo wich requires dotnet 8.

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

### Install packages

You do need to install [Bun](https://bun.sh) tho this only works on linux while maybe not when you see this cause they are working on windows support

To install dependencies:

```sh
bun install
```

### Build

Build [splitter](https://github.com/Lucrasoft/Splitter) (on Windows and) for Lunux with the x86_64 architecture:

```sh
dotnet publish -c Release -r linux-x64 --self-contained false
mv ./Tester/bin/Release/net8.0/linux-x64 <THISREPOPATH>/tester
```

Build [splitter](https://github.com/Lucrasoft/Splitter) (on Windows and) for Lunux with the arm64 architecture:

```sh
dotnet publish -c Release -r linux-arm64 --self-contained false
mv ./Tester/bin/Release/net8.0/linux-arm64 <THISREPOPATH>/tester
```

## Running

After installing the requirements you can run [this](./test.sh) to start it:

```sh
./test.sh
```

To run:

```bash
bun run index.ts
```
