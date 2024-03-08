import { rm, mkdir } from "fs/promises";

await rm("./boards", { recursive: true });
await mkdir("./boards");
