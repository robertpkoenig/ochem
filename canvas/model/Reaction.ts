import { Atom } from "./chemistry/atoms/Atom";
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
    public zoom: number

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
                prompt: string,
                zoom: number = 1) {
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
        this.zoom = zoom
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
            zoom: this.zoom
        }

    }

    replaceWithNewModel(newReaction: Reaction) {
        Object.assign(this, newReaction)
    }

    copy() {
        return new Reaction(
            this.name,
            this.uuid,
            this.moduleId,
            this.moduleName,
            this.sectionId,
            this.sectionName,
            this.authorId,
            this.visible,
            this.steps,
            this.currentStep,
            this.prompt,
            this.zoom
        )
    }

}

export default Reaction