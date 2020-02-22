# AWS Pricing Development Guide

First off, if you are considering hacking on the aws-pricing project: Thank You!
External contributions will ensure this project continues to be useful to as many
users as possible.

This document should help interested contributors get setup with a development environment
that they can use to test changes.

# Dependencies

These are the versions I've verified locally with, but there shouldn't be any hard
version requirements at the moment.

* Ruby 2.6.x
* npm 6.9.x
* VS Code (preferred IDE)

Add-on scripts don't (can't?) use node modules, so there are no code dependencies on additional
node modules.

# clasp setup

Development for *aws-pricing* makes use of the Google [clasp](https://github.com/google/clasp)
project to push changes and run tests in the Google App Scripts (GAS) environment. Clasp automatically
transpiles Typescript to Javascript when pushing to GAS.

## Install

```
$ npm install -g @google/clasp
```

Then enable the Google Apps Script API: https://script.google.com/home/usersettings

![Enable Apps Script API](https://user-images.githubusercontent.com/744973/54870967-a9135780-4d6a-11e9-991c-9f57a508bdf0.gif)

## Login

*Note: you will need an active Google account for the following steps.*

This will open your browser to confirm the OAuth permissions and create a `~/.clasprc.json` file that you should keep private.

```
$ clasp login
```

## Create a new Sheet + Add-on Script

Next you need to create a Google Sheet and connect this add-on script to the Sheet. This Sheet will be where you can
test new functions after you upload your local changes. The add-on script will be connected to this sheet and have
permissions linked to it.

Checkout the latest version for *aws-pricing* from Github, change into the aws-pricing directory and run the create
command.

```
$ cd aws-pricing
$ clasp create --type sheets
Created new Google Sheet: https://drive.google.com/open?id=1GXXXXXXXXXXXXXXXXcE
Created new Google Sheets Add-on script: https://script.google.com/d/13UeXXXXXXXXXXXXXXDYl/edit
```

## Push the latest changes

Whenever you make a local change, you must push it to GAS in order to test it within your Google Sheet.

We use an npm script to push changes that will: run the code generators, generate the updated HTML manual and then
run a clasp push.

```
$ npm run deploy
```

You may need to open and refresh your Google Sheets Add-on script at the URL in the previous step. The first time
it may require you to approve some additional permissions.

Refresh the Google Sheet it created and your changes should be live!

# Testing

Unfortunately there is no GAS SDK for testing locally, so all unit tests that touch GAS functions must be
run remotely in a GAS project environment.

Because test execution requires an active Google Project, I haven't setup an automatic CI flow yet. It's possible
they could be attached to an empty project and invoked from Github actions.

## Development

Tests are fairly simple, you can find the existing unit tests under the `tests/` directory for examples on
how to modify and extend the tests. There is a very minimal test framework in `tests/_framework` that can be used
to define new test suites.

The full test suite is kicked off from the `runAllTests()` method in `tests/main.ts`.

## Setup

We use clasp's *run* command to invoke the tests remotely. The run command requires an active GCP
project. Follow [the instructions](https://github.com/google/clasp/blob/master/docs/run.md#run) for
setting up a GCP project and setting the *Project ID* in order to use the *run* command.

## Running tests

We have an npm run command for invoking the tests. This command will run a full deploy which will ensure all
assets are generated and pushed to GAS first.

Run tests with:
```
$ npm run test
```

This will output the result of the test suite. Unfortunately, the exit code of `clasp run` won't reflect
the pass/fail status of the tests.

You can also run tests from the GAS console. Navigate to the file `tests/main.ts` in the console and select
`Run -> Run function -> runAllTests`. You'll need to view the logs after the test run to check status.

# Misc

## Typescript GAS types

Install the GAS types

```
npm i -S @types/google-apps-script
```

## Releasing

This should be run by the add-on owner.

```
$ npm run release -- "Changelog message"
```

That will create a new version in the console. The next step is to navigate to the GCP console and
perform `Publish as Sheets add-on` and select the new version.

While somewhat manual, we don't use the clasp publish functionality because there is a bug that
you can *never* revert to publishing via the console if you use the API once.
