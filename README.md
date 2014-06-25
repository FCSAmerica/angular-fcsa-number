# FCSA Number

An Angular directive that validates numbers and adds commas as thousands separator.

## Installation

#### With Bower

    bower install angular-fcsa-number

Then reference `angular-fcsa-number/src/fcsaNumber.js` in your project.

#### Manually

Copy `src/fcsaNumber.js`` into your project and reference it.

## Quick Start

Add the `fcsa-number` module as a dependency to you Angular app.
 
    angular.module('yourApp', ['fcsa-number']);

Add the `fcsa-number` attribute to textboxes you want to have validated and formatted with thousands separators.

    <input type='text' ng-model='company.employeeCount' fcsa-number />

When an invalid number is entered by the user, the form and control will become invalid and the 'fcsa-number-invalid' class will be added to the text box.

## Options

Without any options passed to it, fcsa-number will validate that the input is a valid number and will also add commas for thousand separators.

So if the user enters `1000` into the textbox and tabs out, then the value will be formatted to include the thousand separators and will display: `1,000`

If a non-number is entered in the textbox, the textbox will be invalid with the `fcsaNumber` error.

#### max

Validates the number is not above the max number.

    fcsa-number="{ max: 100 }"

 * Valid: 100
 * Invalid: 101

#### min

Validates the number is not below the min number.

    fcsa-number="{ min: -5 }"

 * Valid: -5
 * Invalid: -6

#### decimals

Validates the number does not have more than the specified number of decimals.

    fcsa-number="{ decimals: 2 }"

 * Valid: 1.23
 * Invalid: 1.234

#### digits

Validates the number does not have more than the specified number of digits.

    fcsa-number="{ digits: 2 }"

 * Valid: 76
 * Invalid: 123

## Developing

Grunt is used to compile the CoffeeScript files and run the tests. To get started run the following commands on the command line:

    // installs the required node modules
    npm install

    // installs the required bower components
    bower install

Before you start Grunt, you need to have Karma startup an instance of the Chrome browser to be used in the unit tests.

From the command line run:

    node_modules/karma/bin/karma start

Then you can start Grunt to perform the compilation and unit tests:

In another terminal window run:

    grunt watch

And now the code will be compiled and the tests will be ran anytime you save changes to the files.
