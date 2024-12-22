import { readCurrentDayInputs } from "../../utils/file";
import { dequal } from "dequal";
import { remainderMod } from "../../utils/math";

const inputs = readCurrentDayInputs();

type LogLevel = "info" | "verbose" | "none";

const LOG_LEVEL = "none" as LogLevel;

const log = {
  info: (...args: unknown[]) => {
    if (LOG_LEVEL === "none") return;
    console.log(...args);
  },
  verbose: (...args: unknown[]) => {
    if (LOG_LEVEL !== "verbose") return;
    console.log(...args);
  },
};

type Registers = {
  a: number;
  b: number;
  c: number;
};

type Program = number[];

type ShouldHalt = boolean;
type OnReceiveOutput = (outputs: number[]) => ShouldHalt;

function runProgram(
  registers: Registers,
  program: Program,
  onReceiveOutput?: OnReceiveOutput,
): number[] {
  let { a: ra, b: rb, c: rc } = registers;

  function getComboOperand(operand: number) {
    switch (operand) {
      case 4:
        return ra;
      case 5:
        return rb;
      case 6:
        return rc;
      case 7:
        throw new Error("Invalid operand!");
      default:
        return operand;
    }
  }

  let ins_pointer = 0;
  const outputs: Array<number> = [];
  while (ins_pointer < program.length) {
    const [opcode, operand] = [program[ins_pointer], program[ins_pointer + 1]];
    const comboOperand = getComboOperand(operand);

    let shouldJump = true;
    switch (opcode) {
      case 0: {
        log.info("0 adv (division)");
        const prev = ra;
        ra = Math.floor(ra / 2 ** comboOperand);
        log.info(`Register A changed from ${prev} to ${ra}`);
        break;
      }
      case 1: {
        log.info("1 bxl (bitwise XOR)");
        const prev = rb;
        rb = rb ^ operand;
        log.info(`Register B changed from ${prev} to ${rb}`);
        break;
      }
      case 2: {
        log.info("2 bst (modulo)");
        const prev = rb;
        rb = remainderMod(comboOperand, 8);
        log.info(`Register B changed from ${prev} to ${rb}`);
        break;
      }
      case 3: {
        log.info("3 jnz (conditional jump)");
        if (ra === 0) log.info("Skipped since RA is zero");
        else {
          ins_pointer = operand;
          shouldJump = false;
        }
        break;
      }
      case 4: {
        log.info("4 bxc (bitwise XOR again)");
        const prev = rb;
        rb = rb ^ rc;
        log.info(`Register B changed from ${prev} to ${rb}`);
        break;
      }
      case 5: {
        log.info("5 out (output)");
        outputs.push(remainderMod(comboOperand, 8));
        const shouldHalt = onReceiveOutput?.(outputs);
        if (shouldHalt) return outputs;
        break;
      }
      case 6: {
        log.info("6 bdv (division)");
        const prev = rb;
        rb = Math.floor(ra / 2 ** comboOperand);
        log.info(`Register B changed from ${prev} to ${rb}`);
        break;
      }
      case 7: {
        log.info("7 cdv (division)");
        const prev = rc;
        rc = Math.floor(ra / 2 ** comboOperand);
        log.info(`Register C changed from ${prev} to ${rc}`);
        break;
      }
    }
    log.info();

    if (shouldJump) {
      ins_pointer += 2;
    }
  }

  return outputs;
}

function solve(data: string) {
  const [r, p] = data.split("\n\n");
  let [ra, rb, rc] = r.split("\n").map((line) => Number(/\d+/.exec(line)![0]));
  log.info(ra, rb, rc);

  const program = p.split(":")[1].split(",").map(Number);
  log.info(program);
  log.info();

  const one = runProgram({ a: ra, b: rb, c: rc }, program).join(",");
  console.log(one);

  let two = 0;
  let res: number[] = [];
  while (!dequal(res, program)) {
    // console.log(two);
    two++;
    res = runProgram({ a: two, b: rb, c: rc }, program, (output) => {
      return !dequal(output, program.slice(0, output.length));
    });
    if (res.length > 7) {
      console.log(two, res, program);
    }
  }
  console.log(two, runProgram({ a: two, b: rb, c: rc }, program));
}

const run_input = 1;

solve(inputs.example2);
if (run_input) {
  solve(inputs.input);
}
