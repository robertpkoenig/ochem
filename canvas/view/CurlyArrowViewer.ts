import p5 from "p5";
import { CurlyArrow } from "../model/chemistry/CurlyArrow";

// Draws curly arrows
class CurlyArrowViewer {
  p5: p5;

  constructor(p5: p5) {
    this.p5 = p5;
  }

  renderCurlyArrow(arrow: CurlyArrow, index: number, showIndex: boolean) {
    this.p5.push();

    // Draw the curved line
    this.p5.noFill();
    this.p5.strokeWeight(6);
    this.p5.stroke(220);
    this.p5.bezier(
      arrow.startVector.x,
      arrow.startVector.y,
      arrow.anchorOne.x,
      arrow.anchorOne.y,
      arrow.anchorTwo.x,
      arrow.anchorTwo.y,
      arrow.endVector.x,
      arrow.endVector.y
    );

    // Draw the arrow point
    this.p5.fill(220);
    this.p5.stroke(220);
    this.p5.triangle(
      arrow.endVector.x,
      arrow.endVector.y,
      arrow.trianglePointOne.x,
      arrow.trianglePointOne.y,
      arrow.trianglePointTwo.x,
      arrow.trianglePointTwo.y
    );

    // Draw the curved line
    this.p5.stroke(0);
    this.p5.strokeWeight(2);
    this.p5.noFill();
    // this.p5.drawingContext.setLineDash([5, 5]); // This DOES work, just not typed out
    this.p5.bezier(
      arrow.startVector.x,
      arrow.startVector.y,
      arrow.anchorOne.x,
      arrow.anchorOne.y,
      arrow.anchorTwo.x,
      arrow.anchorTwo.y,
      arrow.endVector.x,
      arrow.endVector.y
    );

    // Draw the arrow point
    this.p5.fill(0);
    this.p5.triangle(
      arrow.endVector.x,
      arrow.endVector.y,
      arrow.trianglePointOne.x,
      arrow.trianglePointOne.y,
      arrow.trianglePointTwo.x,
      arrow.trianglePointTwo.y
    );

    let x = this.p5.bezierPoint(
      arrow.startVector.x,
      arrow.anchorOne.x,
      arrow.anchorTwo.x,
      arrow.endVector.x,
      0.5
    );

    let y = this.p5.bezierPoint(
      arrow.startVector.y,
      arrow.anchorOne.y,
      arrow.anchorTwo.y,
      arrow.endVector.y,
      0.5
    );

    // Draw the number
    if (showIndex) {
      this.p5.stroke(0);
      this.p5.fill(255);
      this.p5.strokeWeight(5);
      this.p5.textSize(24);
      this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
      this.p5.text(index + 1, x, y);
    }

    this.p5.pop();
  }
}

export default CurlyArrowViewer;
