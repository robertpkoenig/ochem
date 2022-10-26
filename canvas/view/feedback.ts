import p5 from "p5";
import { CurlyArrow } from "../model/chemistry/CurlyArrow";
import { checkImage, xImage } from "./images";

interface Feedback {
  show: () => void;
}

class CorrectArrowFeedback implements Feedback {
  curlyArrow: CurlyArrow;
  p5: p5;

  constructor(curlyArrow: CurlyArrow, p5: p5) {
    this.curlyArrow = curlyArrow;
    this.p5 = p5;
  }

  show() {
    let x = this.p5.bezierPoint(
      this.curlyArrow.startVector.x,
      this.curlyArrow.anchorOne.x,
      this.curlyArrow.anchorTwo.x,
      this.curlyArrow.endVector.x,
      0.5
    );

    let y = this.p5.bezierPoint(
      this.curlyArrow.startVector.y,
      this.curlyArrow.anchorOne.y,
      this.curlyArrow.anchorTwo.y,
      this.curlyArrow.endVector.y,
      0.5
    );

    this.p5.image(checkImage, x, y, 30, 30);
  }
}

class IncorrectArrowFeedback implements Feedback {
  curlyArrow: CurlyArrow;
  p5: p5;

  constructor(curlyArrow: CurlyArrow, p5: p5) {
    this.curlyArrow = curlyArrow;
    this.p5 = p5;
  }

  show() {
    let x = this.p5.bezierPoint(
      this.curlyArrow.startVector.x,
      this.curlyArrow.anchorOne.x,
      this.curlyArrow.anchorTwo.x,
      this.curlyArrow.endVector.x,
      0.5
    );

    let y = this.p5.bezierPoint(
      this.curlyArrow.startVector.y,
      this.curlyArrow.anchorOne.y,
      this.curlyArrow.anchorTwo.y,
      this.curlyArrow.endVector.y,
      0.5
    );

    this.p5.image(xImage, x, y, 30, 30);
  }
}

const feedbackItems: Feedback[] = [];

function addToFeedbackItems(feedback: Feedback) {
  feedbackItems.push(feedback);
}

function removeFromFeedbackItems(feedback: Feedback) {
  const index = feedbackItems.indexOf(feedback);
  if (index > -1) {
    feedbackItems.splice(index, 1);
  }
}

function showAllFeedbackItems() {
  feedbackItems.forEach((feedback) => {
    feedback.show();
  });
}

export {
  addToFeedbackItems,
  removeFromFeedbackItems,
  showAllFeedbackItems,
  CorrectArrowFeedback,
  IncorrectArrowFeedback,
};
