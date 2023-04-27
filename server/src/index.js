"use strict";

const app = require("./app");
const keys = require("./keys");
const PORT = process.env.PORT || 4000;

const start = () => {
  const props = Object.keys(keys);
  for(let p of props) {
    if(!keys[p]) {
      throw new Error(`${p} var not set`);
    }
  }

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
};

start();




