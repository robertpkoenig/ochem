import { FRAME_RATE } from "../Constants"

interface DelayedAction {
  action: () => void
  remainingFramesBeforeActionExecuted: number
}

const delayedActions: DelayedAction[] = []

function processAllDelayedActions() {
  for (let i = 0; i < delayedActions.length; i++) {
    delayedActions[i].remainingFramesBeforeActionExecuted--
    if (delayedActions[i].remainingFramesBeforeActionExecuted <= 0) {
      delayedActions[i].action()
      delayedActions.splice(i, 1)
    }
  }
}

function addDelayedAction(action: () => void, millisecondsDelay: number) {
  const millisecondsPerFrame = 1000 / FRAME_RATE
  const delayedAction = {
    action: action,
    remainingFramesBeforeActionExecuted: Math.floor(millisecondsDelay / millisecondsPerFrame)
  }
  delayedActions.push(delayedAction)
}

export { processAllDelayedActions, addDelayedAction }