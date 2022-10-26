import { Vector } from "sat";
import {
  LONE_PAIR_BALL_DISTANCE,
  LONE_PAIR_BALL_RADIUS,
  LONE_PAIR_ORBIT_RADIUS,
} from "../../../Constants";
import { Atom } from "./Atom";
import p5 from "p5";

class LonePair {
  atom: Atom;
  angle: number;
  uuid: string;

  constructor(atom: Atom, uuid: string, angle: number = 270) {
    this.atom = atom;
    this.angle = angle;
    this.uuid = uuid;
  }

  toJSON() {
    return {
      atom: this.atom.uuid,
      angle: this.angle,
      uuid: this.uuid,
    };
  }

  getPosVector() {
    const centerRelativeToAtomCenter = new Vector(0, LONE_PAIR_ORBIT_RADIUS);

    const thisAngleInRadians = (this.angle * Math.PI) / 180;
    centerRelativeToAtomCenter.rotate(thisAngleInRadians);

    const x = this.atom.getPosVector().x + centerRelativeToAtomCenter.x;
    const y = this.atom.getPosVector().y + centerRelativeToAtomCenter.y;

    return new Vector(x, y);
  }

  draw(p5: p5) {
    const relativeVector = new Vector(0, LONE_PAIR_ORBIT_RADIUS);

    relativeVector.rotate(p5.radians(this.angle));

    const posVector = this.getPosVector();

    const newPerpVector = new Vector()
      .copy(relativeVector)
      .normalize()
      .perp()
      .scale(LONE_PAIR_BALL_DISTANCE);
    const leftBallPosition = new Vector(
      posVector.x - newPerpVector.x,
      posVector.y - newPerpVector.y
    );
    const rightBallPosition = new Vector(
      posVector.x + newPerpVector.x,
      posVector.y + newPerpVector.y
    );
    p5.push();
    p5.ellipseMode(p5.CENTER);
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.fill(0);
    p5.ellipse(leftBallPosition.x, leftBallPosition.y, LONE_PAIR_BALL_RADIUS);
    p5.ellipse(rightBallPosition.x, rightBallPosition.y, LONE_PAIR_BALL_RADIUS);
    p5.pop();
  }
}

export default LonePair;
