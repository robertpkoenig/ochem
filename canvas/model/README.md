## DATA HIERARCHY

    Reaction
        ReactionStep
            Molecule[]
                Atom[] (extends Body)
                Bond[]
            CurlyArrow
            StraightArrows[]

## DEFINITIONS

- Reaction: Each excercise pertains to one reaction
- Reaction Step: Defined by a beginning/intermediate/terminal molecule configuration, and curly arrow denoting the electron movement that transforms the molecule into the configuration seen in the next step
- Molecule: Atoms with bonds between them
- Atom: An instance of an element
- Bond: A pair of atoms that are bonded
- Curly arrow: Denotes a movement of electrons
- Straight arrow: Arrows goes from current molecule configuration to terminal molecule configuration
