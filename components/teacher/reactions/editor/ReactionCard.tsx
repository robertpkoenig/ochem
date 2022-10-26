import Link from "next/link";
import { useState } from "react";
import Module from "../../../../persistence-model/Module";
import ReactionListing from "../../../../persistence-model/ReactionListing";
import Section from "../../../../persistence-model/SectionListing";
import PopupBackground from "../../../common/PopupBackground";
import DeleteReactionPopup from "./DeleteReactionPopup";
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import Button from "../../../common/buttons/Button";
import RoundButton from "../../../common/buttons/RoundButton";
import {
  ArrowDownOnSquareStackIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  MODULES,
  REACTIONS,
  REACTION_LISTINGS,
  SECTIONS,
} from "../../../../persistence-model/FirebaseConstants";
import { v4 as uuid } from "uuid";
import ReactionSaver from "../../../../canvas/controller/teacher/helper/ReactionSaver";
import ReactionLoader from "../../../../canvas/utilities/ReactionLoader";

export interface IReactionCardProps {
  reactionListing: ReactionListing;
  section: Section;
  module: Module;
  updateModule: (moduleCopy: Module) => void;
  userId: string;
}

export default function ReactionCard(props: IReactionCardProps) {
  const [deleteReactionPopupVisible, setDeleteReactionPopupVisible] =
    useState(false);

  const db = getFirestore();

  function updateSectionsInFirebase() {
    // update module in firebase
    const moduleDocRef = doc(db, "modules", props.module.uuid);
    updateDoc(moduleDocRef, {
      sections: props.module.sections,
    });
  }

  function decrementReactionOrder() {
    // Create copy of the module
    const moduleCopy: Module = Object.assign(props.module);

    let reactionToDecrementOrder = props.reactionListing;
    let reactionToIncrementOrder: ReactionListing | null = null;

    // Get the reaction copy within the section
    const orderOfReactionToIncrement = reactionToDecrementOrder.order - 1;
    for (const reaction of Object.values(props.section.reactionListings)) {
      if (reaction.order === orderOfReactionToIncrement) {
        reactionToIncrementOrder = reaction;
      }
    }

    if (reactionToIncrementOrder != null) {
      reactionToDecrementOrder.order--;
      reactionToIncrementOrder.order++;

      props.updateModule(moduleCopy);
      updateSectionsInFirebase();
    }
  }

  function incrementReactionOrder() {
    // Create copy of the module
    const moduleCopy: Module = Object.assign(props.module);

    let reactionToIncrementOrder = props.reactionListing;
    let reactionToDecrementOrder: ReactionListing | null = null;

    // Get the reaction copy within the section
    const orderOfReactionToDecrement = reactionToIncrementOrder.order + 1;
    for (const reaction of Object.values(props.section.reactionListings)) {
      if (reaction.order === orderOfReactionToDecrement) {
        reactionToDecrementOrder = reaction;
      }
    }

    if (reactionToDecrementOrder != null) {
      reactionToDecrementOrder.order--;
      reactionToIncrementOrder.order++;

      props.updateModule(moduleCopy);
      updateSectionsInFirebase();
    }
  }

  function toggleReactionDeletionPopup() {
    setDeleteReactionPopupVisible(!deleteReactionPopupVisible);
  }

  function deleteReaction() {
    // Create copy of the module
    const moduleCopy: Module = Object.assign(props.module);

    // delete the current reaction from the section
    delete moduleCopy.sections[props.section.uuid].reactionListings[
      props.reactionListing.uuid
    ];

    // Decrement the order of each reaction after this one
    for (const reaction of Object.values(props.section.reactionListings)) {
      if (reaction.order > props.reactionListing.order) {
        reaction.order--;
      }
    }

    // Replace the upstream module state with the module
    // without this reaction in this section
    props.updateModule(moduleCopy);

    // Delete ReactionListing in firebase
    const moduleDocRef = doc(db, "modules", props.module.uuid);

    const sectionUpdateObject: any = {};
    const reactionListingsRefString =
      SECTIONS + "." + props.section.uuid + "." + REACTION_LISTINGS;
    sectionUpdateObject[reactionListingsRefString] =
      props.section.reactionListings;

    updateDoc(moduleDocRef, sectionUpdateObject);

    // Delete core Reaction document in firebase
    const coreReactionRef = doc(db, REACTIONS, props.reactionListing.uuid);
    deleteDoc(coreReactionRef);
  }

  async function duplicateReaction() {
    // Create copy of the module
    const moduleCopy: Module = Object.assign(props.module);

    // Create a new uuid for the reaction
    const newReactionUid = uuid();

    const numReactionsInThisSection = Object.keys(
      props.section.reactionListings
    ).length;

    // Create copy of the reaction
    const newReactionListing: ReactionListing = {
      name: props.reactionListing.name + " (copy)",
      order: numReactionsInThisSection,
      uuid: newReactionUid,
      visible: false,
      creationDate: new Date().toISOString(),
      authorId: props.userId,
    };

    // Add the new reaction to the section
    moduleCopy.sections[props.section.uuid].reactionListings[newReactionUid] =
      newReactionListing;

    // Replace the upstream module state with the module
    // with this reaction in this section
    props.updateModule(moduleCopy);

    // Update the module in firebase
    const moduleDocRef = doc(db, MODULES, props.module.uuid);

    const sectionUpdateObject: any = {};
    const reactionListingsRefString =
      SECTIONS + "." + props.section.uuid + "." + REACTION_LISTINGS;
    sectionUpdateObject[reactionListingsRefString] =
      props.section.reactionListings;

    updateDoc(moduleDocRef, sectionUpdateObject);

    // Duplicate the core reaction object in firebase
    const reactionDoc = await getDoc(
      doc(db, REACTIONS, props.reactionListing.uuid)
    );
    const coreReaction = ReactionLoader.loadReactionFromObject(
      reactionDoc.data()
    );

    const newReaction = coreReaction;
    newReaction.uuid = newReactionUid;
    newReaction.name = newReaction.name + " (copy)";

    // add the new reaction to firebase
    ReactionSaver.saveReaction(newReaction);
  }

  const publishedIndicator = (
    <div className="flex flex-row gap-1 items-center group">
      <div className="invisible text-xs font-light text-gray-500 group-hover:visible">
        visible to students
      </div>
      <div onClick={null} className="bg-green-500 rounded-full w-2 h-2"></div>
    </div>
  );

  const notPublishedIndicator = (
    <div className="flex flex-row gap-1 items-center group">
      <div className="invisible text-xs font-light text-gray-500 group-hover:visible">
        not visible to students
      </div>
      <div onClick={null} className="bg-yellow-500 rounded-full w-2 h-2"></div>
    </div>
  );

  return (
    <div className="flex flex-row justify-between ">
      <div className="flex flex-row gap-4 items-center justify-center text-sm">
        {props.reactionListing.name}
      </div>

      <div className="flex flex-row justify-center content-center items-center gap-4">
        <div>
          {/* Indicator for whether reaction is visible */}
          {props.reactionListing.visible
            ? publishedIndicator
            : notPublishedIndicator}
        </div>

        <div className="flex flex-row content-center justify-center gap-1">
          {/* Up button */}
          <RoundButton
            icon={ChevronDownIcon}
            onClick={incrementReactionOrder}
          />

          {/* Down button */}
          <RoundButton icon={ChevronUpIcon} onClick={decrementReactionOrder} />

          {/* Delete button */}
          <RoundButton icon={XMarkIcon} onClick={toggleReactionDeletionPopup} />

          {/* Delete button */}
          <RoundButton
            icon={ArrowDownOnSquareStackIcon}
            onClick={duplicateReaction}
          />
        </div>

        <div className="flex flex-row gap-2">
          <Link href={"/teacher/reactions/" + props.reactionListing.uuid}>
            <a>
              <Button
                size={"small"}
                importance={"primary"}
                text={"Edit"}
                icon={PencilIcon}
                onClick={null}
                extraClasses={""}
              />
            </a>
          </Link>
        </div>
      </div>

      {/* Delete popup */}
      {deleteReactionPopupVisible && (
        <PopupBackground popupCloseFunction={toggleReactionDeletionPopup}>
          <DeleteReactionPopup
            thing={props.reactionListing}
            thingType="reaction"
            deletionFunction={deleteReaction}
            togglePopupFunction={toggleReactionDeletionPopup}
          />
        </PopupBackground>
      )}
    </div>
  );
}
