import {
  ChartBarIcon,
  FolderIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import classNames from "../../functions/helper/classNames";

const features = [
  {
    index: 1,
    name: "Intuitive Editor",
    icon: PencilIcon,
    text: `Drag and drop atoms, create bonds, and specify curly arrows. Create a prompt for the reaction.
               Ochem then generates the student interaction, with feedback for each arrow they draw.`,
    img: "/assets/screenshots/editor.png",
    imgAltText: "Editing screen illustrating feature",
  },
  {
    index: 2,
    name: "Exercise collections",
    icon: FolderIcon,
    text: `Group mechanisms into sections. Control which sections and reactions are visible to students.
               Students can keep track of their progress.`,
    img: "/assets/screenshots/organize.png",
    imgAltText: "Screenshot of excercise collections",
  },
  {
    index: 3,
    name: "Engagement Analytics",
    icon: ChartBarIcon,
    text: `You don't want to spend time creating study aids that students never use. With Ochem, you can
               see how many students are accessing content.`,
    img: "/assets/screenshots/analytics.png",
    imgAltText: "Editing screen illustrating feature",
  },
];

function Features() {
  return (
    <div
      id="features"
      className="relative bg-white p-24 lg:p-36 flex flex-col gap-24 lg:gap-24 overflow-hidden"
    >
      {features.map((feature) => {
        const oddIndex = feature.index % 2 == 0;

        return (
          <div className="relative lg:mb-0">
            <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
              <div
                className={classNames(
                  "px-4 max-w-xl mx-auto sm:px-6 lg:py-36 lg:max-w-none lg:mx-0 lg:px-0",
                  oddIndex && "lg:col-start-2"
                )}
              >
                <div>
                  <div>
                    <span className="h-12 w-12 rounded-md flex items-center justify-center bg-indigo-600">
                      {React.createElement(feature.icon, {
                        className: "h-6 w-6 text-white",
                      })}
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                      {feature.name}
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">{feature.text}</p>
                  </div>
                </div>
              </div>

              <div
                className={classNames(
                  "mt-12 sm:mt-16 lg:mt-0",
                  oddIndex && "lg:col-start-1"
                )}
              >
                <div
                  className={classNames(
                    "lg:px-0 lg:m-0 lg:relative lg:h-full",
                    oddIndex
                      ? "lg:pr-4 lg:-ml-48 lg:pl-6 lg:-mr-16"
                      : "lg:pl-4 lg:-mr-48 lg:pr-6 lg:-ml-16"
                  )}
                >
                  <img
                    className={classNames(
                      "mx-auto max-w-md md:w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:h-full lg:w-auto lg:max-w-none",
                      oddIndex ? "lg:right-0 " : "lg:left-0"
                    )}
                    src={feature.img}
                    alt={feature.imgAltText}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Features;
