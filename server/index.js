const app = require("./server");

app.listen(process.env.PORT || 3001, () => {
  console.log(`app listening on port ${process.env.PORT || 3001}`);
});
