import TeacherController from "../../../../canvas/controller/teacher/TeacherController";
import { Elements } from "../../../../canvas/model/chemistry/atoms/elements";

interface IProps {
  teacherController: TeacherController;
}

// List of atomic elements on the right panel of the screen
function AtomicElements(props: IProps) {
  const atomicElements = Object.values(Elements).map((element) => {
    return (
      // Logic around the dummy element should be deleted
      element.name != "dummy" && (
        // This is the background to the atom which acts as the empty state
        // when the element is dragged onto the canvas
        <div
          className="rounded-full w-40 h-40 bg-gray-200"
          key={element.abbreviation}
        >
          <button
            id={element.name}
            onMouseDown={() =>
              props.teacherController?.panelController.selectElement(
                element.name
              )
            }
            onMouseUp={() =>
              props.teacherController?.panelController.dropElement()
            }
            style={{ backgroundColor: element.color, cursor: "grab" }}
            className="rounded-full w-40 h-40 text-white font-semibold text-md flex items-center justify-center z-10"
          >
            {element.abbreviation}
          </button>
        </div>
      )
    );
  });

  return (
    <div className="bg-white p-5 rounded-lg shadow flex flex-col gap-2 h-full">
      {atomicElements}
    </div>
  );
}

export default AtomicElements;
