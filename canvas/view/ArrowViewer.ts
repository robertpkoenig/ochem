import p5 from "p5";
import { CurlyArrow } from "../model/chemistry/CurlyArrow";

// Draws curly arrows
class ArrowViewer {

    p5: p5

    constructor(p5: p5) {
        this.p5 = p5
    }

    renderArrow(arrow: CurlyArrow) {
        
        this.p5.push()

            // Draw the curved line
            this.p5.noFill()
            this.p5.strokeWeight(6)
            this.p5.stroke(220)
            this.p5.bezier(
                arrow.startVector.x, arrow.startVector.y,
                arrow.anchorOne.x, arrow.anchorOne.y,
                arrow.anchorTwo.x, arrow.anchorTwo.y,
                arrow.endVector.x, arrow.endVector.y
            )

            // Draw the arrow point
            this.p5.fill(220)
            this.p5.stroke(220)
            this.p5.triangle(
                arrow.endVector.x,
                arrow.endVector.y,
                arrow.trianglePointOne.x,
                arrow.trianglePointOne.y,
                arrow.trianglePointTwo.x,
                arrow.trianglePointTwo.y,
            )

            // Draw the curved line
            this.p5.stroke(0)
            this.p5.strokeWeight(2)
            this.p5.noFill()
            this.p5.bezier(
                arrow.startVector.x, arrow.startVector.y,
                arrow.anchorOne.x, arrow.anchorOne.y,
                arrow.anchorTwo.x, arrow.anchorTwo.y,
                arrow.endVector.x, arrow.endVector.y
            )

            // Draw the arrow point
            this.p5.fill(0)
            this.p5.triangle(
                arrow.endVector.x,
                arrow.endVector.y,
                arrow.trianglePointOne.x,
                arrow.trianglePointOne.y,
                arrow.trianglePointTwo.x,
                arrow.trianglePointTwo.y,
            )

        this.p5.pop()

    }

}

export default ArrowViewer