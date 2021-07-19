import ReactionStep from "./ReactionStep";

class Reaction {

    public steps: ReactionStep[]
    public currentStep: ReactionStep | null
    public name: string
    public uuid: string

    constructor() {
        this.steps = []
        this.currentStep = null
        this.name = ""
        this.uuid = ""
    }

    update() {
        if (!this.currentStep)
            throw new Error("Attempted to update current step that was not set")
        this.currentStep.update()
    }

    toJSON() {

        if (!this.currentStep)
            throw new Error("current step not defined")

        return {
            steps: this.steps,
            currentStepId: this.currentStep.uuid,
            name: this.name,
            uuid: this.uuid
        }

    }

    replaceWithNewModel(newReaction: Reaction) {
        Object.assign(this, newReaction)
    }

}

export default Reaction