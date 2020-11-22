# immeasurable-1.0

Coding guidelines This style guide is mostly based on the standards that are currently prevalent in JavaScript and React, although some conventions are used, developers are always welcome to contribute to this guidelines with clear examples.

Branching Branch name should either be created from JIRA tasks or it should be a meaningful name.
Correct usage feature/PAYMENT-integrate-payment-gateway, feature/AUTH-integrate-login

Incorrect usage feature/spike-webview-10-May

Commit message format Every commit message should in active case. Must not be greater than 72 characters. Should summarize the code changes in commit. Reference: https://chris.beams.io/posts/git-commit Rules for committing:
Separate subject from body with a blank line Limit the subject line to 50 characters Capitalize the subject line Do not end the subject line with a period Use the imperative mood in the subject line Wrap the body at 72 characters Use the body to explain what and why vs. How

Correct usage PAYMENT : Search icon fix on recent searches, Handle recent search use cases on log out

Incorrect usage google sdk integrated”, “minor fixes

Avoid making large pull requests so that code review gets easier

Use semantic HTML elements as per W3C standards Refer to this MDN article

Correct usage

Hey this is a sample section for sections Hey this is a sample section for articles
Hey this is a sample section

for paragraphs Hey this is a sample section for the content to be rendered
Incorrect usage

Hey this is a sample section
Use JS Docs Comments Try to document every function or complex logic by adding comments to it. Comments should follow JS Docs formatting.
Correct usage For example: /**

@function initializeGoogleSdk
@param {String} src - api url of the sdk
@description Loads Google SDK script and appends to head */ function initializeGoogleSdk(src) { statements... }
Incorrect usage For example: // Initializes SDK and appends to head function initializeGoogleSdk(src) { statements... }

Meaningful Identifiers. Nomenclature should be relevant

Prefer ES6 functions strictly over conventional methods. You can contribute in updating old method code.

Prefer ternary operator if required in nested if-else loops To keep code concise and readable, we prefer ternary operator over if-else statement.

Always use React’s Prop-Types for type checking PropTypes will help you check if the desired type of prop is getting passed into your component or not

Correct usage For example: import PropTypes from 'prop-types'; class Greeting extends React.Component { render() { return (

Hello, {this.props.name}
); } }
Greeting.propTypes = { name: PropTypes.string };

Greeting.defaultProps = { name: ‘Hey’ }

Incorrect usage For example: import PropTypes from 'prop-types'; class Greeting extends React.Component { render() { return (

Hello, {this.props.name}
); } }
The above example explains the usage syntax for prop types in a component. Not all the components should have the prop types checking.

10 Use a linter to make your code easier to review Run command to run the linter and fix issues if any npm run lint

11 Perform a self code-review to ensure sanity of your feature or hotfix

12 If using JEST and enzyme, write your test cases and check coverage before committing your code. If using JEST, then run yarn run start to ensure the test cases are passed with a decent coverage (OPTIONAL)

Always destructure objects and arrays as much as possible const student = { firstname: 'Glad', lastname: 'Chinda', country: 'Nigeria' };
// Object Destructuring const { firstname, lastname, country } = student;

15.Check for logs and remove them if not required

Make sure your text editor is set to remove trailing whitespace

Maintain proper indentation of the blocks

Use utility functions extensively wherever required

19.How to start the development server in project Step 1 -- Make sure you have installed the extensions required for the project. Step 2 -- In the root directory, run npm install. This will install the core and the dev dependencies requied for the project Step 3 -- Run 'npm start' to start the development server in silence-client and open localhost:3000 in your browser. Step 4 -- Run 'npm start' to start the development server silence-server.

How to debug or run a production build in local machine Step 1 -- In the root directory, run npm run build. This will first check the lint issues in the project. If there are no lint issues found, then a build folder will be generated in the root directory. Step 2 -- The build folder is ready to be deployed. You may serve it with a static server. Run yarn global add serve Step 3 -- Run serve -s build and open the link which is generated in the CLI.
