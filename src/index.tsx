import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import ConstrainedEditor from "./constrainedMonaco"; 
import mdit from 'markdown-it'

function Editor(props: {url: string}) {
    const divEl = useRef<HTMLDivElement>(null);
    //any type because don't want to import monaco here
    let constrainedEditor: any;
    const [text, changeText] = useState('abcd\n## qwerty\nqkwjqwjr')
  
    useEffect(() => {
      let text: string = 'abcd\n## qwerty\nqkwjqwjr';
  
      if (divEl.current != null) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        constrainedEditor = new ConstrainedEditor(divEl.current, props.url, text, [[2, 1, 3, 0]]);
      }

      constrainedEditor.editor.getModel().onDidChangeContent((event: any) => {
        changeText(constrainedEditor.editor.getValue())
      })

      return () => {
        constrainedEditor.dispose();
      };
    }, []);

    let md = new mdit();
    let result = md.render('# markdown-it rulezz!')
  
    return <div>
        <iframe className="preview" srcDoc={md.render(text)}></iframe> :
        <div className="editor" ref={divEl}></div> 
    </div>; 
  }

ReactDOM.render(
  <Editor url='0.0.0.0'></Editor>,
  document.getElementById("root"),
);
