DEADLINE - 10th October

BUGS
============================================
- create a step with three atoms, create new step with those atoms copied in, add bonds to them in first step, delete atom in second step, and bonds in first step unconnected will then be deleted
- deleting atom in later step managed to corrupt the data structure somehow. This was a complex reaction.

CURRENT
============================================
- duplicate reactions
- make delete a hot key, not a menu item
- undo is not working
- analytics
- forgot password
- bug fixes

STEVE ISSUES
============================================

Clarification:
- Deleting in later step deletes structure in earlier step 

Todo:
- change straight arrow to reaction arrow
- add ability to draw a plus sign on the screen

Long todo:
- Can students draw product? (no)
- Copy/duplicate would be useful (yes)

NEXT
============================================
- double half headed arrow (5)
- add a hand button to the controller (1)
- refactor student module page
- There should be a "preview" indicator on the student pages for the teacher

Refactor
- look into make the hover detector logic simpler
- see if I can split up the p5 stuff into a seperate package
- add linting rules, including tailwind
- refactor the ReactionStepLoader
- remove the 'functions' folder or something, it's just weird
- remove all classes, make everything just functions
- if showing image inside a square button, just make that part of the children
- get everything to 2 space tab

Feature ideas
- special feedback for certain wrong arrows
- hint for each step
- contextual questions that are optional
- explenation for each step
- for each reaction, have an explenation page where the student can just quickly read about it
- link(s) in each reaction page to outside resources

port for auth: 9099
port for firestore: 8080
port for emulator: 7070

firebase emulators:start