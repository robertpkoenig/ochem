import { Vector } from "sat"
import { ATOM_REPULSION_FACTOR } from "../../Constants"
import { Atom } from "../chemistry/atoms/Atom"
import Reaction from "../Reaction"

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
        // For each body (atom etc.), apply repulsion force from all other bodies
        for (const molecule of this.reaction.currentStep.molecules) {
            const atoms = molecule.atoms
            for (let i = 0 ; i < atoms.length ; i++) {                
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
            (distanceVector.x / magnitudeSquared) * ATOM_REPULSION_FACTOR * massProduct
        const yForce = 
            (distanceVector.y / magnitudeSquared) * ATOM_REPULSION_FACTOR * massProduct

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

            const distanceVectorScaledToDifference = distanceVector.scale(lengthDifAsPercentOfCurrentLength / 4)

            bond.atoms[0].force.add(distanceVectorScaledToDifference)
            bond.atoms[1].force.add(distanceVectorScaledToDifference.reverse())

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