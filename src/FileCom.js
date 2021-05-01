import React, {Component} from 'react';

class File extends Component {

  constructor(props) {
    super(props);
    this.code = "";
  }

  showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      // console.log(text);
      this.code = text;
      this.getClasses(text);
    };
    reader.readAsText(e.target.files[0])
  }

  getClasses(rawcode)
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
      return (el!= undefined && el!= NaN && el != null && el != '\t' && el != '\n' && el != '\b' );
    });

    let i;
    let fil = [];

    for(i in filraw)
    {
      if(filraw[i].trim().length > 0)
        fil.push(filraw[i].trim());
    }

    console.log(fil);

    let startClass = fil.indexOf("{");

    let className = fil[startClass-1];

    console.log(className);

    let methods = [];



    let endClass = startClass + 1;
    let count = 1;
    let marker = startClass;
    for(i=startClass+1;i<fil.length;i++)
    {
      if(fil[i].indexOf("{") != -1)
      {
        count = count+1;
        // console.log(count);
        if(count==2)
        {
          console.log(this.getFunctionName(fil.slice(marker+1,i)));
        }
      }
      if(fil[i].indexOf("}") != -1)
      {
        count = count-1;
        marker = i;
        // console.log(count);
      } 
      if(count==0)
      {
        endClass = i;
        break;
      }
    }
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
      if(line.indexOf("class") != -1)
        console.log(line);
    }
  }

  render = () => {

    return (
    <div>
      <input type="file" onChange={(e) => this.showFile(e)} />
    </div>
    )
  }
}

export default File;