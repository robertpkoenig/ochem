# Ochem.io
## Robert Koenig (robertpkoenig@gmail.com)


### Technologies

- React
- Next.js
- Firebase
- Tailwind CSS


### Usage

Install node

Within the project directory:

- Use command 'npm i' to download all node dependencies for the project
- Use command 'npm run dev' to start the application on local server port 3000

Demo video of the application: https://www.loom.com/share/f9cb6644afcd4545808693d90757ef1a


### Structure

- Each file in the 'pages' directory constitute web pages of the site
- The file structure within pages matches the URL paths of each page, so the URL path '/teacher/modules' corresponds to the file 'teacher/modules/index.tsx'
- Page with dynamic data loaded from URL parameters have names wrapped in square brackets, so 'teacher/modules/[moduleId].tsx' corresponds the URL path 'teacher/modules/1234' where '1234' is the unique ID of the module
- Each 'page' component is a javascript function/class instance which injects html/css/js onto the page, and updates html values upon relevant javascript state changes
- 'Page' components contain their own html/css/js, and additionally incorporate other child react 'components' which themselves inject html/css/js onto the page
- Firebase autentication is performed with the React context API, and a React 'provider' component for authentication wraps the entire application in 'pages/_app.tsx'
- Server side rendering is not used for dynamic content, and instead data is fetched from Firebase on page load


Copyright Robert Koenig 2021
