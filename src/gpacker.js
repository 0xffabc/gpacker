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
    const defence = `if(/deobf|relative|beaut|lelin/g.test((new Error).stack)){throw ''};try{Date.now()<${death}&&require}catch(e){`;
    this.#code = `${defence};${this.#code}}`;
  }
  
  obfuscateInt(num) {
    
    function complexInt(num) {
      const delta = num / 2;
      const delta2 = num - delta;
    
      return `${delta}+${delta2}`;
    }
    
    const delta = Math.floor(num / Math.floor(Math.random() * 4 + 1));
    const delta2 = num - delta;
    
    log("[*] Obfuscated integer " + num);
    
    return `0x${delta.toString(16)}+0x${delta2.toString(16)}`;
  }
  
  obfuscateString(str) {
    const encoder = new TextEncoder();
    
    const string = `[${[...encoder.encode(str)].map(this.obfuscateInt).join(",")}]`;
    
    log("[*] Obfuscated string " + str);
    
    return `(function(_ex__){return (new TextDecoder).decode(new Uint8Array(_ex__))})(${string})`
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
    
    log(`[*] Argument ${name} is reference of ${value}`);
    
    return name;
  }
  
  controlFlowObfuscation(operations) {
    this.ops = [];
    let index = 0;
    
    for (const operation of operations) {
      log(`[*] Operation ${operation} queue is ${index}`);
      this.ops.push({
        opcode: index += Math.floor(Math.random() * 33) + 1,
        action: operation
      });
    }
    
    const caseString = this.ops.map(op => `case ${this.reference(this.obfuscateInt(op.opcode))}:{${op.action};break}`).join(";");
    
    return `const f_op=opc=>{switch(opc){${caseString}}};for(i=0;i<MAGIC_NUMBER;i++)f_op(i)`;
  }
  
  run() {
    const func = new Function(this.#code);
    func();
  }
  
  compile() {
    const textEncoder = new TextEncoder();
    const encodedCode = `[];${this.controlFlowObfuscation(Array.from(textEncoder.encode(this.#code)).map(char =>
      "__[" + this.reference(this.obfuscateString("push")) + "](" + this.reference(this.obfuscateInt(char)) + ")"))}`;
    const encodedData = `const __=${encodedCode};`;
    
    const codeExecutor = `_=${this.reference("new TextDecoder")};new ${this.reference("Function")}(_[${this.reference(this.obfuscateString("decode"))}](new ${this.reference("Uint8Array")}(__)))()`;
    
    const resultedCode = `(function(${this.#refs.map(e => e.name).join(",")}){${encodedData};arguments.length<=this.toString().length*MAGIC__NUMBER&&(()=>{${codeExecutor}})()})(${this.#refs.map(e => e.value).join(",")})`;
    const magicRatio = resultedCode.length / this.ops.length;
    return resultedCode.replace("MAGIC_NUMBER", `this.toString().length*${magicRatio}`).replace("MAGIC__NUMBER", resultedCode.length / this.#refs.length);
  }
}

module.exports = Obfuscator;
