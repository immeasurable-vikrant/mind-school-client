#### Technology stack : 

### Library - React 16

### Bundling - Webpack

### Styling - Styled components

### Routing - React router

### PWA configuration - Workbox

# Coding guidelines

This style guide is mostly based on the standards that are currently prevalent in JavaScript and React,
although some conventions are used, developers are always welcome to contribute to this guidelines with
clear examples.

---

### 1. Branching

Branch name should either be created from JIRA tasks or it should be a meaningful name.

##### Correct usage

`feature/LOYALTY-1234-integrate-loyalty-points`, `feature/AUTH-1234-integrate-otp-login-flow`

##### Incorrect usage

`feature/spike-webview-10-May`

---

### 2. Commit message format

Every commit message should in active case. Must not be greater than 72 characters. Should
summarize the code changes in commit. After a newline, it should have JIRA ticket number
followed by task description.
Reference: https://chris.beams.io/posts/git-commit

Rules for committing:

1. Separate subject from body with a blank line
2. Limit the subject line to 50 characters
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the imperative mood in the subject line
6. Wrap the body at 72 characters
7. Use the body to explain what and why vs. How

##### Correct usage

`LOYALTY-1609 : Search icon fix on recent searches, Handle recent search use cases on log out`

##### Incorrect usage

`google sdk integrated”, “minor fixes`

---

### 3. Avoid making large pull requests so that code review gets easier

---

### 4. Use semantic HTML elements as per W3C standards

Refer to this MDN article

##### Correct usage

`<section>Hey this is a sample section</section>` for sections
`<article>Hey this is a sample section</article>` for articles
`<p>Hey this is a sample section</p>` for paragraphs
`<main>Hey this is a sample section</main>` for the content to be rendered

##### Incorrect usage

`<div>Hey this is a sample section</div>`

---

### 5. Use JS Docs Comments

Try to document every function or complex logic by adding comments to it. Comments should
follow JS Docs formatting.

##### Correct usage

For example:

```sh
/**
 * @function initializeGoogleSdk
 * @param {String} `src` - api url of the sdk
 * @description Loads Google SDK script and appends to head
 */
function initializeGoogleSdk(src) {
 statements...
}
```

##### Incorrect usage

For example:

```sh
// Initializes SDK and appends to head
function initializeGoogleSdk(src) {
 statements...
}
```

---

### 6. Meaningful Identifiers. Nomenclature should be relevant

---

### 7. Prefer ES6 functions strictly over conventional methods

---

### 8. Prefer ternary operator if required in nested if-else loops

To keep code concise and readable, we prefer ternary operator over `if-else` statement.

### 9. No unnecessary props as constructor arguments in class components

Props should not be passed as constructor arguments unless you're using props in constructor
itself.

##### Correct usage

For example:

```sh
constructor(props) {
 super(props)
 this.products= this.props.products ? [...this.props.products]:[]
}
```

##### Incorrect usage

For example:

```sh
constructor(props) {
 super(props)
 this.loginCallback = this.loginCallback.bind(this)

 // props is not used anywhere but it is unwantedly used in the class's constructor
}
```

---

### 10. Always use React’s Prop-Types for type checking

PropTypes will help you check if the desired type of prop is getting passed into your component or
not

##### Correct usage

For example:

```sh
import PropTypes from 'prop-types';
class Greeting extends React.Component {
render() {
 return (
  <h1>Hello, {this.props.name}</h1>
  );
 }
}

Greeting.propTypes = {
name: PropTypes.string
};

Greeting.defaultProps = {
name: ‘Hey’
}
```

---

##### Incorrect usage

For example:

```sh
import PropTypes from 'prop-types';
class Greeting extends React.Component {
render() {
 return (
   <h1>Hello, {this.props.name}</h1>
  );
 }
}
```

---

The above example explains the usage syntax for prop types in a component. Not all the
components should have the prop types checking.

---

### 11. Use a linter to make your code easier to review

Run command to run the linter and fix issues if any

```sh
npm run lint
```

---

### 12. Perform a self code-review to ensure sanity of your feature or hotfix

---

### 13. If using JEST and enzyme, write your test cases and check coverage before committing your code.

If using JEST, then run yarn run start to ensure the test cases are passed with a decent coverage

---

