import HoverDetector from "./HoverDetector";
import p5 from "p5";

export function moveIonIfPressed(hoverDetector: HoverDetector, p5: p5) {
  const ion = hoverDetector.ionCurrentlyHovered
  if (ion === null || !p5.mouseIsPressed) return

  const atom = ion.atom
  const atomVector = p5.createVector(atom.getPosVector().x, atom.getPosVector().y)
  const mouseVector = p5.createVector(p5.mouseX, p5.mouseY)

  const difVector = mouseVector.sub(atomVector)
  const angle = p5.degrees(difVector.heading()) - 90

  console.log(angle);
  
  ion.angle = angle
}
