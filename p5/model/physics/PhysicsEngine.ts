import { Vector } from "sat"
import Constants from "../../Constants"
import { Atom } from "../chemistry/atoms/Atom"
import Reaction from "../Reaction"
import { Body } from "./Body"

// Based on this code
// https://editor.p5js.org/JeromePaddick/sketches/bjA_UOPip

class PhysicsEngine {

    reaction: Reaction

    constructor(reaction: Reaction)
    {
        this.reaction = reaction
    }

    applyPhysics() {
        this.makeBondLengthCorrect()
        this.applyBodyRepulsionWithinMolecules()
        this.applyAllForces()
    }

    applyBodyRepulsionWithinMolecules() {
        // For each particle, apply a force equal to the opposite of the distance from the
        // other particles
        for (const molecule of this.reaction.currentStep.molecules) {
            const atoms = molecule.atoms
            for (let i = 0 ; i < atoms.length ; i++) {
                if (atoms[i].element.name == "dummy") console.log(atoms[i].circle.pos.x);
                
                for (let j = i + 1 ; j < atoms.length ; j++) {
                    const atomOne = atoms[i]
                    const atomTwo = atoms[j]
                    this.repulseTwoObjects(atomOne, atomTwo)
                }
            }
        }
    }

    repulseTwoObjects(atomOne: Atom, atomTwo: Atom) {

        // Only repulse them 
        const posOne = atomOne.circle.pos
        const posTwo = atomTwo.circle.pos
        const distanceVector = posOne.clone().sub(posTwo)

        const massProduct = atomOne.mass * atomTwo.mass

        // scale the force to be smaller if the atoms are further apart
        const magnitudeSquared = distanceVector.len2()

        // I think I have to limit this force to be the max of this, or the pull force
        const xForce =
            (distanceVector.x / magnitudeSquared) * Constants.ATOM_REPULSION_FACTOR * massProduct
        const yForce = 
            (distanceVector.y / magnitudeSquared) * Constants.ATOM_REPULSION_FACTOR * massProduct

        const forceVector = new Vector(xForce, yForce)

        atomOne.force.add(forceVector)
        atomTwo.force.add(forceVector.reverse())

    }

    makeBondLengthCorrect() {

        for (const bond of this.reaction.currentStep.getAllBonds()) {

            // Get the positions of the two atoms
            const posOne = bond.atoms[0].circle.pos
            const posTwo = bond.atoms[1].circle.pos

            // Calculate the distance between the two points
            const distanceVector = posOne.clone().sub(posTwo)
            const currentBondLength = distanceVector.len()

            // Calculate normalized distance
            const normalizedDistance = distanceVector.clone().normalize()

            // Calculate difference between the current bond length
            // and what the bond length should be
            let desiredBondLength = bond.distance
            const difBetweenDesiredAndCurrentLength = desiredBondLength - currentBondLength
            
            const lengthDifAsPercentOfCurrentLength = difBetweenDesiredAndCurrentLength / currentBondLength

            // if (lengthDifAsPercentOfCurrentLength < 0.01) return

            const distanceVectorScaledToDifference = distanceVector.scale(lengthDifAsPercentOfCurrentLength / 4)

            bond.atoms[0].force.add(distanceVectorScaledToDifference)
            bond.atoms[1].force.add(distanceVectorScaledToDifference.reverse())

            // const posOne = bond.atoms[0].circle.pos
            // const posTwo = bond.atoms[1].circle.pos
            // const distanceVector = posOne.clone().sub(posTwo)
            // const normalizedDistance = distanceVector.clone().normalize()
            
            // const magnitude = distanceVector.len()

            // let distance = bond.distance

            // const bondStretch = distance - magnitude

            // const xForce =
            //     (normalizedDistance.x * bondStretch / Constants.BOND_PULL_FACTOR)
            // const yForce = 
            //     (normalizedDistance.y * bondStretch / Constants.BOND_PULL_FACTOR)

            // const forceVector = new Vector(xForce, yForce)

            // bond.atoms[0].force.add(forceVector)
            // bond.atoms[1].force.add(forceVector.reverse())

        }

    }

    applyAllForces() {
        const atoms = this.reaction.currentStep.getAllAtoms()
        for (const body of atoms) {
            body.circle.pos.add(body.force)
            body.force.sub(body.force)
        }
    }

}

export { PhysicsEngine }