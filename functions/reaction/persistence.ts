// This function toggles whether or not a reaction is visible to students

import { doc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import TeacherController from "../../canvas/controller/teacher/TeacherController";
import Reaction from "../../canvas/model/Reaction";
import {
  MODULES,
  REACTIONS,
  REACTION_LISTINGS,
  SECTIONS,
  VISIBLE,
} from "../../persistence-model/FirebaseConstants";

/**
 * @description This function updates the visibility of a reaction in an app by:
 * 
 * 1/ Creating a copy of the reaction object
 * 2/ Adding an undo point to the teacher controller's undo manager
 * 3/ Updating the reaction's `visible` property to the opposite of its previous value
 * 4/ Updating the reaction's data in Firestore using `setDoc()` and `updateDoc()` methods
 * 5/ Update the visibility of the reaction within a section by setting a nested
 * document's `VISIBLE` property.
 * 
 * @param { TeacherController } teacherController - The `teacherController` input
 * parameter in the given function is a reference to an instance of the `TeacherController`
 * class, which is likely a part of a React application. This parameter is used to
 * access the `undoManager` property of the `teacherController`, which is needed for
 * adding an undo point in the `setReaction()` line. Additionally, the `teacherController`
 * parameter is used to update the app state by calling the `setReaction()` function
 * with the modified reaction copy.
 * 
 * @param { Reaction } reaction - The `reaction` input parameter in the `toggleVisibility()`
 * function represents the Reaction object that the user wants to toggle its visibility.
 * It is passed as an argument to the function along with other parameters such as
 * the `teacherController` and the `setReaction` action creator. The `reaction`
 * parameter is used to update the visibility of the specified Reaction instance in
 * the app state and in Firestore.
 * 
 * @param { Dispatch<SetStateAction<Reaction>> } setReaction - The `setReaction` input
 * parameter in the `toggleVisibility()` function updates the state of the Reaction
 * object being processed by modifying the `reaction` variable within the function.
 * It does not persist any changes made to the Reaction object outside of the function.
 * Therefore, it is responsible for updating the local copy of the Reaction object
 * within the `tacherController.undoManager.addUndoPoint()` context, but not in the
 * global state of the application or Firestore.
 */
function toggleVisibility(
  teacherController: TeacherController,
  reaction: Reaction,
  setReaction: Dispatch<SetStateAction<Reaction>>
) {
  const reactionCopy = reaction.copy();
  teacherController.undoManager.addUndoPoint();
  reactionCopy.visible = !reaction.visible;

  // update app state
  setReaction(reactionCopy);

  // update all persistence records
  const db = getFirestore();
  setDoc(doc(db, REACTIONS, reactionCopy.uuid), reactionCopy.toJSON());

  // Module doc ref to access the nested reaction listing object
  const moduleDocRef = doc(db, MODULES, reactionCopy.moduleId);

  // To update the reaction listing document in firestore,
  // the string detailing the document's nested location is
  // constructed here
  const reactionRefWithinSection =
    SECTIONS +
    "." +
    reactionCopy.sectionId +
    "." +
    REACTION_LISTINGS +
    "." +
    reactionCopy.uuid +
    "." +
    VISIBLE;

  const sectionVisibilityUpdateObject: any = {};
  sectionVisibilityUpdateObject[reactionRefWithinSection] =
    reactionCopy.visible;
  updateDoc(moduleDocRef, sectionVisibilityUpdateObject);
}
