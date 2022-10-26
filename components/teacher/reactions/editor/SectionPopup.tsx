import { useState } from "react";
import FormSubmitButton from "../../../common/buttons/FormSubmitButton";
import PopupBackground from "../../../common/PopupBackground";

interface IProps {
  popupCloseFunction: () => void;
  sectionAdditionFunction: (string: string) => void;
}

export function SectionPopup(props: IProps) {
  const [sectionName, setSectionName] = useState("");

  function onChange(event: React.FormEvent<HTMLInputElement>) {
    setSectionName(event.currentTarget.value);
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    props.sectionAdditionFunction(sectionName);
    props.popupCloseFunction();
  }

  return (
    <PopupBackground popupCloseFunction={props.popupCloseFunction}>
      <form onSubmit={onSubmit}>
        <div className="shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="flex flex-col gap-6">
              <div className="w-96">
                <label
                  htmlFor="module-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Section name
                </label>
                <input
                  type="text"
                  name="module-name"
                  value={sectionName}
                  placeholder="Type module name here"
                  onChange={onChange}
                  id="module-name"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-100 text-right sm:px-6">
            <FormSubmitButton value={"Create Section"} class={""} />
          </div>
        </div>
      </form>
    </PopupBackground>
  );
}

export default SectionPopup;
