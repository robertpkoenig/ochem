import Link from "next/link";
import React, { useState } from "react";
import ModuleListing from "../../../../persistence-model/ModuleListing";
import PopupBackground from "../../../common/PopupBackground";
import DeleteReactionPopup from "./DeleteReactionPopup";

import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { PencilIcon } from "@heroicons/react/24/outline";
import Button from "../../../common/buttons/Button";
import RoundButton from "../../../common/buttons/RoundButton";
import { MODULE_LISTINGS } from "../../../../persistence-model/FirebaseConstants";

interface IProps {
  moduleListing: ModuleListing;
  moduleListings: ModuleListing[];
  updateModuleListings: (moduleListings: ModuleListing[]) => void;
}

function ModuleCard(props: IProps) {
  const [deleteModulePopupVisible, setModulePopupVisible] = useState(false);

  function deleteModuleAndHidePopup() {
    deleteModule();
    toggleDeleteModulePopup();
  }

  function deleteModule() {
    const db = getFirestore();

    // Get copy of list of modules
    let moduleListCopy: ModuleListing[] = Object.assign(props.moduleListings);

    // Filter out the module being deleted
    moduleListCopy = moduleListCopy.filter((module) => {
      return module.uuid != props.moduleListing.uuid;
    });

    // Update the state on the parent list of modules
    props.updateModuleListings(moduleListCopy);

    // Remove module listing from the "module_listings" collection
    deleteDoc(doc(db, MODULE_LISTINGS, props.moduleListing.uuid));

    // TODO Remove the module from the modules collection
    deleteDoc(doc(db, "modules", props.moduleListing.uuid));
  }

  function toggleDeleteModulePopup() {
    setModulePopupVisible(!deleteModulePopupVisible);
  }

  return (
    <>
      <div className="flex flex-row justify-between bg-gray-100 rounded-md">
        <div className="flex flex-col justify-center">
          {props.moduleListing.name}
        </div>

        <div className="flex flex-row items-center gap-4">
          <RoundButton icon={XMarkIcon} onClick={toggleDeleteModulePopup} />

          <Link href={"/teacher/modules/" + props.moduleListing.uuid}>
            <a>
              <Button
                size={"small"}
                importance={"primary"}
                text={"Edit"}
                icon={PencilIcon}
                extraClasses={""}
                onClick={null}
              />
            </a>
          </Link>
        </div>
      </div>

      {deleteModulePopupVisible ? (
        <PopupBackground popupCloseFunction={toggleDeleteModulePopup}>
          <DeleteReactionPopup
            thing={props.moduleListing}
            thingType="module"
            deletionFunction={deleteModuleAndHidePopup}
            togglePopupFunction={toggleDeleteModulePopup}
          />
        </PopupBackground>
      ) : (
        ""
      )}
    </>
  );
}

export default ModuleCard;
