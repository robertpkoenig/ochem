import { Vector } from "sat";
import { Atom } from "../atoms/Atom";
import BondType from "./BondType";

class Bond {
  // The angle is determined by the position of atoms, not the bonds
  // The bond is just drawn between the two atoms

  atoms: Atom[];
  distance: number;
  type: BondType;
  uuid: string;

  constructor(
    atomOne: Atom,
    atomTwo: Atom,
    distance: number,
    type: BondType,
    uuid: string
  ) {
    this.atoms = [atomOne, atomTwo];
    this.distance = distance;
    this.type = type;
    this.uuid = uuid;
  }

  toJSON() {
    return {
      atomOne: this.atoms[0].uuid,
      atomTwo: this.atoms[1].uuid,
      type: this.type as string,
      uuid: this.uuid,
    };
  }

  getPosVector() {
    const atomOnePos = this.atoms[0].circle.pos;
    const atomTwoPos = this.atoms[1].circle.pos;
    const midPointX = (atomOnePos.x + atomTwoPos.x) / 2;
    const midPointY = (atomOnePos.y + atomTwoPos.y) / 2;
    return new Vector(midPointX, midPointY);
  }
}

export { Bond };
