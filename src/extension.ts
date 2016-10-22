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
		let leadingSpaces = []; // The amount of leading space the line has (after the first one)
		let xmin = 0; // The minimum amount of leading space amongst the non-empty lines
		let linesToIndent = selectedText.split('\n');

		linesToIndent.forEach((line, index) => {
			if (index === 0) return;
			let _xmin = line.search(/\S/); // -1 means the line is blank (full of space characters)
			leadingSpaces[index] = _xmin;
			if (xmin > _xmin && _xmin !== -1) {
				xmin = _xmin;
			}
		});
		if (leadingSpaces.length === 0 || (xmin === 0 && offset === 0)) {
			return; // Skip indentation
		}
		linesToIndent = linesToIndent.map((line, index) => {
			if (index === 0 && startChar === -1) { // Remove first lines' leading space
				return line.replace(/^\s*/, '');
			}
			return line.replace(/^\s*/, indentChar.repeat(leadingSpaces[index] - xmin + offset));
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
