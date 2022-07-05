
Where I am:

- change model so that all atoms the same in each step
- each step has a map of atoms to coordinates
- when you move an atom, you are moving that mapped coordinate
- when you change between steps, the atoms animate to their new position
- when you delete an atom, it deletes the mapped coordinate in all steps

Student

- adjust overall layout of the student and teacher page so that notifications are on the page, and the canvas is not constrained

- option to add lone pairs (8)
- animate movement of atoms between steps (16)
- bulk atom moves with shift select or click drag (8)
- atoms are the same between all frames
- additional help explaining how curly arrows are drawn (3)
- add option for contextual information / question for each step (5)
- look into make the hover detector logic simpler
- see if I can split up the p5 stuff into a seperate package
- add linting rules, including tailwind
- refactor the ReactionStepLoader
- remove the 'functions' folder or something, it's just weird
- remove all classes, make everything just functions
- preview not always from step 1

Total time estimate: roughly a week

split up reaction page

- header
- steps
- editor panel
- elements list