### 14. Always destructure objects and arrays as much as possible

```sh
const student = {
 firstname: 'Glad',
 lastname: 'Chinda',
 country: 'Nigeria'
};

// Object Destructuring
const { firstname, lastname, country } = student;
```

---

### 15. Write as much as functional components and avoid class components as functional components are always lighter than class components

##### Class component

```sh
import React, { Component } from 'react';
class App extends Component {
const alertName = () => {
 alert('John Doe');
};
render() {
 return (
 <div>
 <h3> This is a Class Component </h3>
 <button onClick={this.alertName}> Alert </button>
 </div>
 );
}
}
export default App;
```

##### Functional component

```sh
import React from 'react';
function App() {
const alertName = () => {
 alert(' John Doe ');
};
return (
 <div>
 <h3> This is a Functional Component </h3>
 <button onClick={alertName}> Alert </button>
 </div>
);
};
export default App;
```

### 15. Check for logs and remove them if not required

---

### 16. Make sure your text editor is set to remove trailing whitespace

---

### 17. Maintain proper indentation of the blocks

---

### 18. Use utility functions extensively wherever required

---

### 19. Follow the camel casing convention in directory and file name

```sh
├── app
│   ├──MyAccount (Directory name)
    │   ├── Login (Directory name)
    │   │   ├── index.js - (Higher Order Component)
    │   │   ├── style.js - (Styled components)
    │   │   ├── Actions.js
    │   │   ├── ActionsTypes.js
    │   │   ├── ActionsCreators.js
    │   │   └── Reducer.js
    |
    │   ├── ForgotPassword (Directory name)
    │   │   ├── index.js - (Higher Order Component)
    │   │   ├── style.js - (Styled components)
    │   │   ├── Actions.js
    │   │   ├── ActionsTypes.js
    │   │   ├── ActionsCreators.js
    │   │   └── Reducer.js

│   ├──Offers (Directory name)
    │   ├── CreateOffer (Directory name)
    │   │   ├── index.js - (Higher Order Component)
    │   │   ├── style.js - (Styled components)
    │   │   ├── Card.js
    │   │   ├── Actions.js
    │   │   ├── ActionsTypes.js
    │   │   ├── ActionsCreators.js
    │   │   ├── Reducer.js
    |   |
    │   ├── ViewOffer (Directory name)
    │   │   ├── index.js - (Higher Order Component)
    │   │   ├── style.js - (Styled components)
    │   │   ├── Card.js
    │   │   ├── Actions.js
    │   │   ├── ActionsTypes.js
    │   │   ├── ActionsCreators.js
    │   │   ├── Reducer.js
```

---

### 20. For those who are using SSH key for Gitlab

You will need to add a new file `~/.ssh/config` and put the following content in that file:

`Host gitlab.com`

`Hostname altssh.gitlab.com`

`User git`

`Port 443`

`PreferredAuthentications publickey`
`IdentityFile ~/.ssh/id_rsa.pub`

This will remove the timeout error when using SSH key. Further if you want to read check the following link.

https://about.gitlab.com/blog/2016/02/18/gitlab-dot-com-now-supports-an-alternate-git-plus-ssh-port/

---

### 21. Setup extensions for VSCode

Please follow these steps which will install your extensions

Step 1 -- In VS Code Press `Command + Shift + P`, then select `Shell Command: Install 'code' command in PATH`

Step 2 -- In the root directory of `tcp-pwa-desktop` run `sh .vscode/extensions.sh` This will install the extensions required for the development.

Step 3 -- Restart VS Code

After installing extensions, run `Command + S` in all the changed files

---

### 22. How to start the development server in project

Step 1 -- Make sure you have installed the extensions required for the project as described in the previous point number 21.

Step 2 -- In the root directory, run `npm install`. This will install the core and the dev dependencies requied for the project

Step 3 -- Run 'npm run start' to start the development server and open `localhost:3000` in your browser.

---

### 23. How to debug or run a production build in local machine

Step 1 -- In the root directory, run `npm run build`. This will first check the lint issues in the project. If there are no lint issues found, then a `build` folder will be generated in the root directory.

Step 2 -- The build folder is ready to be deployed. You may serve it with a static server. Run `yarn global add serve`

Step 3 -- Run `serve -s build` and open the link which is generated in the CLI.
