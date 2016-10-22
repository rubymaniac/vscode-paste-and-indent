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

		// Find out what is the minimum leading space of the non empty lines (xmin)
		linesToIndent.forEach((line, index) => {
			let _xmin = line.search(/\S/); // -1 means the line is blank (full of space characters)
			if (index > 0 && _xmin !== -1 && (typeof xmin === 'undefined' || xmin > _xmin)) {
				xmin = _xmin;
			}
			leadingSpaces[index] = _xmin;
		});
		if (linesToIndent.length <= 1 || (xmin === 0 && offset === 0)) {
			return; // Skip indentation
		}
		linesToIndent = linesToIndent.map((line, index) => {
			let x = leadingSpaces[index];
			if (x === -1) {
				return line;
			}
			return line.replace(/^\s*/, index === 0 ? '' : indentChar.repeat(x - xmin + offset));
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
