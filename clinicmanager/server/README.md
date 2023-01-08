## Requirements

* [Node.js](https://nodejs.org/en/download/) (v14) => installation instructions for [Linux](https://github.com/nodesource/distributions), use installers for macOS and Windows (don't forget to restart your Bash shell)
* [MongoDB](https://www.mongodb.com/download-center/community?jmp=nav) (v4.4) must be running locally on port 27017 => installation instructions for [macOS](https://github.com/joe4dev/dit032-setup/blob/master/macOS.md#mongodb), [Windows](https://github.com/joe4dev/dit032-setup/blob/master/Windows.md#mongodb), [Linux](https://github.com/joe4dev/dit032-setup/blob/master/Linux.md#mongodb)


## Project setup

Make sure, you are in the server directory `cd server`

Installs all project dependencies specified in [package.json](./package.json).

```bash
npm install
```

## Start the server with auto-restarts for development

Automatically restarts your server if you save any changes to local files.

```bash
npm run dev
```

## Start the server

```bash
npm start
```

## Run the Postman Tests

Starts a new server on another port (default `3001`) and runs the `server` postman test collection against a test database (default `serverTestDB`).

```bash
npm test
```

> The test database is dropped before each test execution. Adjust your tests to support this clean state.

## Error Handling

* [Error Handling in Node.js](https://www.joyent.com/node-js/production/design/errors)
* [Error Handling in Express.js](https://expressjs.com/en/guide/error-handling.html)

## Debugging with VSCode

1. Set a breakpoint by clicking on the left side of a line number
2. Click *Run > Start Debugging* (Choose the "Debug Server" config if you opened the combined workspace)

> Learn more in the [VSCode Debugging Docs](https://code.visualstudio.com/docs/editor/debugging).
