import React, {Component} from 'react';

class UMLClass
{
  constructor(classN, attr, methods)
  {
    this.className = classN;
    this.attributes = attr;
    this.methods = methods;
  }
}

class File extends Component {
  state = {

  }

  constructor(props) {
    super(props);
    this.code = "";
    this.UMLclasses = [];
  }

  showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      // console.log(text);
      this.code = text;
      let tokens = this.getTokens(text);
      while(tokens.length>0)
      {
        let end = this.getClasses(tokens);
        tokens = tokens.slice(end+1);
      }
      
    };
    reader.readAsText(e.target.files[0])
  }

  getTokens(rawcode)
  {
    //remove comments
    let regex = /\/\/(.*?)\n/ig;
    rawcode = rawcode.replaceAll(regex, ' ');
    // let regex = /\/\/(.*?)\n/ig;
    // console.log(p.replaceAll(regex, ' '));
    // let lines = code.split('\n');
    rawcode = rawcode.replaceAll('(', ' ( ').replaceAll(')', ' ) ');
    rawcode = rawcode.replaceAll('{', ' { ').replaceAll('}', ' } ');
    rawcode = rawcode.replaceAll('[', ' [ ').replaceAll(']', ' ] ');
    rawcode = rawcode.replaceAll(';', ' ; ');


    var patt1 = /[\s\0\t\n\f\v]/g;
    let codeCon = rawcode.split(patt1);
    // console.log(startClass);

    var filraw = codeCon.filter(function (el) {
      return (el!== undefined && el!== NaN && el !== null && el !== '\t' && el !== '\n' && el !== '\b' );
    });

    let i;
    let fil = [];

    for(i in filraw)
    {
      if(filraw[i].trim().length > 0)
        fil.push(filraw[i].trim());
    }
    // console.log(fil.length);
    // console.log(fil);
    return fil;
  }

  getClasses(fil)
  {
    let i;
    let startClass = fil.indexOf("{");

    let className = fil[startClass-1];

    // console.log(className);

    let methods = [];
    let attrs = [];


    let endClass = startClass + 1;
    let count = 1;

    let marker = startClass;

    let second2Brace = startClass+1+fil.slice(startClass+1).indexOf("{");
    let endAttr = fil.slice(0,second2Brace).lastIndexOf(";");
    attrs = this.getAttributes(fil.slice(startClass+1,endAttr+1));
    fil.splice(startClass+1, endAttr-startClass);

    //get methods
    for(i=startClass+1;i<fil.length;i++)
    {
      if(fil[i].indexOf("{") !== -1)
      {
        count = count+1;
        // console.log(count);
        if(count===2)
        {
          methods.push(this.getFunctionName(fil.slice(marker+1,i)));
        }
      }
      if(fil[i].indexOf("}") !== -1)
      {
        count = count-1;
        marker = i;
        // console.log(count);
      } 
      if(count===0)
      {
        endClass = i;
        break;
      }
    }

    this.UMLclasses.push(new UMLClass(className,attrs,methods));
    // console.log(i);
    return i;
  }

  getAttributes(tokens)
  {
    let attr =[];
    let a =0;
    let i =0;
    for(i in tokens)
    {
      if(tokens[i] == ";")
      {
        i = parseInt(i);
        attr.push(this.getAttrString(tokens.slice(a,i+1)));
        a=i+1;
      }
    }
    return attr;
  }

  getAttrString(tokens)
  {
    let eos = tokens.lastIndexOf(";");
    let eq = tokens.lastIndexOf("=");
    let end;
    if(eq == -1)
      end = eos;
    else
      end = eq;
    let flag = true;
    let name = "";
    let i;
    for(i=end-1;i>=0;i--)
    {
      name = tokens[i] + " " + name;
      if(tokens[i] == "]")
        flag = false;
      if(tokens[i] == "[")
        flag = true;
      if(flag && tokens[i] != "[")
        break;
    }
    name += ": " + tokens.slice(0,i).join(" ");
    return name;
  }

  getFunctionName(tokens)
  {
    let brac = tokens.indexOf("(");
    let name = tokens[brac-1];
    let brac2 = tokens.indexOf(")");
    let sign = name + tokens.slice(brac,brac2+1).join(" ");
    let proto = sign + ": " +tokens.slice(0,brac-1).join(" ");
    return proto;
  }

  showOnlyClasses(code)
  {
    let lines = code.split('\n');
    let i;
    for(i in lines)
    {
      let line = lines[i];
      if(line.indexOf("class") !== -1)
        console.log(line);
    }
  }


  sendUMLclasses()
  {
    const enlarge = new CustomEvent('uml', { detail: this.UMLclasses });
    window.dispatchEvent(enlarge);
    // console.log(this.UMLclasses);
  }

  render = () => {

    return (
    <div>
      <input type="file" onChange={(e) => this.showFile(e)} />
      <button type="button" onClick={()=>{
            const enlarge = new CustomEvent('uml', { detail: this.UMLclasses });
            window.dispatchEvent(enlarge);
        }}>Generate</button>
    </div>
    )
  }
}

export default File;