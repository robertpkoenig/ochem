OCHEM
=======================================================================================

[Ochem.io](ochem.io) is a web application for organic chemistry teachers to create interactive [arrow pushing](https://en.wikipedia.org/wiki/Arrow_pushing) excercises. Teachers can group these excercises to match the progression of lecture content. Students can use these exercises to reinforce critical concepts learned in lectures.

[Demo video](https://www.loom.com/share/f9cb6644afcd4545808693d90757ef1a?t=0)

TECHNOLOGIES
---------------------------------------------------------------------------------------

- Typescript    
- [P5.js](p5js.org)   
- Next.js              
- Firebase              
- Tailwind CSS          


LOCAL USAGE
---------------------------------------------------------------------------------------

Install [node](https://nodejs.org/en/)

Navigate to the project directory in terminal:

- Use command 'npm i' to download all node dependencies for the project
- Use command 'npm run dev' to start the application on local server port 3000
- Open http://localhost:3000/ in your browser


STRUCTURE
---------------------------------------------------------------------------------------

    ochem
    ├── canvas/             // Code for the molecule interaction canvas
    │   ├── Sketch.ts       // Setup, the central 'game loop', event listeners
    │   ├── Constants.ts    // Defines object sizes, colors, and physics constants
    │   ├── model/          // Classes and interfaces defining application state
    │   ├── view/           // Functions to draw objects on the canvas
    │   ├── controller/     // Functions to update state upon user input
    ├── components/         // React components    
    ├── context/            // Global state for the react application (not the canvas)
    │   ├── Context.ts      // Interface defining fields within the global react state
    │   ├── Provider.ts     // React wrapper to inject state into children
    ├── model/              // Interfaces for state, both in-memory and NoSQL persisted
    │   ├──  Firebase.ts    // Names of document types persisted in Firebase
    │   ├── ...
    ├── functions/          // Thematically grouped functions used by React components
    ├── pages/              // Web pages defined with the next.js pattern
    │   ├── index.tsx       // The home page
    │   ├── student/        // Pages with url prefix ochem.io/student/...
    │   ├── teacher/        // Pages with url prefix ochem.io/teacher/...  
    │   ├── teacher/        // Pages with url prefix ochem.io/teacher/...  
    ├── public/             // Files exposed through the base url
    ├── styles/             // Injects tree-shaken tailwind classes into document CSS
    ├── firebaseClient.js   // Config and setup for firebase
    └── ...                 // Project setup


- Web pages are defined using the [next.js structure](https://nextjs.org/docs/basic-features/pages)
- React essentially consists of nested javascript functions that each wrap the HTML, CSS, and JS for a given component on the page, like a form or button

IMPLEMENTATION
---------------------------------------------------------------------------------------

This project effectively comprises of two distinct applications that share state:

    The canvas:
    - the central element in the `/[teacher | student]/reactions/[reaction_id]` pages
    - where teachers create and edit exercises
    - where students practice the excercises
    - written with P5.js, which is essentially a very low-level game engine that drives an HTML5 canvas
    - written with a model-view-controller, object oriented design
    - utilizes a 'game loop' which, in each iteration, updates the model, and re-renders the updated objects in the HTML5 canvas
    
    The react application:
    - everything outside the canvas
    - in the `*/reactions/[reaction_id]` pages, react shares state with the canvas so that react buttons can manipulate behaviour on the canvas


Copyright Robert Koenig 2021
