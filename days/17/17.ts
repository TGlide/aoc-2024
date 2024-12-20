import { getRelativeDirs, type Direction } from "../../utils/direction";
import { readCurrentDayInputs } from "../../utils/file";
import { Matrix } from "../../utils/matrix";
import { type Position } from "../../utils/position";
import { keys, type ValueOf } from "../../utils/types";

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

function solve(data: string) {
  const [r, p] = data.split("\n\n");
  let [ra, rb, rc] = r.split("\n").map((line) => Number(/\d+/.exec(line)![0]));
  log.info(ra, rb, rc);

  const program = p.split(":")[1].split(",").map(Number);
  log.info(program);
  log.info();

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
  const outputs: Array<unknown> = [];
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
        rb = comboOperand % 8;
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
        outputs.push(comboOperand % 8);
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

  console.log(outputs.join(","));
}

const run_input = 1;

solve(inputs.example);
if (run_input) {
  solve(inputs.input);
}
