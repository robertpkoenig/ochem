- More than one arrow:
    Teacher
    - Reaction has an array of CurlyArrows
    - Each render, you process for all curly arrows
    - Each time you draw a new curly arrow, you add a new arrow to the array
    - each arrow has a number drawn along the line (in the middle) for its index
    - when you delete an arrow, all arrows index get adjusted accordingly
    - 
    Student
    - each time you are at a new step, your 'arrowsCompleted' index goes to zero
    - when you complete an arrow correctly, and index increments, and a partial success message tells you that one more arrow is needed
    - when you complete an arrow and the index increments and is equal to the number of arrows in that step, you move on to the next step as normal
    - 


- adjust overall layout of the student and teacher page so that notifications are on the page, and the canvas is not constrained
- failure message on the top of the screen (0.75)

- option to add lone pairs (8)
- animate movement of atoms between steps (16)
- atoms are the same between all frames
- additional help explaining how curly arrows are drawn (3)
- add option for contextual information / question for each step (5)
- bulk atom moves with shift select or click drag (8)
- look into make the hover detector logic simpler
- see if I can split up the p5 stuff into a seperate package
- add linting rules, including tailwind

Total time estimate: roughly a week

split up reaction page

- header
- steps
- editor panel
- elements list
