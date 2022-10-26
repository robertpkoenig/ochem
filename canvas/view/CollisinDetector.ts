import Reaction from "../model/Reaction";
import SAT, { Circle, Polygon, Vector } from "sat";
import { Bond } from "../model/chemistry/bonds/Bond";
import p5 from "p5";
import { CurlyArrow } from "../model/chemistry/CurlyArrow";
import { Atom } from "../model/chemistry/atoms/Atom";
import StraightArrow from "../model/chemistry/StraightArrow";
import {
  ION_ORBIT_RADIUS,
  ION_RADIUS,
  LONE_PAIR_COLLISION_RADIUS,
} from "../Constants";
import LonePair from "../model/chemistry/atoms/LonePair";
import Ion from "../model/chemistry/atoms/Ion";

// Contains methods for checking if various elements
// visually overlap. It utilizes an open source collision
// detection library call SAT https://www.npmjs.com/package/sat
class CollisionDetector {
  p5: p5;
  reaction: Reaction;

  constructor(p5: p5, reaction: Reaction) {
    this.p5 = p5;
    this.reaction = reaction;
  }

  twoAtomsOverlap(atomOne: Atom, atomTwo: Atom): boolean {
    const circleOne = new SAT.Circle(atomOne.circle.pos, atomOne.radius);
    const circleTwo = new SAT.Circle(atomTwo.circle.pos, atomTwo.radius);
    return SAT.testCircleCircle(circleOne, circleTwo);
  }

  mouseHoveredOverAtom(atom: Atom): boolean {
    // console.log('this.p5.mouseX : ' + this.p5.mouseX)
    // console.log('this.p5.mouseY : ' + this.p5.mouseY)
    // console.log('this.p5.mouseX / 2 : ' + this.p5.mouseX * 2)
    // console.log('this.p5.mouseY / 2 : ' + this.p5.mouseY * 2)
    // console.log('atom.circle.x : ' + atom.circle.pos.x)
    // console.log('atom.circle.y : ' + atom.circle.pos.y)
    const mousePosition = new Vector(
      this.p5.mouseX / this.reaction.zoom,
      this.p5.mouseY / this.reaction.zoom
    );
    return SAT.pointInCircle(mousePosition, atom.circle);
  }

  mouseHoveredOverIon(ion: Ion) {
    const mouseVector = new Vector(
      this.p5.mouseX / this.reaction.zoom,
      this.p5.mouseY / this.reaction.zoom
    );
    const ionCoordinateVector = ion.getPosVector();
    const ionCircle = new SAT.Circle(ionCoordinateVector, ION_RADIUS);
    return SAT.pointInCircle(mouseVector, ionCircle);
  }

  mouseHoveredOverLonePair(lonePair: LonePair) {
    const mouseVector = new Vector(
      this.p5.mouseX / this.reaction.zoom,
      this.p5.mouseY / this.reaction.zoom
    );
    const lonePairAbsoluteCoordinateVector = lonePair.getPosVector();
    const lonePairCircle = new SAT.Circle(
      lonePairAbsoluteCoordinateVector,
      LONE_PAIR_COLLISION_RADIUS
    );
    return SAT.pointInCircle(mouseVector, lonePairCircle);
  }

  mouseHoveredOverBond(bond: Bond): boolean {
    const mouseVector = new Vector(
      this.p5.mouseX / this.reaction.zoom,
      this.p5.mouseY / this.reaction.zoom
    );
    const mouseCircle = new Circle(mouseVector, 10);
    const bondPolygon = new Polygon(new Vector(), [
      bond.atoms[0].circle.pos,
      bond.atoms[1].circle.pos,
    ]);
    return SAT.testCirclePolygon(mouseCircle, bondPolygon);
  }

  mouseHoveredOverArrow(arrow: CurlyArrow): boolean {
    const mouseVector = new Vector(
      this.p5.mouseX / this.reaction.zoom,
      this.p5.mouseY / this.reaction.zoom
    );
    const mouseCircle = new Circle(mouseVector, 10);
    for (let i = 1; i < arrow.points.length; i++) {
      const linePolygon = new Polygon(new Vector(), [
        arrow.points[i - 1],
        arrow.points[i],
      ]);
      if (SAT.testCirclePolygon(mouseCircle, linePolygon)) {
        return true;
      }
    }
    return false;
  }

  mouseHoveredOverStraightArrow(arrow: StraightArrow): boolean {
    const mouseVector = new Vector(
      this.p5.mouseX / this.reaction.zoom,
      this.p5.mouseY / this.reaction.zoom
    );
    const mouseCircle = new Circle(mouseVector, 10);
    const bondPolygon = new Polygon(new Vector(), [
      arrow.startVector,
      arrow.endVector,
    ]);
    return SAT.testCirclePolygon(mouseCircle, bondPolygon);
  }
}

export default CollisionDetector;
