import ReactionStep from "./ReactionStep";

class Reaction {

    public steps: ReactionStep[]
    public currentStep: ReactionStep | null
    public name: string
    public uuid: string
    public moduleId: string
    public sectionId: string
    public authorId: string
    public published: boolean

    constructor(name: string,
                uuid: string,
                moduleId: string,
                sectionId: string,
                authorId: string,
                published: boolean,
                steps: ReactionStep[],
                currentStep: ReactionStep) {
        this.name = name
        this.uuid = uuid
        this.moduleId = moduleId
        this.sectionId = sectionId
        this.authorId = authorId 
        this.published = published
        this.steps = steps
        this.currentStep = currentStep
    }

    update() {
        if (!this.currentStep)
            throw new Error("Attempted to update current step that was not set")
        this.currentStep.update()
    }

    toJSON() {

        if (!this.currentStep)
            throw new Error("current step not defined")

        const stepsAsPlainObjectArray = []

        for (const step of this.steps) {
            stepsAsPlainObjectArray.push(step.toJSON())
        }

        return {
            steps: stepsAsPlainObjectArray,
            currentStepId: this.currentStep.uuid,
            name: this.name,
            uuid: this.uuid,
            moduleId: this.moduleId,
            sectionId: this.sectionId,
            authorId: this.authorId,
            published: this.published
        }

    }

    replaceWithNewModel(newReaction: Reaction) {
        Object.assign(this, newReaction)
    }

    copy(): Reaction {
        return  new Reaction(
            this.name,
            this.uuid,
            this.moduleId,
            this.sectionId,
            this.authorId,
            this.published,
            this.steps,
            this.currentStep
        )
    }

}

export default Reaction