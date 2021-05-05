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
    this.state.files = [];
    this.handleFiles = this.handleFiles.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
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
    rawcode = rawcode.replaceAll(';', ' ; ').replaceAll('=', ' = ');
    rawcode = rawcode.replaceAll('<', ' < ').replaceAll('>', ' > ');


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

    let className = fil[fil.indexOf("class")+1];

    
    let startClass = fil.indexOf("{");
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

  handleFiles(event)
  {
    let x = [];
    // event.preventDefault();

    this.fileInput.current.files.forEach( (f) => {
      x.push(f.name);
    });
    this.setState({
      files: x
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let filez = this.fileInput.current.files;
    for(let i=0;i<filez.length;i++)
    {
      this.showFile(filez[i])
      .then(()=>{
          // console.log(this.UMLclasses);
          if(i==filez.length-1)
          {
            const enlarge = new CustomEvent('uml', { detail: this.UMLclasses });
            window.dispatchEvent(enlarge);
            this.UMLclasses = [];
          }
      });
    }
    

  }

  showFile = async(file) => {

    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

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
        resolve();
      };

      reader.readAsText(file);
    });
    
  }

  render = () => {

    let files = this.state.files.map( (x) => <div className="file">{x}</div>);

    return (
    <div id='upload'>
      <div id="drop-area">
          <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  color: '#555',
                  // marginTop: '20px'
                }}>
            {(files.length>0?files:<div>no files uploaded</div>)}
          </div>
          <form className="my-form" onSubmit={this.handleSubmit}>
            <input type="file" id="fileElem" multiple accept=".java" 
                ref={this.fileInput} 
                onChange={this.handleFiles}/>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  marginTop: '20px'
                }}>
                  <label className="button" htmlFor="fileElem">select files</label>
                  {/* <br/> */}
                  <button className="button" type="submit">generate</button>
                </div>
            
          </form>
      </div> 
    </div>
    );
  }

  // render = () => {

  //   return (
  //   <div>
  //     <input type="file" onChange={(e) => this.showFile(e)} />
  //     <button type="button" onClick={()=>{
  //           const enlarge = new CustomEvent('uml', { detail: this.UMLclasses });
  //           window.dispatchEvent(enlarge);
  //       }}>Generate</button>
  //   </div>
  //   )
  // }
}

export default File;