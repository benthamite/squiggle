// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { startClient, stopClient } from "./client";

import { SquiggleEditorProvider } from "./editor";
import { registerSemanticHighlight } from "./highlight";
import { registerPreviewCommand } from "./preview";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(SquiggleEditorProvider.register(context));

  registerPreviewCommand(context);

  registerSemanticHighlight();

  startClient(context);
}

// this method is called when your extension is deactivated
export function deactivate() {
  stopClient();
}
