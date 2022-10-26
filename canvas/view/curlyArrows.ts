import { CurlyArrow } from "../model/chemistry/CurlyArrow";
import CurlyArrowViewer from "./CurlyArrowViewer";

// When student draws an arrow, it will go here to be drawn
const curlyArrows: CurlyArrow[] = [];

function addArrowToListOfCurlyArrows(curlyArrow: CurlyArrow) {
  curlyArrows.push(curlyArrow);
}

function removeArrowFromCurlyArrows(curlyArrow: CurlyArrow) {
  const index = curlyArrows.indexOf(curlyArrow);
  if (index > -1) {
    curlyArrows.splice(index, 1);
  }
}

function viewAllCurlyArrows(curlyArrowViewer: CurlyArrowViewer) {
  curlyArrows.forEach((curlyArrow) => {
    curlyArrowViewer.renderCurlyArrow(curlyArrow, 0, false);
  });
}

function clearCurlyArrows() {
  curlyArrows.length = 0;
}

export {
  addArrowToListOfCurlyArrows,
  removeArrowFromCurlyArrows,
  viewAllCurlyArrows,
  clearCurlyArrows,
  curlyArrows,
};
