Landing

- [x] Introductory video works on chrome, safari, and firefox
- [x] Top sign up button leads to sign up page
- [x] Bottom sign up button leads to sign up page
- [x] Login button leads to login page
- [x] Top intro button shows intro video popup
- [x] Bottom intro button shows intro video popup

Teacher sign up

- [x] Signing up leads to Firebase authentication user created
- [x] Signing up leads to Firebase firestore user object created

Student module invitation

- [x] Module name shown correctly
- [x] Module owner name shown correctly
- [x] Signing up leads to Firebase authentication user created
- [x] Signing up leads to Firebase firestore user object created
- [x] Signing up leads to student being added to module analytics record
- [x] If student visits this page in logged in state, they are redirected to module page

Teacher/student login

- [x] Sign up link leads to sign up page
- [x] Student logged in correctly and brought to only module page
- [x] If student has more than one module, they are brought to student modules page
- [x] Teacher brought to teacher modules page

Teacher modules page

- [x] Module list shown correctly
- [x] Module document created in Firebase after creating module
- [x] Abridged module document created in Firebase after creating module
- [ ] Module analytics document created in Firebase after creating module
- [ ] Module document deleted in Firebase after deleting module
- [ ] Abridged module document deleted in Firebase after deleting module
- [ ] Module analytics document deleted in Firebase after deleting module
- [x] Modules shown in order of creation date

Teacher module editor

- [x] Module renamed in Firebase after rename triggered
- [x] Section created with correct name and order in Firebase
- [x] Order of all sections correctly updated in Firebase when section is first in the list and order is incremented
- [x] Nothing happens when section is first in the list and order is incremented
- [x] Order of all sections correctly updated in Firebase when section is in the middle of the list and order is incremented
- [x] Order of all sections correctly updated in Firebase when section is in the middle of the list and order is decremented
- [x] Order of all sections correctly updated in Firebase when section is last in the list and order is decremented
- [x] Nothing happens when section is last in the list and order is decremented
- [x] Section renamed in Firebase after rename triggered
- [x] Reaction created with correct name and order in Firebase
- [x] Order of all reactions correctly updated in Firebase when reaction is first in the list and order is incremented
- [x] Nothing happens when reaction is first in the list and order is incremented
- [x] Order of all reactions correctly updated in Firebase when reaction is in the middle of the list and order is incremented
- [x] Order of all reactions correctly updated in Firebase when reaction is in the middle of the list and order is decremented
- [x] Order of all reactions correctly updated in Firebase when reaction is last in the list and order is decremented
- [x] Nothing happens when reaction is last in the list and order is decremented
- [ ] Section document is deleted from Firebase when section deleted
- [x] Order of all subsequent sections decremented when section is deleted
- [x] Reaction document is deleted from Firebase when reaction deleted
- [x] Order of all subsequent reactions decremented when reaction is deleted
- [x] Correct student invite link is generated
- [ ] Analytics link works correctly

reaction editor

- [x] New reaction steps contains previous step contents, minus the curly arrow
- [x] New reaction step persists in database
- [x] reaction deleted in Firebase
- [x] Nothing happens when attempting to delete step if it is the last one left
- [x] step order decremented of step above one that is deleted
- [x] Single, double, and triple bonds created correctly
- [x] Bonds deletable
- [x] Curly arrow can connect from atom to atom
- [x] Curly arrow can connect from atom to bond
- [x] Curly arrow can connect from bond to bond
- [x] Curly arrow can connect from bond to atom
- [x] Curly arrows get the number when more than one
- [x] Curly arrows delete and numbers update correctly
- [x] Curly arrow persists
- [x] Curly arrow updates position with anchor elements
- [x] Curly arrow deletable
- [x] Straight arrows persist
- [x] New straight arrow overwrites previous one
- [x] Straight arrow deletable
- [x] Ions persists
- [x] Ions deletable
- [x] Atoms persist when dropped into canvas
- [x] Atoms movable
- [x] Atom movement correct when screen is scrolled
- [x] Atoms have blue outline when hovered
- [x] Atoms, bonds, curly arrows, straight arrows, and ions outline in red when hovered with the eraser
- [x] ‘Delete’ tooltip appears next to cursor when hovering a deletable item and eraser is on
- [ ] Undo restores previous state // TODO this no longer seems to work
- [ ] Undo and redo results in no change
- [ ] Pressing redo when not directly preceded by undo does nothing

Analytics

- [ ] When student accepts invitation, they are added to count of students
- [ ] When student visits module page, they are added to daily analytics, but their ID is not registered multiple times on multiple visits
- [ ] Cumulative 7 day unique students is counted correctly

Student module view

- [x] All sections with active reactions are visible
- [x] Sections with zero active reaction are not visible
- [x] Ticks persist
- [x] Practice link goes to correct page

Student reaction screen

- [ ] Progress shown correctly in each step
- [ ] Incorrect arrow shows failure message
- [ ] Correct arrow shows success message
- [ ] Correct arrow advances to next screen
- [ ] Final correct arrow shows final success message
- [ ] Restart correctly restarts
- [ ] Back navigation works
- [ ] Help text shown correctly
- [ ] Reaction description shown correctly
