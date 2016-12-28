# Paste and Indent for Visual Studio Code

This extension adds *limited* support for pasting and indenting code. Much like SublimeText's `paste_and_indent`.

## Install

Via Quick Open:

1. [Download](https://code.visualstudio.com/download), install and open VS Code
2. Press `cmd+p` to open the Quick Open dialog
3. Type `ext install paste-and-indent`
4. Click the *Install* button, then the *Enable* button

Via the Extensions tab:

1. Click the extensions tab or press `cmd+shift+x`
2. Search for *paste and indent*
3. Click the *Install* button, then the *Enable* button

Via the command line:

1. Open a command-line prompt
2. Run `code --install-extension Rubymaniac.vscode-paste-and-indent`

## Usage

This extension provides one command:

```
pasteAndIndent.action
```

which does all the work. Your job is to bind it to whatever key combination you like
(note however that this command is **not** available via the Command Pallette `cmd+shift+p`).

An example is (change default *paste* with *paste and indent*):

*keybindings.json*
```json
[
    {
        "key": "cmd+v",
        "command": "pasteAndIndent.action",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "cmd+v",
        "command": "editor.action.clipboardPasteAction",
        "when": "!editorTextFocus"
    },
    {
        "key": "cmd+shift+v",
        "command": "editor.action.clipboardPasteAction",
        "when": "editorTextFocus && !editorReadonly"
    }
]
```

**Note**: Reverted to the built-in command `editor.action.clipboardPasteAction` when the editor has lost focus (the case with `cmd+F` and then paste)


## Limitations

This plugin has limitations regarding the extent at which correct indentation can be performed.
Problems arise when one tries to paste code with it's first line not on the same indentation level with the last.
Fortunatelly this is not a usual case but if you find it doesn't work as you have expected then try
enabling the setting: `pasteAndIndent.selectAfter`.

What it does is that after trying to indent properly it selects the text with
probably incorrect indentation so that you can easily hit `cmd+[` or `cmd+]`.

In order to enable it you have to open your *User Settings* (hit `cmd+,`) or the *Workspace Settings* and there
add:

```json
{
    "pasteAndIndent.selectAfter": true
}
```

## Contribute

For any bugs and feature requests please open an issue. For code contributions please create a pull request. Enjoy!

## LICENSE

MIT License

Copyright (c) rubymaniac

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
