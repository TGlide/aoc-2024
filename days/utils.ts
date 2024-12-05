import fs from 'fs';

export function readFile(path: string) {
	return fs.readFileSync(path, 'utf8');
}

export function readDayInputs(day: number) {
	const input = readFile(`src/lib/days/${day}.txt`);
	const example = readFile(`src/lib/days/${day}-example.txt`);

	return { input, example };
}
