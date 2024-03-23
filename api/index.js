const app = require("./server");

app.listen(process.env.PORT || 3001, () => {
  console.log(`App listening on port ${process.env.PORT || 3001}.`); // eslint-disable-line no-console
});

/*
 * TODO
 * migrate all server.js to spotify.js
 * delete api folder
 * update README, package.json, Github Action scripts to reflect changes
 */
