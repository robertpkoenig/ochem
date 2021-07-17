import ReactionStep from "./ReactionStep";

class Reaction {

    public steps: ReactionStep[]
    public currentStep: ReactionStep
    public name: string
    private id: string

    constructor() {
        this.steps = []
        this.name = "New Reaction"
    }

    getId() {
        return this.id
    }

    update() {
        this.currentStep.update()
    }

}

export default Reaction