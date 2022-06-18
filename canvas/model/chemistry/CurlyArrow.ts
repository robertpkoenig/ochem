import { Polygon, Vector } from "sat"
import { Atom } from "./atoms/Atom"
import { Bond } from "./bonds/Bond"
import p5 from 'p5'

enum ArrowType {
    SINGLE = "SINGLE",
    DOUBLE = "DOUBLE"
}

class CurlyArrow {

    type: ArrowType
    startVector: Vector
    endVector: Vector
    startObject: Atom | Bond
    endObject: Atom | Bond
    anchorOne: Vector
    anchorTwo: Vector
    trianglePointOne: Vector
    trianglePointTwo: Vector
    points: Vector[]

    constructor(type: ArrowType) {
        this.type = type
        this.startObject = null
        this.endObject = null
    }

    toJSON() {
        return {
            type: this.type,
            startObjectId: this.startObject.uuid,
            endObjectId: this.endObject.uuid
        }
    }

    setStartObject(startObject: Atom | Bond) {
        this.startObject = startObject
    }

    setEndObject(endObject: Atom | Bond) {
        this.endObject = endObject
    }

    // Updates the arrows properties on each draw loop iteration,
    // so that the curly arrow is always lined up with the atoms/bonds
    // it goes between
    update(p5: p5, zoom: number) {
        this.setEndPoints(p5, zoom)
        this.setAnchorPoints()
        this.setTrianglePoints(p5)
        this.setCollisionPoints(p5)
    }

    setEndPoints(p5: p5, zoom: number) {
        this.startVector = this.startObject.getPosVector()
        if (this.endObject != null) {
            this.endVector = this.endObject.getPosVector()
        }
        else {
            this.endVector = new Vector(p5.mouseX / zoom,
                                        p5.mouseY / zoom)
        }
    }

    setAnchorPoints() {

        const diff = this.startVector.clone().sub(this.endVector)
        const perp = diff.clone().perp().normalize()

        perp.scale(100, 100)
        diff.scale(0.2, 0.2)

        this.anchorOne = this.startVector.clone().add(perp).sub(diff)
        this.anchorTwo = this.endVector.clone().add(perp).add(diff)

    }

    /** Sets the coordinates of the points of the triangle at the end of the curly arrow */
    setTrianglePoints(p5: p5) {

        // Find the coordinates of the triangle tip
        let tx = p5.bezierTangent(
            this.startVector.x,
            this.anchorOne.x,
            this.anchorTwo.x,
            this.endVector.x,
            1
        )
        let ty = p5.bezierTangent(
            this.startVector.y,
            this.anchorOne.y,
            this.anchorTwo.y,
            this.endVector.y,
            1
        )
        let a = p5.atan2(ty, tx)
        a += Math.PI

        const angleScale = Math.PI / 10
        const angleAdjust = 0.04
        const triangleLength = 20

        const trianglePointOneX = p5.cos(a + angleScale + angleAdjust) * triangleLength + this.endVector.x
        const trianglePointOneY = p5.sin(a + angleScale + angleAdjust) * triangleLength + this.endVector.y

        this.trianglePointOne = new Vector(trianglePointOneX, trianglePointOneY)

        const trianglePointTwoX = p5.cos(a - angleScale + angleAdjust) * triangleLength + this.endVector.x
        const trianglePointTwoY = p5.sin(a - angleScale + angleAdjust) * triangleLength + this.endVector.y

        this.trianglePointTwo = new Vector(trianglePointTwoX, trianglePointTwoY)

    }

    /** 
     * Curly arrow collision detection works by super-imposing invisible straight lines
     * over the curl, and detecting collisions with any of these line segments.
     * This method creates the points defining each line segment.
     */
    setCollisionPoints(p5: p5) {

        this.points = []

        const steps = 6;

        for (let i = 0; i <= steps; i++) {

            let t = i / steps;

            let x = p5.bezierPoint(
                this.startVector.x,
                this.anchorOne.x,
                this.anchorTwo.x,
                this.endVector.x,
                t
            )

            let y = p5.bezierPoint(
                this.startVector.y,
                this.anchorOne.y,
                this.anchorTwo.y,
                this.endVector.y,
                t
            )

            this.points.push(new Vector(x, y))

        }

    }

}

export { ArrowType, CurlyArrow }

