import { readCurrentDayInputs } from "../../utils/file";
import { remainderMod, remainderModBigInt } from "../../utils/math";
import { memoize } from "../../utils/memo";

const inputs = readCurrentDayInputs();

function mix(n1: bigint, n2: bigint): bigint {
  return n1 ^ n2;
}

function prune(n: bigint): bigint {
  return remainderModBigInt(n, BigInt(16777216));
}

const getNextSecret = memoize(function (secret: bigint): bigint {
  let res = secret;
  res = mix(res * BigInt(64), res);
  res = prune(res);
  res = mix(res / BigInt(32), res);
  res = prune(res);
  res = mix(res * BigInt(2048), res);
  res = prune(res);
  return res;
});

const getNthSecret = memoize(function (secret: bigint, n: number): bigint {
  if (n === 0) return secret;
  return getNthSecret(getNextSecret(secret), n - 1);
});

function solve(data: string) {
  const numbers = data.split("\n").map(BigInt);

  let res = BigInt(0);
  numbers.forEach((n) => {
    const newSecret = getNthSecret(n, 2000);
    // console.log(n, newSecret);
    res += newSecret;
  });
  console.log(res);
}

solve(inputs.example);
solve(inputs.input);
console.log("END\n");
