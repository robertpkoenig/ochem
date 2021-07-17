import { Polygon, Vector } from "sat"
import { Atom } from "./atoms/Atom"
import { Bond } from "./bonds/Bond"

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
    }

    toJSON() {
        return {
            type: this.type,
            startObjectId: this.startObject.id,
            endObjectId: this.endObject.id
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
    update() {
        this.setEndPoints()
        this.setAnchorPoints()
        this.setTrianglePoints()
        this.setCollisionPoints()
    }

    setEndPoints() {
        this.startVector = this.startObject.getPosVector()
        if (this.endObject != null) {
            this.endVector = this.endObject.getPosVector()
        }
        else {
            this.endVector = new Vector(window.p5.mouseX,
                                        window.p5.mouseY)
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

    setTrianglePoints() {

        // Find the coordinates of the triangle tip
        let tx = window.p5.bezierTangent(
            this.startVector.x,
            this.anchorOne.x,
            this.anchorTwo.x,
            this.endVector.x,
            1
        )
        let ty = window.p5.bezierTangent(
            this.startVector.y,
            this.anchorOne.y,
            this.anchorTwo.y,
            this.endVector.y,
            1
        )
        let a = window.p5.atan2(ty, tx)
        a += Math.PI

        const angleScale = Math.PI / 10
        const angleAdjust = 0.04
        const triangleLength = 20

        const trianglePointOneX = window.p5.cos(a + angleScale + angleAdjust) * triangleLength + this.endVector.x
        const trianglePointOneY = window.p5.sin(a + angleScale + angleAdjust) * triangleLength + this.endVector.y

        this.trianglePointOne = new Vector(trianglePointOneX, trianglePointOneY)

        const trianglePointTwoX = window.p5.cos(a - angleScale + angleAdjust) * triangleLength + this.endVector.x
        const trianglePointTwoY = window.p5.sin(a - angleScale + angleAdjust) * triangleLength + this.endVector.y

        this.trianglePointTwo = new Vector(trianglePointTwoX, trianglePointTwoY)

    }

    setCollisionPoints() {

        this.points = []

        const steps = 6;

        for (let i = 0; i <= steps; i++) {

            let t = i / steps;

            let x = window.p5.bezierPoint(
                this.startVector.x,
                this.anchorOne.x,
                this.anchorTwo.x,
                this.endVector.x,
                t
            )

            let y = window.p5.bezierPoint(
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

