
interface IAtomicElement {
    name: string
    abbreviation: string
    numDesiredValenceElectrons: number
    color: string
    mass: number
    radius: number
}

interface IAtomicElements {
    [key: string]: IAtomicElement
}

// Note that none of the valence electrons are right
const AtomicElements: IAtomicElements = {

    "carbon": {
        name: "carbon",
        abbreviation: "C",
        numDesiredValenceElectrons: 4,
        color: "#111",
        mass: 10,
        radius: 20,
    },
    "hydrogen": {
        name: "hydrogen",
        abbreviation: "H",
        numDesiredValenceElectrons: 1,
        color: "silver",
        mass: 10,
        radius: 20,
    },
    "nitrogen": {
        name: "nitrogen",
        abbreviation: "N",
        numDesiredValenceElectrons: 1,
        color: "blue",
        mass: 10,
        radius: 20,
    },
    "oxygen": {
        name: "oxygen",
        abbreviation: "O",
        numDesiredValenceElectrons: 1,
        color: "red",
        mass: 10,
        radius: 20,
    },
    "phosphurus": {
        name: "phosphurus",
        abbreviation: "P",
        numDesiredValenceElectrons: 1,
        color: "forestgreen",
        mass: 10,
        radius: 20,
    },
    "sulfur": {
        name: "sulfur",
        abbreviation: "S",
        numDesiredValenceElectrons: 1,
        color: "forestgreen",
        mass: 10,
        radius: 20,
    },
    "flourine": {
        name: "flourine",
        abbreviation: "F",
        numDesiredValenceElectrons: 1,
        color: "forestgreen",
        mass: 10,
        radius: 20,
    },
    "chlorine": {
        name: "chlorine",
        abbreviation: "Cl",
        numDesiredValenceElectrons: 1,
        color: "forestgreen",
        mass: 10,
        radius: 20,
    },
    "bromine": {
        name: "bromine",
        abbreviation: "Br",
        numDesiredValenceElectrons: 1,
        color: "forestgreen",
        mass: 10,
        radius: 20,
    },
    "iodine": {
        name: "iodine",
        abbreviation: "I",
        numDesiredValenceElectrons: 1,
        color: "forestgreen",
        mass: 10,
        radius: 20,
    },
    "aluminium": {
        name: "aluminium",
        abbreviation: "Al",
        numDesiredValenceElectrons: 1,
        color: "forestgreen",
        mass: 10,
        radius: 20,
    },
    
}

export { AtomicElements }
export type { IAtomicElement }