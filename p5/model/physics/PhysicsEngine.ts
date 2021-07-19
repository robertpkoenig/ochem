import { Vector } from "sat"
import Constants from "../../Constants"
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
        this.applyBodyRepulsionWithinMolecules()
        this.applyPull()
        this.applyAllForces()
    }

    applyBodyRepulsionWithinMolecules() {
        // For each particle, apply a force equal to the opposite of the distance from the
        // other particles
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

    repulseTwoObjects(bodyOne: Body, bodyTwo: Body) {

        const posOne = bodyOne.circle.pos
        const posTwo = bodyTwo.circle.pos
        const distanceVector = posOne.clone().sub(posTwo)

        const massProduct = bodyOne.mass * bodyTwo.mass

        // scale the force to be smaller if the atoms are further apart
        const magnitudeSquared = distanceVector.len2()
        const xForce =
            (distanceVector.x / magnitudeSquared) * Constants.ATOM_REPULSION_FACTOR * massProduct
        const yForce = 
            (distanceVector.y / magnitudeSquared) * Constants.ATOM_REPULSION_FACTOR * massProduct

        const forceVector = new Vector(xForce, yForce)

        bodyOne.force.add(forceVector)
        bodyTwo.force.add(forceVector.reverse())

    }

    applyPull() {

        for (const bond of this.reaction.currentStep.getAllBonds()) {

            const posOne = bond.atoms[0].circle.pos
            const posTwo = bond.atoms[1].circle.pos
            const distanceVector = posOne.clone().sub(posTwo)
            const normalizedDistance = distanceVector.clone().normalize()
            
            const magnitude = distanceVector.len()

            let distance = bond.distance

            const bondStretch = distance - magnitude

            const xForce =
                (normalizedDistance.x * bondStretch / Constants.BOND_PULL_FACTOR)
            const yForce = 
                (normalizedDistance.y * bondStretch / Constants.BOND_PULL_FACTOR)

            const forceVector = new Vector(xForce, yForce)

            bond.atoms[0].force.add(forceVector)
            bond.atoms[1].force.add(forceVector.reverse())

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