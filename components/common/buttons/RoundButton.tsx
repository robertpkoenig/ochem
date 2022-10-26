import { createElement } from "react";

interface IProps {
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  onClick: () => void;
}

function RoundButton(props: IProps) {
  return (
    <button
      onClick={props.onClick}
      className="flex flex-col items-center content-center justify-center bg-gray-200 text-gray-500 rounded-full w-6 h-6 hover:bg-gray-300 hover:text-gray-700"
    >
      {createElement(props.icon, { className: "w-3 h-3" })}
    </button>
  );
}

export default RoundButton;
