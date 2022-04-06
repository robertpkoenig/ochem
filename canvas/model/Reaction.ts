import ReactionStep from "./ReactionStep";

class Reaction {

    public steps: ReactionStep[]
    public currentStep: ReactionStep | null
    public name: string
    public uuid: string
    public moduleId: string
    public moduleName: string
    public sectionId: string
    public sectionName: string
    public authorId: string
    public visible: boolean
    public prompt: string

    constructor(name: string,
                uuid: string,
                moduleId: string,
                moduleName: string,
                sectionId: string,
                sectionName: string,
                authorId: string,
                visible: boolean,
                steps: ReactionStep[],
                currentStep: ReactionStep,
                prompt: string) {
        this.name = name
        this.uuid = uuid
        this.moduleId = moduleId
        this.moduleName = moduleName
        this.sectionId = sectionId
        this.sectionName = sectionName
        this.authorId = authorId 
        this.visible = visible
        this.steps = steps
        this.currentStep = currentStep
        this.prompt = prompt
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
            moduleName: this.moduleName,
            sectionId: this.sectionId,
            sectionName: this.sectionName,
            authorId: this.authorId,
            published: this.visible,
            prompt: this.prompt,
        }

    }

    replaceWithNewModel(newReaction: Reaction) {
        Object.assign(this, newReaction)
    }

}

export default Reaction