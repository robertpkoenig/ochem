import { PencilIcon } from "@heroicons/react/24/solid";
import { ITeacherState } from "../../../../pages/teacher/reactions/[reactionId]";

interface IProps {
  state: ITeacherState;
  togglePrompt: () => void;
  setPromptText: (text: string) => void;
}

const Prompt = (props: IProps) => {
  function togglePromptPopup() {
    props.togglePrompt();
  }

  function setPromptText(text: string) {
    props.setPromptText(text);
  }

  return (
    <div className="flex flex-row items-baseline justify-between">
      <div className="flex flox-row items-center gap-1">
        <div className="text-indigo-100 text-md">
          {props.state.reaction?.prompt}
        </div>
        <PencilIcon
          className="text-indigo-400 w-4 h-4 hover:text-indigo-100 cursor-pointer"
          onMouseDown={togglePromptPopup}
        />
      </div>
      <div
        onMouseDown={() => setPromptText(null)}
        className="text-indigo-300 text-sm cursor-pointer hover:text-indigo-100"
      >
        Remove prompt
      </div>
    </div>
  );
};

export default Prompt;
