# Checks Interface

Checks interface that displays a list of checks which have to be answered "yes" or "no".

Total code coverage: 94.3%

## Project setup

* Requirements: node 14+  
  

* Navigate to project folder
* First run `npm install`
* To use the application `npm start`


* To format code with prettier and eslint run `npm run format`
* To test the code `npm test`

## Project functional requirements
* Display a list of checks from mock api
* User can select "yes" or "no" on a check
* User can submit when all checks are "yes" or one check has "no"
* Submit sends only values that have definitive answer (yes|no)
* User must be able to navigate using keyboard keys(arrowDown|arrowUp) and select "yes" when 1 is pressed on "no" when 2 is pressed
* Success screen must be shown on successful submit
* Check is disabled unless previous check is answered with "yes"


## Derived functional requirements
* auto select first check when navigation or select key is pressed
* Initially indicated loading to the user
* Show error message when initial load fails
* Show error message when submit fails
* Show error message when no checks are available
* When check row is clicked make it active for keyboard use