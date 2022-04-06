import { Vector } from "sat";
import p5 from 'p5'

class StraightArrow {

    public startVector: Vector
    public endVector: Vector
    public trianglePointOne: Vector
    public trianglePointTwo: Vector

    constructor(start: Vector) {
        this.startVector = start
        this.endVector = start
    }

    update(p5: p5) {
        this.setTrianglePoints(p5)
        this.setEndVector(p5)
    }

    setEndVector(p5: p5) {
        const mouseVector = new Vector(p5.mouseX, p5.mouseY)
        this.endVector = mouseVector
    }

    setTrianglePoints(p5: p5) {
        // Find the coordinates of the triangle tip
        
        const xDistance = this.startVector.x - p5.mouseX
        const yDistance = this.startVector.y - p5.mouseY
        let angle = p5.atan2(yDistance, xDistance)

        const angleScale = Math.PI / 10
        const triangleLength = 20

        const trianglePointOneX = p5.cos(angle + angleScale) * triangleLength + this.endVector.x
        const trianglePointOneY = p5.sin(angle + angleScale) * triangleLength + this.endVector.y

        this.trianglePointOne = new Vector(trianglePointOneX, trianglePointOneY)

        const trianglePointTwoX = p5.cos(angle - angleScale) * triangleLength + this.endVector.x
        const trianglePointTwoY = p5.sin(angle - angleScale) * triangleLength + this.endVector.y

        this.trianglePointTwo = new Vector(trianglePointTwoX, trianglePointTwoY)
    }

}

export default StraightArrow