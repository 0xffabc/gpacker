function log(data) {
  console.log(data);
}

class Obfuscator {
  
  #code = ""
  #refs = []
  
  constructor(code, death = Date.now() + 1000 * 60 * 60 * 24) {
    this.#code = code;
    this.runtimeDefence(death);
  }
  
  runtimeDefence(death) {
    log("[*] Applying runtime defence");
    const defence = `if(/deobf|relative|beaut|lelin/g.test((new Error).stack)){throw ''};try{Date.now()<${death}&&require}catch(e){`;
    this.#code = `${defence};${this.#code}}`;
  }
  
  obfuscateInt(num) {
    
    function complexInt(num) {
      const delta = num * Math.random();
      const delta2 = num - delta;
    
      return `${delta}+${delta2}`;
    }
    
    const delta = Math.floor(num / Math.floor(Math.random() * 4 + 1));
    const delta2 = num - delta;
    
    return `parseInt(${delta.toString(2)},${complexInt(2)})+parseInt(${delta2.toString(2)},${complexInt(2)})}`;
  }
  
  obfuscateString(str) {
    const string = `[${[str.split("").map(e => e.charCodeAt(0)).join("")].map(this.obfuscateInt).join(",")}]`;
    
    return `(function(_ex__){return _ex__.map(String.fromCharCode).join("")})(${string})`
  }
  
  generateName(keyword = "_fog__") {
    const qwertyAll = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    
    const index = qwertyAll[Math.ceil(qwertyAll.length * Math.random())];
    const randomInteger = Math.floor(1e5 * Math.random());
    
    return `${keyword}${index}${randomInteger}`
  }
  
  reference(value) {
    const name = this.generateName();
    
    this.#refs.push({
      name,
      value
    });
    
    return name;
  }
  
  controlFlowObfuscation(operations) {
    log("[*] Applying control flow flattering...");
    this.ops = [];
    let index = 0;
    
    for (const operation of operations) {
      this.ops.push({
        opcode: index += Math.floor(Math.random() * 33) + 1,
        action: operation
      });
    }
    
    log("[!] CFF case blocks count: " + this.ops.length);

    const caseString = this.ops.map(op => `case ${this.reference(this.obfuscateInt(op.opcode))}:{${op.action};break}`).join(";");
    
    log("[*] Control flow flaterring finished");

    return `const f_op=opc=>{switch(opc){${caseString}}};for(i=0;i<MAGIC_NUMBER;i++)f_op(i)`;
  }
  
  run() {
    const func = new Function(this.#code);
    func();
  }
  
  compile() {
    log("[*] Encoding the script...");
    const textEncoder = new TextEncoder();
    
    const encodedCode = `[];${this.controlFlowObfuscation(Array.from(textEncoder.encode(this.#code)).map(char =>
      "__[" + this.reference(this.obfuscateString("push")) + "](" + this.reference(this.obfuscateInt(char)) + ")"))}`;
    const encodedData = `const __=${encodedCode};`;

    const codeExecutor = `(new ${this.reference("Function")}(__.map(String.fromCharCode)))()`;
    
    log("[*] Code parts are preparing");

    const resultedCode = `(function(${log("[*] Mapping arguments..."),this.#refs.map(e => e.name).join(",")}){${encodedData};arguments.length<=this.toString().length*MAGIC__NUMBER&&(()=>{${codeExecutor}})()})(log("[*] Mapping references to arguments..."),${this.#refs.map(e => e.value).join(",")})`;

    log("[*] Mapped " + this.#refs.length + " arguments");

    const magicRatio = resultedCode.length / this.ops.length;

    log("[*] Obfuscation has been finished!");
    return resultedCode.replace("MAGIC_NUMBER", `this.toString().length*${magicRatio}`).replace("MAGIC__NUMBER", resultedCode.length / this.#refs.length);
  }
}

module.exports = Obfuscator;
