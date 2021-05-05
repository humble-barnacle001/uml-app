import React, {Component} from 'react';

class UMLClass
{
  constructor(classN, attr, methods, depends,supers)
  {
    this.className = classN;
    this.attributes = attr;
    this.methods = methods;
    this.dependencies = depends;
    this.parents = supers;
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
    this.classNames = [];
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
    let tokens = [];

    for(i in filraw)
    {
      if(filraw[i].trim().length > 0)
        tokens.push(filraw[i].trim());
    }
    // console.log(tokens.length);
    // console.log(tokens);
    return tokens;
  }

  getUMLClasses(tokens)
  {
    let i;

    let className = tokens[tokens.indexOf("class")+1];

    
    let startClass = tokens.indexOf("{");
    // console.log(className);

    let methods = [];
    let attrs = [];
    let dependencies = [];
    let parents = [];
    // console.log(tokens[6]);
    for(let i=0;i<startClass;i++)
    {
      if(tokens[i] === "extends")
      {
        parents.push(tokens[i+1]);
      }
    }

    let endClass = startClass + 1;
    let count = 1;

    let marker = startClass;

    let second2Brace = startClass+1+tokens.slice(startClass+1).indexOf("{");
    let endAttr = tokens.slice(0,second2Brace).lastIndexOf(";");
    let attrTokens = tokens.slice(startClass+1,endAttr+1);
    attrs = this.getAttributes(attrTokens);
    tokens.splice(startClass+1, endAttr-startClass);

    //get methods
    for(i=startClass+1;i<tokens.length;i++)
    {
      if(tokens[i].indexOf("{") !== -1)
      {
        count = count+1;
        // console.log(count);
        if(count===2)
        {
          methods.push(this.getFunctionName(tokens.slice(marker+1,i)));
        }
      }
      if(tokens[i].indexOf("}") !== -1)
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

    // console.log('bindass',startClass,endClass);
    let classTokens = tokens.slice(startClass,i).concat(attrTokens);
    // console.log(className,classTokens);
    for(let i=0;i<this.classNames.length;i++)
    {
      let classN = this.classNames[i];
      if(classTokens.indexOf(classN)>=0 && classN != className)
        dependencies.push(classN);
    }

    this.UMLclasses.push(new UMLClass(className,attrs,methods,dependencies,parents));
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

  sendUMLclasses()
  {
    const enlarge = new CustomEvent('uml', { detail: this.UMLclasses });
    window.dispatchEvent(enlarge);
    // console.log(this.UMLclasses);
  }

  getClassnames(tokens)
  {
    let classNames = [];
    // console.log(tokens[6]);
    for(let i=0;i<tokens.length;i++)
    {
      if(tokens[i] === "class")
      {
        classNames.push(tokens[i+1]);
      }
    }
    return classNames;
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
            let tokens = this.getTokens(this.code);
            // console.log(this.getClassnames(tokens));
            this.classNames = this.getClassnames(tokens);
            while(tokens.length>0)
            {
              let end = this.getUMLClasses(tokens);
              tokens = tokens.slice(end+1);
            }
            console.log(this.UMLclasses);
            // console.log('final'+this.code);
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
        // console.log('code',text);
        this.code = text+this.code;
        // let tokens = this.getTokens(text);
        // this.getClassnames(tokens);
        // while(tokens.length>0)
        // {
        //   let end = this.getUMLClasses(tokens);
        //   tokens = tokens.slice(end+1);
        // }
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