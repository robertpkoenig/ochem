import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { FormEvent, SyntheticEvent, TextareaHTMLAttributes, useState } from "react";
import { ITeacherState } from "../../../../pages/teacher/reactions/[reactionId]";
import { MODULES, NAME, REACTIONS, REACTION_LISTINGS, SECTIONS } from "../../../../persistence-model/FirebaseConstants";
import FormSubmitButton from "../../../common/buttons/FormSubmitButton";
import PopupBackground from "../../../common/PopupBackground";

interface IProps {
    state: ITeacherState
    setState: (state: ITeacherState) => void
    toggleReactionRenamePopup: () => void
}

export default function ReactionEditPopup(props: IProps) {

    const db = getFirestore()

    const [reactionName, setReactionName] = useState<string>(props.state.reaction.name)
    const [description, setDescription] = useState<string>(props.state.reaction.description)
    const [hint, setHint] = useState<string>(props.state.reaction.hint)

    function onReactionNameChange(event: FormEvent<HTMLInputElement>) {
        setReactionName(event.currentTarget.value)
    }

    function onDescriptionChange(event: FormEvent<HTMLTextAreaElement>) {
        setDescription(event.currentTarget.value)
    }

    function onHintChange(event: FormEvent<HTMLTextAreaElement>) {
        setHint(event.currentTarget.value)
    }

    function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        editReaction(reactionName)
        props.toggleReactionRenamePopup()
    }

    function stopPropagation(event: SyntheticEvent) {
        event.stopPropagation()
    }

    function editReaction(newName: string) {
        props.state.reaction.name = newName
        props.state.reaction.description = description
        props.state.reaction.hint = hint
        // forceUpdate()
        const reactionRef = doc(db, REACTIONS, props.state.reaction.uuid)
        updateDoc(reactionRef, {
            name: newName,
            description: description,
            hint: hint
        })

        // Module doc ref to access the nested reaction listing object
        const moduleDocRef = doc(db, MODULES, props.state.reaction.moduleId)

        // Update the reaction listing document in firestore
        const reactionRefWithinSection =
            SECTIONS + "."+ props.state.reaction.sectionId + "."+
            REACTION_LISTINGS + "." + props.state.reaction.uuid + 
            "." + NAME

        const sectionVisibilityUpdateObject: any = {}
        sectionVisibilityUpdateObject[reactionRefWithinSection] = newName
        updateDoc(moduleDocRef, sectionVisibilityUpdateObject)
    }

    return (
        
        <PopupBackground
            popupCloseFunction={props.toggleReactionRenamePopup} 
        >
            <form onSubmit={onSubmit}>
                <div
                    onClick={stopPropagation}
                    className="shadow overflow-hidden sm:rounded-md"
                >
                  <div className="px-4 py-5 bg-white sm:p-6">
                      <div className="flex flex-col gap-6 w-96">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Reaction name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={reactionName}
                              placeholder="Type reaction name here"
                              onChange={onReactionNameChange}
                              id="module-name"
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                              rows={2}
                              name="description"
                              id="description"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              onChange={onDescriptionChange}
                              value={description}
                            />
                          </div>
                          <div>
                            <label htmlFor="hint" className="block text-sm font-medium text-gray-700">
                                Hint
                            </label>
                            <textarea
                              rows={2}
                              name="hint"
                              id="hint"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              onChange={onHintChange}
                              value={hint}
                            />
                          </div>
                      </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-100 text-right sm:px-6">
                      <FormSubmitButton value={"Save"} class={""} />
                  </div>
                </div>
            </form>
        </PopupBackground>

    )

}
