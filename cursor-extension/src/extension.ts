import * as vscode from 'vscode';

let disposable: vscode.Disposable;

export function activate(context: vscode.ExtensionContext) {
    console.log('Nixi language extension is now active!');

    // Register command for compiling Nixi files
    let compileCommand = vscode.commands.registerCommand('nixi.compile', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            if (document.languageId === 'nixi') {
                const config = vscode.workspace.getConfiguration('nixi');
                const compilerPath = config.get<string>('compilerPath', 'nixi');
                
                const terminal = vscode.window.createTerminal('Nixi Compiler');
                terminal.sendText(`${compilerPath} "${document.fileName}"`);
                terminal.show();
            } else {
                vscode.window.showErrorMessage('This command only works with .nixi files');
            }
        }
    });

    // Register command for running Nixi files
    let runCommand = vscode.commands.registerCommand('nixi.run', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            if (document.languageId === 'nixi') {
                const config = vscode.workspace.getConfiguration('nixi');
                const compilerPath = config.get<string>('compilerPath', 'nixi');
                
                const terminal = vscode.window.createTerminal('Nixi Runner');
                terminal.sendText(`${compilerPath} "${document.fileName}"`);
                terminal.show();
            } else {
                vscode.window.showErrorMessage('This command only works with .nixi files');
            }
        }
    });

    // Register command for compiling to JavaScript
    let compileToJSCommand = vscode.commands.registerCommand('nixi.compileToJS', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            if (document.languageId === 'nixi') {
                const config = vscode.workspace.getConfiguration('nixi');
                const compilerPath = config.get<string>('compilerPath', 'nixi');
                
                const outputFileName = document.fileName.replace(/\\.nixi$/, '.js');
                
                const terminal = vscode.window.createTerminal('Nixi JS Compiler');
                terminal.sendText(`${compilerPath} --compile "${document.fileName}" > "${outputFileName}"`);
                terminal.show();
                
                vscode.window.showInformationMessage(`Compiling ${document.fileName} to ${outputFileName}`);
            } else {
                vscode.window.showErrorMessage('This command only works with .nixi files');
            }
        }
    });

    context.subscriptions.push(compileCommand, runCommand, compileToJSCommand);

    // Status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(code) Nixi";
    statusBarItem.tooltip = "Nixi Language Support";
    statusBarItem.command = 'nixi.run';
    statusBarItem.show();

    context.subscriptions.push(statusBarItem);

    disposable = vscode.Disposable.from();
}

export function deactivate() {
    if (disposable) {
        disposable.dispose();
    }
}