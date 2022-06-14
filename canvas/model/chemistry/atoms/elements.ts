
interface IAtomicElement {
    name: string
    abbreviation: string
    numDesiredValenceElectrons: number
    color: string
    mass: number
    radius: number
}

interface IElements {
    [key: string]: IAtomicElement
}

// Note that none of the valence electrons are right
const Elements: IElements = {

    "carbon": {
        name: "carbon",
        abbreviation: "C",
        numDesiredValenceElectrons: 4,
        color: "#909090",
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
        color: "#FF8000",
        mass: 10,
        radius: 20,
    },
    "sulfur": {
        name: "sulfur",
        abbreviation: "S",
        numDesiredValenceElectrons: 1,
        color: "#EAB308",
        mass: 10,
        radius: 20,
    },
    "flourine": {
        name: "flourine",
        abbreviation: "F",
        numDesiredValenceElectrons: 1,
        color: "#90E050",
        mass: 10,
        radius: 20,
    },
    "chlorine": {
        name: "chlorine",
        abbreviation: "Cl",
        numDesiredValenceElectrons: 1,
        color: "#1FF01F",
        mass: 10,
        radius: 20,
    },
    "bromine": {
        name: "bromine",
        abbreviation: "Br",
        numDesiredValenceElectrons: 1,
        color: "#A62929",
        mass: 10,
        radius: 20,
    },
    "iodine": {
        name: "iodine",
        abbreviation: "I",
        numDesiredValenceElectrons: 1,
        color: "#940094",
        mass: 10,
        radius: 20,
    },
    "aluminium": {
        name: "aluminium",
        abbreviation: "Al",
        numDesiredValenceElectrons: 1,
        color: "#EAB308",
        mass: 10,
        radius: 20,
    },
    "r-group": {
        name: "r-group",
        abbreviation: "R",
        numDesiredValenceElectrons: 1,
        color: "black",
        mass: 10,
        radius: 20,
    },
    "dummy": {
        name: "dummy",
        abbreviation: "",
        numDesiredValenceElectrons: 1,
        color: null,
        mass: 10,
        radius: 20,
    }
    
}

export { Elements }
export type { IAtomicElement }
