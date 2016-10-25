'use strict';

import * as vscode from 'vscode';


let pasteAndIndent = () => {
    let config = vscode.workspace.getConfiguration('pasteAndIndent');
    let editor = vscode.window.activeTextEditor;
    let start = editor.selection.anchor;
    let offset = start.character;
    let indentChar = editor.options.insertSpaces ? ' ' : '\t';
    let startLine = editor.document.getText(new vscode.Selection(start.line, 0, start.line, start.character));
    let startChar = startLine.search(/\S/);

    if (startChar > -1) {
        offset = startChar;
    }
    vscode.commands.executeCommand('editor.action.clipboardPasteAction').then(() => {
        let end = editor.selection.anchor;
        let selectionToIndent = new vscode.Selection(start.line, start.character, end.line, end.character);
        let selectedText = editor.document.getText(selectionToIndent);
        let leadingSpaces = []; // The amount of leading space the line has
        let xmin; // The minimum amount of leading space amongst the non-empty lines
        let linesToIndent = selectedText.split('\n');

        if (linesToIndent.length <= 1) {
            return; // Skip indentation
        }
        // Find out what is the minimum leading space of the non empty lines (xmin)
        linesToIndent.forEach((line, index) => {
            let _xmin = line.search(/\S/); // -1 means the line is blank (full of space characters)
            let numberOfTabs;
            if (_xmin !== -1) {
                // Normalize the line according to the indentation preferences
                if (editor.options.insertSpaces) {
                    numberOfTabs = line.substring(0, _xmin).split(/\t/).length - 1;
                    _xmin += numberOfTabs * (Number(editor.options.tabSize) - 1);
                } else {
                    // BUG: This works only if the pasted code has the same tabSize with the document
                    // TODO: Find a way to detect pasted code's tabSize and adjust accordingly
                    _xmin = Math.floor(_xmin / Number(editor.options.tabSize));
                }
                if (index > 0 && (typeof xmin === 'undefined' || xmin > _xmin)) {
                    xmin = _xmin;
                }
            }
            leadingSpaces[index] = _xmin;
        });
        if (xmin === 0 && offset === 0) {
            return; // Skip indentation
        }
        linesToIndent = linesToIndent.map((line, index) => {
            let x = leadingSpaces[index];
            let chars = (index === 0 || x === -1) ? '' : indentChar.repeat(x - xmin + offset);

            return line.replace(/^\s*/, chars);
        });
        editor.edit((editBuilder: vscode.TextEditorEdit) => {
            editBuilder.replace(selectionToIndent, linesToIndent.join('\n'));
            if (linesToIndent.length > 1 && config.get('selectAfter', false)) {
                editor.selection = new vscode.Selection(start.line + 1, 0, end.line, linesToIndent[linesToIndent.length - 1].length);
            }
        });
    });
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('pasteAndIndent.action', pasteAndIndent));
}

export function deactivate() {
}
