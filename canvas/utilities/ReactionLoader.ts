import Reaction from "../model/Reaction"
import ReactionStep from "../model/ReactionStep"
import ReactionStepLoader from "./ReactionStepLoader"

/** 
 * De-serializes a reaction from JSON.
 * This is complicated because molecules are a graph with circular references.
 */
class ReactionLoader {

    public static loadReactionFromJSON(reactionJSON: string): Reaction {
        const reactionRawObject = JSON.parse(reactionJSON)
        return this.loadReactionFromObject(reactionRawObject)
    }

    public static loadReactionFromObject(reactionRawObject: any): Reaction {

        const restoredSteps: ReactionStep[] = []

        for (const rawStepObject of reactionRawObject["steps"]) {
            const restoredStepClassInstance = 
                ReactionStepLoader.loadReactionStepFromPlainObject(rawStepObject)
            restoredSteps.push(restoredStepClassInstance)
        }

        restoredSteps.sort((a, b) => {
            return a.order - b.order
        })

        let currentStep: ReactionStep | null = null
        const currentStepId: string | null = 
            reactionRawObject["currentStepId"]

        if (!currentStepId)
            throw new Error("current step was undefined in the reaction") 

        for (const restoredStep of restoredSteps) {
            if (restoredStep.uuid === currentStepId) {
                currentStep = restoredStep
            }
        }

        if (!currentStep)
            throw new Error("Could not find the current step")

        const name = reactionRawObject["name"]
        const uuid = reactionRawObject["uuid"]
        const moduleId = reactionRawObject["moduleId"]
        const moduleName = reactionRawObject["moduleName"]
        const sectionId = reactionRawObject["sectionId"]
        const sectionName = reactionRawObject["sectionName"]
        const authorId = reactionRawObject["authorId"]
        const published = reactionRawObject["published"]
        const prompt = reactionRawObject["prompt"]
        const zoom = reactionRawObject["zoom"] || 1


        const restoredReaction = new Reaction(
            name,
            uuid,
            moduleId,
            moduleName,
            sectionId,
            sectionName,
            authorId,
            published,
            restoredSteps,
            currentStep,
            prompt,
            zoom
        )
        
        restoredReaction.steps = restoredSteps
        restoredReaction.currentStep = currentStep

        return restoredReaction

    }

}

export default ReactionLoader