import enquirer from 'enquirer';
import { readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const { prompt } = enquirer;

const daysDir = './days';

// Get all day folders
const days = readdirSync(daysDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .sort((a, b) => parseInt(a) - parseInt(b));

async function run() {
  const response = await prompt({
    type: 'autocomplete',
    name: 'day',
    message: 'Select a day to run',
    choices: days
  });

  const day = (response as { day: string }).day;
  console.log(`Running day ${day}...`);
  const dayPath = join(process.cwd(), daysDir, day, `${day}.ts`);
  const fileUrl = `file://${dayPath}`;
  await import(fileUrl);
}

run().catch(console.error);
