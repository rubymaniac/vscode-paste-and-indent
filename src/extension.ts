'use strict';

import * as vscode from 'vscode';


let pasteAndIndent = () => {
    let editor = vscode.window.activeTextEditor;
    let start = editor.selection.anchor;
	let offset = start.character;
	let indentChar = editor.options.insertSpaces ? ' ' : '\t';

    vscode.commands.executeCommand('editor.action.clipboardPasteAction').then(() => {
        let end = editor.selection.anchor;
		let selectionToIndent = new vscode.Selection(start.line, start.character, end.line, end.character);
		let selectedText = editor.document.getText(selectionToIndent);
		let leadingSpaces = []; // Index is the line index and value is the amount of leading space the line has
		let xmin; // The minimum amount of leading space amongst the non-empty lines
		let linesToIndent = selectedText.split('\n');

		linesToIndent.forEach((line, index) => {
			if (index === 0) return;
			var _xmin;
			_xmin = line.search(/\S/);
			leadingSpaces[index] = _xmin;
			if (!xmin || (_xmin > -1 && _xmin < xmin)) {
				xmin = _xmin;
			}
		});
		linesToIndent = linesToIndent.map((line, index) => {
			let x = leadingSpaces[index];
			if (index === 0) { // Remove first lines' leading space
				return line.replace(/^\s*/, '');
			}
			if (xmin > -1) {
				return line.replace(/^\s*/, indentChar.repeat(x - xmin + offset));
			} else {
				return line;
			}
		});
		editor.edit((editBuilder: vscode.TextEditorEdit) => {
			editBuilder.replace(selectionToIndent, linesToIndent.join('\n'));
		});
    });
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.pasteAndIndent', pasteAndIndent));
}

export function deactivate() {
}
