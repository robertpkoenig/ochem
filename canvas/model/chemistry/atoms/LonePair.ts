import { Vector } from "sat"
import { ION_ORBIT_RADIUS, ION_RADIUS, LONE_PAIR_ORBIT_RADIUS, OUTLINE_THICKNESS, RED_OUTLINE_COLOR } from "../../../Constants"
import { Atom } from "./Atom"
import p5 from "p5";

class LonePair {

  atom: Atom
  angle: number

  constructor(atom: Atom) {
    this.atom = atom
    this.angle = 45
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
    const posVector = this.getPosVector(p5)
    const perpVector = new Vector()
    perpVector.copy(posVector).normalize().perp().scale(10)
    const leftBallPosition = posVector.add(perpVector)
    const rightBallPosition = posVector.sub(perpVector)
    p5.push()
        p5.noFill()
        p5.stroke(RED_OUTLINE_COLOR)
        p5.strokeWeight(OUTLINE_THICKNESS)
        p5.ellipse(leftBallPosition.x, leftBallPosition.y, ION_RADIUS + OUTLINE_THICKNESS)
        p5.ellipse(rightBallPosition.x, rightBallPosition.y, ION_RADIUS + OUTLINE_THICKNESS)
    p5.pop()
  }

}

export default LonePair