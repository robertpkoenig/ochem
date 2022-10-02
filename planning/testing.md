Landing
- [X] Introductory video works on chrome, safari, and firefox
- [X] Top sign up button leads to sign up page
- [X] Bottom sign up button leads to sign up page
- [X] Login button leads to login page
- [X] Top intro button shows intro video popup
- [X] Bottom intro button shows intro video popup

Teacher sign up
- [X] Signing up leads to Firebase authentication user created
- [X] Signing up leads to Firebase firestore user object created

Student module invitation
- [X] Module name shown correctly
- [X] Module owner name shown correctly
- [X] Signing up leads to Firebase authentication user created
- [X] Signing up leads to Firebase firestore user object created
- [X] Signing up leads to student being added to module analytics record
- [X] If student visits this page in logged in state, they are redirected to module page

Teacher/student login
- [X] Sign up link leads to sign up page
- [X] Student logged in correctly and brought to only module page
- [X] If student has more than one module, they are brought to student modules page
- [X] Teacher brought to teacher modules page

Teacher modules page
- [X] Module list shown correctly
- [X] Module document created in Firebase after creating module
- [X] Abridged module document created in Firebase after creating module
- [ ] Module analytics document created in Firebase after creating module
- [ ] Module document deleted in Firebase after deleting module
- [ ] Abridged module document deleted in Firebase after deleting module
- [ ] Module analytics document deleted in Firebase after deleting module
- [X] Modules shown in order of creation date

Teacher module editor
- [X] Module renamed in Firebase after rename triggered
- [X] Section created with correct name and order in Firebase
- [X] Order of all sections correctly updated in Firebase when section is first in the list and order is incremented
- [X] Nothing happens when section is first in the list and order is incremented
- [X] Order of all sections correctly updated in Firebase when section is in the middle of  the list and order is incremented
- [X] Order of all sections correctly updated in Firebase when section is in the middle of  the list and order is decremented
- [X] Order of all sections correctly updated in Firebase when section is last in the list and order is decremented
- [X] Nothing happens when section is last in the list and order is decremented
- [X] Section renamed in Firebase after rename triggered
- [X] Reaction created with correct name and order in Firebase
- [X] Order of all reactions correctly updated in Firebase when reaction is first in the list and order is incremented
- [X] Nothing happens when reaction is first in the list and order is incremented
- [X] Order of all reactions correctly updated in Firebase when reaction is in the middle of  the list and order is incremented
- [X] Order of all reactions correctly updated in Firebase when reaction is in the middle of  the list and order is decremented
- [X] Order of all reactions correctly updated in Firebase when reaction is last in the list and order is decremented
- [X] Nothing happens when reaction is last in the list and order is decremented
- [ ] Section document is deleted from Firebase when section deleted
- [X] Order of all subsequent sections decremented when section is deleted
- [X] Reaction document is deleted from Firebase when reaction deleted
- [X] Order of all subsequent reactions decremented when reaction is deleted
- [X] Correct student invite link is generated
- [ ] Analytics link works correctly

reaction editor
- [X] New reaction steps contains previous step contents, minus the curly arrow
- [X] New reaction step persists in database
- [X] reaction deleted in Firebase
- [X] Nothing happens when attempting to delete step if it is the last one left
- [X] step order decremented of step above one that is deleted
- [X] Single, double, and triple bonds created correctly
- [X] Bonds deletable
- [X] Curly arrow can connect from atom to atom
- [X] Curly arrow can connect from atom to bond
- [X] Curly arrow can connect from bond to bond
- [X] Curly arrow can connect from bond to atom
- [X] Curly arrows get the number when more than one
- [X] Curly arrows delete and numbers update correctly
- [X] Curly arrow persists
- [X] Curly arrow updates position with anchor elements
- [X] Curly arrow deletable
- [X] Straight arrows persist
- [X] New straight arrow overwrites previous one
- [X] Straight arrow deletable
- [X] Ions persists
- [X] Ions deletable
- [X] Atoms persist when dropped into canvas
- [X] Atoms movable
- [X] Atom movement correct when screen is scrolled
- [X] Atoms have blue outline when hovered
- [X] Atoms, bonds, curly arrows, straight arrows, and ions outline in red when hovered with the eraser
- [X] ‘Delete’ tooltip appears next to cursor when hovering a deletable item and eraser is on
- [ ] Undo restores previous state // TODO this no longer seems to work
- [ ] Undo and redo results in no change
- [ ] Pressing redo when not directly preceded by undo does nothing

Analytics
- [ ] When student accepts invitation, they are added to count of students
- [ ] When student visits module page, they are added to daily analytics, but their ID is not registered multiple times on multiple visits
- [ ] Cumulative 7 day unique students is counted correctly

Student module view
- [X] All sections with active reactions are visible
- [X] Sections with zero active reaction are not visible
- [X] Ticks persist
- [X] Practice link goes to correct page

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
 