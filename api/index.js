const app = require("./server");

app.listen(process.env.PORT || 3001, () => {
  console.log(`App listening on port ${process.env.PORT || 3001}.`); // eslint-disable-line no-console
});
