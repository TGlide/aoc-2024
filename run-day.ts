import enquirer from "enquirer";
import { readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { $ } from "bun";

const { prompt } = enquirer;

const daysDir = "./days";

// Get all day folders
const days = readdirSync(daysDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .sort((a, b) => parseInt(a) - parseInt(b));

async function run() {
  const response = await prompt({
    type: "autocomplete",
    name: "day",
    message: "Select a day to run",
    choices: days,
  });

  const day = (response as { day: string }).day;
  console.log(`Running day ${day}...`);
  const dayPath = join(process.cwd(), daysDir, day, `${day}.ts`);
  // run bun --watch
  await $`bun run --watch ${dayPath}`;
}

run().catch(console.error);
