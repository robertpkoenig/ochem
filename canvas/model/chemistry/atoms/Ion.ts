import { Vector } from "sat"
import { ION_ORBIT_RADIUS, ION_RADIUS } from "../../../Constants"
import { Atom } from "./Atom"
import p5 from "p5";

type IonType = '+' | '-'


class Ion {

  type: IonType
  atom: Atom
  angle: number
  uuid: string

  constructor(type: IonType, atom: Atom, uuid: string, angle: number = 90) {
    this.type = type
    this.atom = atom
    this.angle = angle
    this.uuid = uuid
  }

  toJSON() {
    return {
      type: this.type,
      atom: this.atom.uuid,
      angle: this.angle,
      uuid: this.uuid
    }
  }

  getPosVector() {
    const centerRelativeToAtomCenter = new Vector(0, ION_ORBIT_RADIUS)
  
    const thisAngleInRadians = this.angle * Math.PI / 180
    centerRelativeToAtomCenter.rotate(thisAngleInRadians)

    const x = this.atom.getPosVector().x + centerRelativeToAtomCenter.x
    const y = this.atom.getPosVector().y + centerRelativeToAtomCenter.y

    return new Vector(x, y)
  }

  draw(p5: p5) {
    const relativeVector = new Vector(0, ION_ORBIT_RADIUS)
    relativeVector.rotate(p5.radians(this.angle))
    const { x, y } = this.getPosVector()

    p5.push()
        // ion bounding circle
        p5.stroke(0)
        p5.strokeWeight(1)
        p5.fill(255)
        p5.ellipse(x, y, ION_RADIUS)

        // cation bounding circle
        p5.noStroke()
        p5.fill(0)
        p5.text(this.type, x, y + 2)
    p5.pop()
  }

}

export default Ion
export type { IonType }
