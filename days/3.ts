import { readFile } from '../utils';

const example = readFile('days/3-example.txt');
const example2 = readFile('days/3-example-2.txt');
const input = readFile('days/3.txt');

const mulRegex = /mul\((\d+),(\d+)\)/gs;

function getMultSum(d: string) {
	const matches = d.matchAll(mulRegex);
	return [...matches].reduce((sum, match) => sum + Number(match[1]) * Number(match[2]), 0);
}

export function one(f: 'example' | 'input') {
	const data = f === 'example' ? example : input;
	const res = getMultSum(data);
	console.log(res);
}

one('example');
one('input');

console.log();

export function two(f: 'example' | 'input') {
	let data = f === 'example' ? example2 : input;
	const dontRegex = /don't\(\).*?(?:do\(\)|$)/gs;

	const matches = [...data.matchAll(dontRegex)];
	matches.forEach((match) => {
		console.log(match[0], '\n\n');
		data = data.replace(match[0], 'do()');
	});
	console.log(getMultSum(data));
}

two('example');
two('input');
