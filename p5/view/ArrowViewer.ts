import { CurlyArrow } from "../model/chemistry/CurlyArrow";

class ArrowViewer {

    public static renderArrow(arrow: CurlyArrow) {
        
        window.p5.push()

            // Draw the curved line
            window.p5.strokeWeight(2)
            window.p5.noFill()
            window.p5.bezier(
                arrow.startVector.x, arrow.startVector.y,
                arrow.anchorOne.x, arrow.anchorOne.y,
                arrow.anchorTwo.x, arrow.anchorTwo.y,
                arrow.endVector.x, arrow.endVector.y
            )

            // Draw the arrow point
            window.p5.fill(0)
            window.p5.triangle(
                arrow.endVector.x,
                arrow.endVector.y,
                arrow.trianglePointOne.x,
                arrow.trianglePointOne.y,
                arrow.trianglePointTwo.x,
                arrow.trianglePointTwo.y,
            )

        window.p5.pop()

    }

}

export default ArrowViewer