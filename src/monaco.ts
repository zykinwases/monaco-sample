import * as monaco from "monaco-editor";
//create model with text or replace model's text
export function addToEditor(url: string, text: string): void {
  let model = monaco.editor.getModel(monaco.Uri.parse(url));
  if (model === null) {
    model = initModel(url, text);
  } else {
    model.setValue(text);
  }
}

//get text from model
export function getText(url: string): string {
  let model = monaco.editor.getModel(monaco.Uri.parse(url));
  if (model !== null) {
    return model.getValue();
  } else return "";
}

//create editor to be placed on element
export default function getEditor(
  element: HTMLElement,
  url: string,
  text: string = ''
) {

  //get model if it exists
  let model = monaco.editor.getModel(monaco.Uri.parse(url));
  //create model associated with pdf-uri
  if (model === null) {
    model = initModel(url, text);
  }

  //create editor and set saving
  let editor = monaco.editor.create(element, {
    model: model
  });

  return editor;
}

//initialize model for review
function initModel(url: string, text: string = "") {
  let model = monaco.editor.createModel(text, "", monaco.Uri.parse(url));
  return model;
}