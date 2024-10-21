
/* eslint-disable no-undef */

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
	let vscode = false;
	let chatHistory = [];
	try {
		vscode = acquireVsCodeApi();
		const oldState = vscode.getState() || { chatHistory: [] };

		/** @type {Array<{ value: string }>} */
		chatHistory = oldState.chatHistory || [];
		// updateChatLog(chatHistory);

	} catch (e) { false; }


	document.getElementById('send-button').addEventListener('click', sendMessage);
	document.getElementById('chat-input').addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			sendMessage();
		}
	});

	function sendMessage() {
		let input = document.getElementById('chat-input').value.trim();

		if (input === '/fix' || input === '/explain') {
			vscode ? vscode.postMessage({ type: 'getContextDataAndSend', prompt: input }) : false;

		}else if (input !== '') {
			appendMessage(input, 'user-message');
			// Simulate bot response
			setTimeout(function () {
				appendMessage('Respuesta automática del bot.', 'bot-message');
			}, 1000);
		}
		document.getElementById('chat-input').value = '';
	}


	// Handle messages sent from the extension to the webview
	window.addEventListener('message', event => {
		try {
				
			const message = event.data; // The json data that the extension sent
			let prompt = message.prompt;
			const context_data = message.context_data;
			switch (message.type) {
				case 'sendMessage':
				{
					if (!prompt && !context_data) break;
					if (prompt === '/fix' || prompt === '/explain') {
						appendMessage(prompt + '\n' + context_data, 'user-message');						
					} else {
						appendMessage(prompt, 'user-message');
					}
					break;
				}

			}
		} catch (e) {
			logError(e);
		}
	});


	function appendMessage(text, className) {
		try {
			
		const chatBox = document.querySelector('.chat-box');

		// Crear un nuevo mensaje
		const messageDiv = document.createElement('div');
		messageDiv.classList.add('message', className);

		// Crear avatar
		const avatarDiv = document.createElement('div');
		avatarDiv.classList.add('avatar');
		// const avatarImg = document.createElement('img');
		// avatarImg.src = className === 'user-message' ? 'user-icon.png' : 'bot-icon.png';
		// avatarImg.alt = className === 'user-message' ? 'User' : 'Bot';
		// avatarDiv.appendChild(avatarImg);

		// Crear contenido del mensaje
		const messageContentDiv = document.createElement('div');
		messageContentDiv.classList.add('message-content');

		// Agregar icono de respuesta
		// const replyIcon = document.createElement('span');
		// replyIcon.classList.add('reply-icon');
		// replyIcon.textContent = '↩️';

		// Agregar texto del mensaje
		const messageText = document.createElement('div');
		messageText.innerHTML = simpleMarkdown(text);

		// Armar el mensaje completo
		// messageContentDiv.appendChild(replyIcon);
		messageContentDiv.appendChild(messageText);
		messageDiv.appendChild(avatarDiv);
		messageDiv.appendChild(messageContentDiv);

		// Añadir el nuevo mensaje al chat
		chatBox.appendChild(messageDiv);
		chatBox.scrollTop = chatBox.scrollHeight;  // Scroll hacia abajo para ver el nuevo mensaje
		} catch (e) {  logError(e); }
	}

	function log(message) {
		vscode ? vscode.postMessage({ type: 'consoleLog', value: message }) : console.log(message);

	}
	function logError(e) {
		vscode ? vscode.postMessage({ type: 'consoleError', value: e.message + "\n" + e.stack }) : console.error(e);
	}


})();
