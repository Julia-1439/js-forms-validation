# js-forms-practice

form validation done with almost entirely Javascript. HTML validations were used wherever possible, but the proofing of them was done in JS since the `novalidate` attribute was assigned to the form. 

note that removing `novalidate` prevents the DOM error messages from showing up, so it should be kept in this case. 

major concepts utilized:
- Constraint Validation API for customizing error messages, disemminating form errors, and extending past the HTML built-in validations
- OOP principles: decoupling, open-closed principle

Dev Setup

```
npm install
npx webpack # generates /dist
```