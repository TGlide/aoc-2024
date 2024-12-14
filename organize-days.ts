import { existsSync, mkdirSync, renameSync, readdirSync } from 'fs';
import { join } from 'path';

const daysDir = './days';

// First, move everything back to the days directory
const dayFolders = readdirSync(daysDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

dayFolders.forEach(folder => {
  const folderPath = join(daysDir, folder);
  const files = readdirSync(folderPath);

  files.forEach(file => {
    const oldPath = join(folderPath, file);
    const newPath = join(daysDir, file);
    renameSync(oldPath, newPath);
  });

  // Remove the empty folder
  require('fs').rmdirSync(folderPath);
});

// Now organize files into numbered folders
const files = readdirSync(daysDir);

// Group files by day number
const dayFiles = new Map<string, string[]>();

files.forEach((file: string) => {
  // Extract day number from filename (matches patterns like "1.ts", "1.txt", "1-example.txt")
  const match = file.match(/^(\d+)/);
  if (match) {
    const day = match[1];
    if (!dayFiles.has(day)) {
      dayFiles.set(day, []);
    }
    dayFiles.get(day)?.push(file);
  }
});

// Create folders and move files
dayFiles.forEach((files, day) => {
  const dayFolder = join(daysDir, day); // Just the number as folder name

  // Create folder if it doesn't exist
  if (!existsSync(dayFolder)) {
    mkdirSync(dayFolder);
    console.log(`Created folder: ${dayFolder}`);
  }

  // Move files to the folder
  files.forEach(file => {
    const oldPath = join(daysDir, file);
    const newPath = join(dayFolder, file);
    renameSync(oldPath, newPath);
    console.log(`Moved ${file} to ${dayFolder}`);
  });
});

console.log('Organization complete!');
