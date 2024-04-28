const fs = require("fs");
const GPacker = require("./gpacker.js");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question("Enter file path", path => {
  fs.writeFileSync(path + ".obfs.js", (new GPacker(fs.readFileSync(path))).compile());
  readline.close();
});
