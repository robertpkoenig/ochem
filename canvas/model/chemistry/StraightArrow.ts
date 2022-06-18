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

    update(p5: p5, zoom: number) {
        this.setTrianglePoints(p5, zoom)
        this.setEndVector(p5, zoom)
    }

    setEndVector(p5: p5, zoom: number) {
        const mouseVector = new Vector(p5.mouseX / zoom, p5.mouseY / zoom)
        this.endVector = mouseVector
    }

    setTrianglePoints(p5: p5, zoom: number) {
        // Find the coordinates of the triangle tip
        
        const xDistance = this.startVector.x - ( p5.mouseX / zoom )
        const yDistance = this.startVector.y - ( p5.mouseY / zoom )
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