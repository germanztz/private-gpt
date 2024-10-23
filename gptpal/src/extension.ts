'use strict';

import * as vscode from 'vscode';
import { CopaliatViewProvider } from './copaliatViewProvider';

import path = require('path');


export function activate(context: vscode.ExtensionContext) {

	const provider = new CopaliatViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(CopaliatViewProvider.viewType, provider));

	context.subscriptions.push(
		vscode.commands.registerCommand('copaliat.sendMessage', async () => {
			const context_data = provider.getContextData();
			let promptValue = undefined;
			if (context_data) promptValue = '/explain';
			const prompt = await vscode.window.showInputBox({ value: promptValue , prompt: 'Please enter the message to be sent /fix or /explain' });
			if (prompt) {
				provider.sendMessage(prompt.trim(), context_data);
			}
		}));


}

