import {
  ChartBarIcon,
  EyeIcon,
  PaperAirplaneIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import Link from "next/link";
import React, { useState } from "react";
import { MODULES } from "../../../../persistence-model/FirebaseConstants";
import Module from "../../../../persistence-model/Module";
import BlueNavBar from "../../../common/BlueNavBar";
import Button from "../../../common/buttons/Button";
import ModuleRenamePopup from "./ModuleRenamePopup";
import SharePopup from "./SharePopup";

export interface LayoutProps {
  children: React.ReactNode;
  module: Module;
}

// This wraps each page in the application
export default function ModuleEditorLayout(props: LayoutProps) {
  const [renamePopupVis, setRenamePopupVis] = useState(false);
  const [title, setTitle] = useState(props.module?.title);
  const [subtitle, setSubtitle] = useState(props.module?.subtitle);
  const [sharePopupVis, setSharePopupVis] = useState<boolean>(false);

  const db = getFirestore();

  function updateModuleTitleAndSubtitle(title: string, subtitle: string) {
    // Create the section record in the module's nested collection of sections

    const moduleRecordDocLocation = doc(db, MODULES, props.module.uuid);

    updateDoc(moduleRecordDocLocation, {
      title: title,
      subtitle: subtitle,
    });

    setTitle(title);
    setSubtitle(subtitle);
  }

  function toggleRenamePopup() {
    setRenamePopupVis(!renamePopupVis);
  }

  function toggleSharePopup() {
    setSharePopupVis(!sharePopupVis);
  }

  const buttons = (
    <div className="bg-white rounded-lg shadow px-4 py-3 flex flex-row gap-2">
      <Link href={"/teacher/analytics/" + props.module?.uuid}>
        <a>
          <Button
            size={"small"}
            importance={"primary"}
            text={"Analytics"}
            icon={ChartBarIcon}
            onClick={null}
            extraClasses={""}
          />
        </a>
      </Link>

      <Link href={"/student/modules/" + props.module?.uuid}>
        <a>
          <Button
            size={"small"}
            importance={"primary"}
            text={"Preview"}
            icon={EyeIcon}
            onClick={null}
            extraClasses={""}
          />
        </a>
      </Link>

      <Button
        size="small"
        importance="secondary"
        text="Invite Students"
        icon={PaperAirplaneIcon}
        onClick={toggleSharePopup}
        extraClasses=""
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-indigo-600 pb-32">
        <BlueNavBar />

        {/* Title and subtitle */}
        <header className="py-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row items-center">
            <div className="flex-grow">
              <div className="group flex gap-2 items-center justify-start">
                <h1 className="text-3xl font-bold text-white">{title}</h1>
                <PencilIcon
                  className="w-5 h-5 cursor-pointer text-indigo-300
                                             hover:text-indigo-200 invisible group-hover:visible"
                  onClick={toggleRenamePopup}
                />
              </div>
              <h2 className="text-l font-regular text-white opacity-60">
                {subtitle}
              </h2>
            </div>
            {buttons}
          </div>
        </header>
      </div>

      <main className="-mt-32">
        <div className="max-w-5xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            {props.children}
          </div>
        </div>
      </main>

      {/* ModuleRenamePopup */}
      {renamePopupVis ? (
        <ModuleRenamePopup
          module={props.module}
          popupCloseFunction={toggleRenamePopup}
          updateModuleFunction={updateModuleTitleAndSubtitle}
        />
      ) : null}

      {/* Share popup */}
      {sharePopupVis ? (
        <SharePopup
          popupCloseFunction={toggleSharePopup}
          moduleId={props.module.uuid}
        />
      ) : null}
    </div>
  );
}
