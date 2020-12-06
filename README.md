<p align="center">
  <a href="#">
    <img src="user-client/src/resources/default-monochrome.svg" alt="natforums logo" width="400" height="200">
  </a>

  <h3 align="center">Community Forums</h3>

  <p align="center">
    Start your own community online with natforums.
    <br />
    <br />
    <a href="https://natforums.netlify.app">View Demo</a>
    ·
    <a href="https://github.com/izkshitiz/natforums/issues">Report Bug</a>
    ·
    <a href="https://github.com/izkshitiz/natforums/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>


## About
<p align="center">
  <a href="#">
    <img src="user-client/public/readme/natforums%20vid.gif" alt="Logo" >
  </a>
</p>


Building a community around your interests is now easy with natforums. It provides you with platform and tools that make it easy for you to create produvtive community. 
Meanwhile, making it easy for others to find your community and participate.

 Below are some of the features of natforums:
 
 * Ranking of theads to present the best of community.
 * Readable slugs genrated from title of the thread for better SEO.
 * Customize type of file uploads your user can do.
 * Sanitizing user genrated content for better security.
 
 ### Built With

 * [Create React App](https://github.com/facebook/create-react-app)
 * [Quill](https://quilljs.com/)
 * [GraphQL](https://graphql.org/)
 * [Express](https://expressjs.com/)

## Getting Started

Softwares listed in prerequisites are required to be installed on your system before you can start using it on localhost.

### Prerequisites

[Node.js](https://nodejs.org/en/)

[mongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. Download the repo as a zip and extract it or you can clone the repo using
   ```sh
   git clone https://github.com/izkshitiz/natforums.git
   ```
2. Once you have the repo on your system, open the terminal in root directory of the repo. Now you need to install node modules in both `server` and `user-client` folder as shown in next steps.
3. Change your directory to `user-client` in terminal and install node modules
 
   ```sh
   npm install
   ```
   and then run 
   
   ```sh
   node app.js
   ```
4. Change the directory to `server` folder and again install node modules
   
   ```sh
   npm install
   ```
   and then 
   ```sh
   npm start
   ```


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [DOMPurify](https://github.com/cure53/DOMPurify)
* [react-quill](https://github.com/zenoamaro/react-quill)
* [ant-design](https://github.com/ant-design/ant-design/)
