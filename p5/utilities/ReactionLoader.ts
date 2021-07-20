import Reaction from "../model/Reaction"
import ReactionStep from "../model/ReactionStep"
import ReactionStepLoader from "./ReactionStepLoader"

class ReactionLoader {

    public static loadReactionFromJSON(reactionJSON: string): Reaction {

        const reactionRawObject = JSON.parse(reactionJSON)

        const restoredSteps: ReactionStep[] = []

        for (const rawStepObject of reactionRawObject["steps"]) {
            // Convert back to string to be compatible with the 
            // previous logic, but change this to be an object
            const rawStepJSON = JSON.stringify(rawStepObject)
            const restoredStepClassInstance = 
                ReactionStepLoader.loadReactionStepFromJSON(rawStepJSON)
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
        const sectionId = reactionRawObject["sectionId"]
        const authorId = reactionRawObject["authorId"]
        const published = reactionRawObject["published"]


        const restoredReaction = new Reaction(
            name,
            uuid,
            moduleId,
            sectionId,
            authorId,
            published
        )
        
        restoredReaction.steps = restoredSteps
        restoredReaction.currentStep = currentStep


        return restoredReaction

    }

}

export default ReactionLoader