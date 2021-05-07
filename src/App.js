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
      this.classes = {};
  }

  componentDidMount()
  {
    // let uml = new UMLClass();
    // console.log(uml);
    window.addEventListener('uml', (e) => {
      this.state.UMLs = e.detail;
      this.classes = {};
      // console.log(this.state.UMLs);
      this.genUMLs();
    });
  }

  drawUML(uml,p,x,y)
  {
    let ay = y;
    let ax = x;
    let maxSize=0;


    y += 30;

    p.noStroke();
    p.fill('#3c40c6');
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

    p.stroke('#3c40c6');
    p.strokeWeight(2.4);
    p.noFill();
    // p.blendMode(p.MULTIPLY);
    p.rect(x, ay, maxSize, y+10 - ay,5);

    p.line(x,ay+28,x+maxSize,ay+28);

    p.line(x,cy+10,x+maxSize,cy+10);
    let t=0,l=0;
    let midx = (2*x+maxSize)/2;
    uml.dependencies.forEach( (umlDName,i) => {
      let umlD = this.classes[umlDName];
      if(umlD)
      {
        if(x-umlD['ax']==0)
        {
          if(umlD['ay']>y)
            this.depenArrow(p,(x+30*++t),y+10,(umlD['ax']+umlD['bx'])/2,(umlD['ay']));
          else
            this.depenArrow(p,(x+30*++t),ay,(umlD['ax']+umlD['bx'])/2,(umlD['by']+10));
          // console.log((2*x+maxSize)/2,ay,(2*x+maxSize)/2,umlD['by']);
        }
        else if(x-umlD['ax']>0)
        {
          if(umlD['ay']-y>80)
          {
            this.depenArrow(p,x,ay+30*++l,(umlD['ax']+umlD['bx'])/2,umlD['ay']);
          }
          else if(ay-umlD['y']>80)
          {
            this.depenArrow(p,x,ay+30*++l,(umlD['ax']+umlD['bx'])/2,(umlD['by']+10));
          }
          else
            this.depenArrow(p,x,ay+30*++l,umlD['bx'],(umlD['ay']+umlD['by'])/2);
        }
        else
        {
          if(umlD['by']-ay>80)
          {
            this.depenArrow(p,x+maxSize,ay+30*++l,(umlD['ax']+umlD['bx'])/2,umlD['ay']);
          }
          else if(ay-umlD['by']>80)
          {
            this.depenArrow(p,x+maxSize,ay+30*++l,(umlD['ax']+umlD['bx'])/2,(umlD['by']+10));
          }
          else
            this.depenArrow(p,x+maxSize,ay+30*++l,umlD['bx'],(umlD['ay']+umlD['by'])/2);
        }
      }
    });

    uml.parents.forEach( (umlDName,i) => {
      let umlD = this.classes[umlDName];
      if(umlD)
      {
        if(x-umlD['ax']==0)
        {
          if(umlD['ay']>y)
            this.superArrow(p,(x+30*++t),y+10,(umlD['ax']+umlD['bx'])/2,(umlD['ay']));
          else
            this.superArrow(p,(x+30*++t),ay,(umlD['ax']+umlD['bx'])/2,(umlD['by']+10));
          // console.log((2*x+maxSize)/2,ay,(2*x+maxSize)/2,umlD['by']);
          
        }
        else if(x-umlD['ax']>0)
        {
          if(umlD['ay']-y>80)
          {
            this.superArrow(p,x,ay+30*++l,(umlD['ax']+umlD['bx'])/2,umlD['ay']);
          }
          else if(ay-umlD['y']>80)
          {
            this.superArrow(p,x,ay+30*++l,(umlD['ax']+umlD['bx'])/2,(umlD['by']+10));
          }
          else
            this.superArrow(p,x,ay+30*++l,umlD['bx'],(umlD['ay']+umlD['by'])/2);
        }
        else
        {
          if(umlD['by']-ay>80)
          {
            this.superArrow(p,x+maxSize,ay+30*++l,(umlD['ax']+umlD['bx'])/2,umlD['ay']);
          }
          else if(ay-umlD['by']>80)
          {
            this.superArrow(p,x+maxSize,ay+30*++l,(umlD['ax']+umlD['bx'])/2,(umlD['by']+10));
          }
          else
            this.superArrow(p,x+maxSize,ay+30*++l,umlD['bx'],(umlD['ay']+umlD['by'])/2);
        }
      }
      
    });
    p.blendMode(p.BLEND);
    return [x+maxSize,y];
  }

  superArrow(p,ax,ay,bx,by)
  {
    p.stroke('rgba(0%,0%,0%,0.5)');
    p.strokeWeight(1.4);
    // for(let i=ax;i<by;i++)
    // {
    let dis=  p.dist(ax,ay,bx,by);
    // }
    p.push();
     //start new drawing state
    var angle = p.atan2(ay - by, ax - bx); //gets the angle of the line
    p.translate(bx, by);//translates to the destination vertex
    p.rotate(angle);//
    p.line(0,0,dis,0);
    p.rotate(-p.HALF_PI);
    let offset = 20; //rotates the arrow point

    p.triangle(-offset*0.5, offset*1.5, offset*0.5, offset*1.5, 0, 0); //draws the arrow point as a triangle
    p.pop();
  }

  depenArrow(p,ax,ay,bx,by)
  {
    p.stroke('rgba(28%,70%,90%,1)');
    p.strokeWeight(1.4);
    // for(let i=ax;i<by;i++)
    // {
    let dis=  p.dist(ax,ay,bx,by);
    // }
    p.push() //start new drawing state
    var angle = p.atan2(ay - by, ax - bx); //gets the angle of the line
    p.translate(bx, by);//translates to the destination vertex
    p.rotate(angle);//

    for(let i=0;i<dis;i+20)
    {
      p.line(i,0,i+10,0);
      i+=20;
    }
    p.rotate(-p.HALF_PI);
    let offset = 20; //rotates the arrow point
    // p.line(0,0,20,20);
    p.beginShape();
    p.vertex(offset*0.5, offset*1.5);
    p.vertex(0, 0);
    p.vertex(-offset*0.5, offset*1.5);
    // p.vertex(-offset*0.5, offset);
    p.endShape();
    // p.triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
    p.pop();
  }

  genUMLs()
  {
      let parentNode = this.myRef.current;
      while (parentNode.firstChild) {
          parentNode.removeChild(parentNode.firstChild);
      }
      // console.log(this.myRef.current);
      this.sketch = new p5( p  => {
      // }
      p.setup = () => {
          p.createCanvas(4000,1000).parent(this.myRef.current);
          p.background(255);
          p.textFont('Droid Sans Mono');
          let x = 30;
          let y = 30;
          let maxX = x;
          let maxY = y;

          // p.background(0);
          for(let i=0;i<this.state.UMLs.length;i++)
          {
            let uml = this.state.UMLs[i];
            let newX, newY;
            [newX, newY] = this.drawUML(uml,p,x,y);
            this.classes[uml.className] = {'ax':x,'bx':newX,'ay':y,'by':newY};
            maxX = Math.max(maxX,newX);
            maxY = Math.max(maxY,newY);
            newY = newY + 80;
            if(newY>=600)
            {  
              x = maxX+80;
              y= 30;
            }
            else
              y = newY;
          }

          // console.log(this.classes);
          p.remove();
          maxX=maxX+30;
          maxY=maxY+30;
          p.createCanvas(maxX,maxY).parent(this.myRef.current);
          p.background(255);

          p.stroke(0,40);
          // for(let i=0;i<(maxX/10);i++)
          // {
          //   p.line(i*10,0,i*10,maxY);
          // }
          // for(let i=0;i<(maxY/10);i++)
          // {
          //   p.line(0,i*10,maxX,i*10);
          // }
          p.textFont('Droid Sans Mono');
          x = 30;
          y = 30;
          maxX=0;
          maxY=0;
          // console.clear();
          // p.background(0);
          for(let i=0;i<this.state.UMLs.length;i++)
          {
            let uml = this.state.UMLs[i];
            // console.log(uml);
            let newX, newY;
            [newX, newY] = this.drawUML(uml,p,x,y)
            maxX = Math.max(maxX,newX);
            maxY = Math.max(maxY,newY);
            newY = newY + 80;
            if(newY>=600)
            {  
              x = maxX+80;
              y= 30;
            }
            else
              y = newY;
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
              {/* <button type="button" onClick={this.genUMLs}>Draw</button> */}
              <div ref={this.myRef} className='rendiv' id='renderTarget' style={{
                  
              }}></div>
          </div>
      )
  }
}

export default Sketch;
