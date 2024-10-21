'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';

import path = require('path');
import { log } from 'console';

export class CopaliatViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'copaliat-chat';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(data => {
			switch (data.type) {
				case 'getContextDataAndSend':
					{
						this.sendMessage(data.prompt, this.getContextData());
						break;
					}
				case 'consoleLog':
					{
						console.log(data.value);
						break;
					}
				case 'consoleError':
					{
						console.error(data.value);
						break;
					}
				}
			});
	}

	public sendMessage(prompt: string, context_data: string | undefined) {
		if (this._view) {
			this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
			this._view.webview.postMessage({ type: 'sendMessage', prompt: prompt.trim(), context_data: context_data? context_data.trim(): undefined });
		}
	}

	public getContextData() {
		let context_data = undefined;
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
			const selection = activeEditor.selection;
			context_data = activeEditor.document.getText(selection);
		}
		return context_data;
	}	

	private _getHtmlForWebview(webview: vscode.Webview): string {

		const resourcePath = path.join(this._extensionUri.fsPath, 'media', 'chat.html');
		const webview_spSource = webview.cspSource;
		const base = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media'));

		const nonce = this.getNonce();

		const html = fs.readFileSync(resourcePath).toString()
			.replace(/\${nonce}/g, nonce)
			.replace(/\${webview.cspSource}/g, webview_spSource.toString())
			.replace(/\${base.href}/g, base.toString());

		console.log(html);
		return html;
	}

	private getNonce() {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 32; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
}
