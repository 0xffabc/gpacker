const fs = require("fs");
const GPacker = require("src/gpacker.js");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question("Enter file path", path => {
  console.log((new GPacker(fs.readFileSync(path))).compile());
  readline.close();
});
