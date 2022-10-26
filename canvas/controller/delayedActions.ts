import { FRAME_RATE } from "../Constants";

interface TemporaryProcess {
  functionCalledEachFrame: () => void;
  functionCalledAtEnd: () => void;
  remainingFramesBeforeActionExecuted: number;
}

const temporaryProcesses: TemporaryProcess[] = [];

function processAllTemporaryProcesses() {
  temporaryProcesses.forEach((process) => {
    if (process.remainingFramesBeforeActionExecuted > 0) {
      process.remainingFramesBeforeActionExecuted--;
      process.functionCalledEachFrame();
    } else {
      process.functionCalledAtEnd();
      removeTemporaryProcessFromList(process);
    }
  });
}

function removeTemporaryProcessFromList(process: TemporaryProcess) {
  const index = temporaryProcesses.indexOf(process);
  if (index > -1) {
    temporaryProcesses.splice(index, 1);
  }
}

export type { TemporaryProcess };
export {
  temporaryProcesses,
  processAllTemporaryProcesses as processAllDelayedActions,
};
