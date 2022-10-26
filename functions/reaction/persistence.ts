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
