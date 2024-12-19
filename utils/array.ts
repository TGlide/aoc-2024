export function first<T>(arr: T[]) {
  return arr[0];
}

export function last<T>(arr: T[]) {
  return arr[arr.length - 1];
}

export function middle<T>(arr: T[]) {
  return arr[Math.floor(arr.length / 2)];
}

export function swap<T>(a: number, b: number, arr: T[]): T[] {
  const newArr = [...arr];
  newArr[a] = arr[b];
  newArr[b] = arr[a];
  return newArr;
}

export function remove<T>(arr: T[], idx: number): T[] {
  return arr.filter((_, i) => i !== idx);
}

export function sum(arr: number[]): number {
  return arr.reduce((acc, curr) => acc + curr, 0);
}

export function getIdxAt(idx: number, length: number) {
  if (idx >= 0) return idx % length;
  return length + (idx % length);
}
