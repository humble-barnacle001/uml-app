import logo from './logo.svg';
import './App.css';
import p5 from 'p5';
import React, {Component} from 'react';
import File from './FileCom';


class UMLClass
{
  constructor()
  {
    this.className = "";
    this.attributes = [];
    this.methods = [];
  }
}

class Sketch extends Component {
  state = {

  }
  constructor()
  {
      super();
      this.myRef = React.createRef();
      this.state.UMLs = [];
      this.genUMLs = this.genUMLs.bind(this);
  }

  componentDidMount()
  {
    // let uml = new UMLClass();
    // console.log(uml);
    window.addEventListener('uml', (e) => {
      console.log('bc');
      this.state.UMLs = e.detail;
      console.log(this.state.UMLs);
    });
  }

  drawUML(uml,p,x,y)
  {
    let ay = y;
    let maxSize=0;


    y += 30;

    p.noStroke();
    p.fill(255);
    p.textSize(15);
    p.textAlign(p.LEFT);

    let i;
    for( i in uml.attributes)
    {
      maxSize = Math.max(maxSize,uml.attributes[i].length);
      p.text(uml.attributes[i], x+5, y+20);
      y+= 20;
    } 

    let cy = y;
    y += 10;

    for( i in uml.methods)
    {
      maxSize = Math.max(maxSize,uml.methods[i].length);
      p.text(uml.methods[i], x+5, y+20);
      y+= 20;
    } 

    maxSize = Math.max(maxSize,uml.className.length)*10;

    p.textSize(20);
    p.textAlign(p.CENTER);
    p.text(uml.className, (2*x+maxSize)/2, ay+20);

    p.stroke(255);
    p.fill('#111');
    p.blendMode(p.SCREEN);
    p.rect(x, ay, maxSize, y+10 - ay, 10);

    p.line(x,ay+28,x+maxSize,ay+28);

    p.line(x,cy+10,x+maxSize,cy+10);


    p.blendMode(p.BLEND);
    return (x+maxSize);
  }

  genUMLs()
  {
      this.sketch = new p5( p  => {
      // }
      p.setup = () => {
          p.createCanvas(1080,512).parent(this.myRef.current);
          p.background(255);
          p.textFont('Droid Sans Mono');
          let x = 30;
          let y = 30;
          p.background(0);
          for(let i=0;i<this.state.UMLs.length;i++)
          {
            let uml = this.state.UMLs[i];
            x = this.drawUML(uml,p,x,y) + 20;
          }
      };

      // p.draw = () => {

        
      //   // this.drawUML(uml,p,p.mouseX,p.mouseY);
      // }
    });
  }

  render()
  {
      return(
          <div className='App'>
              <File></File>
              <button type="button" onClick={this.genUMLs}>Draw</button>
              <div ref={this.myRef} className='rendiv' id='renderTarget' style={{
                  
                  // backgroundImage: "url('./assets/charu1.jpg')",
                  minHeight: '100vh',
                  display:'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
              }}></div>
          </div>
      )
  }
}

export default Sketch;
