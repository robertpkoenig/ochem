# User

- uuid
- type
- first name
- last name
- university
- email


For the student, when they accept an invitation, it adds the module list to their list of modules

Then, when the student is getting their modules, it just does where("moduleId", "in", user.modules)

firestore user should replace the auth user in the context


Analytics Object

- module ID
- studentIds
- dates
    {
        {date: [array of studentIds]}
    }

I think that I can do this by simply calling 


const analyticsDocRef = doc(db, "analyticsRecords", moduleId);
await updateDoc(analyticsDocRef, {
    dates: arrayUnion("greater_virginia")
})





