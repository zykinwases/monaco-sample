import getMonacoEditor from "./monaco";
import * as monaco from 'monaco-editor';

export default class ConstrainedEditor {
    editor: monaco.editor.IStandaloneCodeEditor;
    constrainedRanges: monaco.IRange[];
    
    constructor(element: HTMLElement,
        url: string,
        text: string = '',
        constrainedRanges: number[][]) {
        
        this.editor = getMonacoEditor(element, url, text);
        this.constrainedRanges = constrainedRanges.map((range) => {return {startLineNumber: range[0], startColumn : range[1], endLineNumber: range[2], endColumn: range[3]}});
        this.setConstraints();
    }

    setConstraints() {
        let model = this.editor.getModel();
        if (model)
            model.onDidChangeContent(this.didChangeContentHandler.bind(this));
        this.editor.onDidChangeCursorPosition(this.didChangeCursorPosition.bind(this));
    }

    didChangeContentHandler(event: monaco.editor.IModelContentChangedEvent) {
        event.changes.forEach((change) => {
            let linesAdded = change.text.split('\n').length - 1;
            let linesRemoved = change.range.endLineNumber - change.range.startLineNumber;
            let rangeAfter: monaco.IRange = {
                startLineNumber: change.range.startLineNumber,
                startColumn: change.range.startColumn,
                endLineNumber: change.range.startLineNumber + linesAdded - linesRemoved,
                endColumn: change.range.endColumn
            }
            if (this.constrainedRanges.some((range) =>  monaco.Range.areIntersectingOrTouching(change.range, range))) {
                this.editor.trigger('whatever', 'undo', null);
            } else {
                for (let i = 0; i < this.constrainedRanges.length; i++) {
                    console.log()
                    if (change.range.endLineNumber <= this.constrainedRanges[i].startLineNumber) {
                        this.constrainedRanges[i] = {
                            startLineNumber: this.constrainedRanges[i].startLineNumber + linesAdded - linesRemoved,
                            startColumn: this.constrainedRanges[i].startColumn,
                            endLineNumber: this.constrainedRanges[i].endLineNumber + linesAdded - linesRemoved,
                            endColumn: this.constrainedRanges[i].endColumn,
                        }
                    }
                }
            };
        })
    }

    didChangeCursorPosition (event: monaco.editor.ICursorPositionChangedEvent) {
        if (this.constrainedRanges.some((range) => monaco.Range.containsPosition(range, event.position)) && 
                event.reason == monaco.editor.CursorChangeReason.NotSet && event.source == 'keyboard') {
            this.editor.setPosition({lineNumber: event.position.lineNumber, column: event.position.column-1})
        }
    }

    dispose() {
        this.editor.dispose();
    }
}