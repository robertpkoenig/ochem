import { Vector } from "sat"
import { ION_ORBIT_RADIUS, ION_RADIUS, LONE_PAIR_ORBIT_RADIUS, OUTLINE_THICKNESS, RED_OUTLINE_COLOR } from "../../../Constants"
import { Atom } from "./Atom"
import p5 from "p5";

class LonePair {

  atom: Atom
  angle: number

  constructor(atom: Atom) {
    this.atom = atom
    this.angle = 180
  }

  toJSON() {
    return {
      atom: this.atom.uuid,
      angle: this.angle,
    }
  }

  getPosVector(p5: p5) {
    const centerRelativeToAtomCenter = new Vector(0, LONE_PAIR_ORBIT_RADIUS)
  
    centerRelativeToAtomCenter.rotate(p5.radians(this.angle))

    const x = this.atom.getPosVector().x + centerRelativeToAtomCenter.x
    const y = this.atom.getPosVector().y - centerRelativeToAtomCenter.y

    return new Vector(x, y)
  }

  draw(p5: p5) {
    const relativeVector = new Vector(0, LONE_PAIR_ORBIT_RADIUS)
  
    relativeVector.rotate(p5.radians(this.angle))

    const posVector = this.getPosVector(p5)

    const newPerpVector = new Vector().copy(relativeVector).normalize().perp().scale(10)
    const leftBallPosition = new Vector(posVector.x - newPerpVector.x, posVector.y + newPerpVector.y)
    const rightBallPosition = new Vector(posVector.x + newPerpVector.x, posVector.y - newPerpVector.y)
    p5.push()
        p5.ellipseMode(p5.CENTER);
        p5.stroke(0)
        p5.strokeWeight(1)
        p5.fill(255, 0, 0)
        p5.ellipse(leftBallPosition.x, leftBallPosition.y, ION_RADIUS)
        p5.fill(0, 255, 0)
        p5.ellipse(rightBallPosition.x, rightBallPosition.y, ION_RADIUS)
    p5.pop()
  }

}

export default LonePair