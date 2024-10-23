/* eslint-disable no-undef */

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
	const _chatBox = document.querySelector('.chat-box');
	let _context_data = undefined;
	let _vscode = undefined;
	let _chatHistory = undefined;


	document.getElementById('send-button').addEventListener('click', sendMessage);
	document.getElementById('chat-input').addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			sendMessage();
		}
	});

	function init() {
		try {
			_vscode = acquireVsCodeApi();
			_chatHistory = new ChatHistory(_vscode);
			_chatHistory.restoreChatHistory(_chatBox);
		} catch (e) {  logError(e); }
	}

	function sendMessage() {
		// log('sending message...');
		try {
			
			let input = document.getElementById('chat-input').value.trim();
			
			if ((input === '/fix' || input === '/explain') && !_context_data) {
				_vscode ? _vscode.postMessage({ type: 'getContextDataAndSend', prompt: input }) : false;

			}else if (input !== '') {
				if(_context_data) {
					input = `${input}: </br> <pre> ${_context_data} </pre>`;
					_context_data = undefined;
				}

				_chatHistory.add(new ChatMessage(input, 'user-message', _context_data).appendTo(_chatBox));


				// Simulate bot response
				setTimeout(function () {
					_chatHistory.add(new ChatMessage("echo "+input, 'bot-message', _context_data).appendTo(_chatBox));
				}, 1000);
			}
			document.getElementById('chat-input').value = '';
		} catch (e) { logError(e); }
	}


	// Handle messages sent from the extension to the webview
	window.addEventListener('message', event => {
		try {
			_context_data = event.data.context_data;
			switch (event.data.type) {
				case 'sendMessage':
				{
					document.getElementById('chat-input').value = event.data.prompt;
					sendMessage();
					break;
				}
				case 'getState':
				{
					false; //TODO:
				}
			}
		} catch (e) { logError(e); }
	});



	function log(message) {
		_vscode ? _vscode.postMessage({ type: 'consoleLog', value: message }) : console.log(message);

	}
	function logError(e) {
		_vscode ? _vscode.postMessage({ type: 'consoleError', value: e.message + "\n" + e.stack }) : false;
		console.error(e);
	}

	class ChatMessage {
		constructor(text, sender, context_data) {
			this.text = text;
			this.sender = sender;
			this.context_data = context_data;
			this.timestamp = new Date();
		}

		getHtmlElement() {
			// Crear un nuevo mensaje
			const messageDiv = document.createElement('div');
			messageDiv.classList.add('message', this.sender);

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
			messageText.classList.add('message-text');
			messageText.innerHTML = simpleMarkdown(this.text);

			// Armar el mensaje completo
			// messageContentDiv.appendChild(replyIcon);
			messageContentDiv.appendChild(messageText);
			messageDiv.appendChild(avatarDiv);
			messageDiv.appendChild(messageContentDiv);
			return messageDiv;
		}

		appendTo(container) {
			// Añadir el nuevo mensaje al chat
			container.appendChild(this.getHtmlElement());
			container.scrollTop = container.scrollHeight;  // Scroll hacia abajo para ver el nuevo mensaje
			return this;
		}
	}

	class ChatHistory {
		constructor(app_context) {
			this._app_context = app_context;
			if(!app_context.getState()) {app_context.setState({ chatHistory: [] });	}
			this._state = app_context.getState();
			// get workspace state memento
			// https://code.visualstudio.com/api/references/vscode-api#Memento
			// const memento = vscode.getMemento() || { chatHistory: [] };

		}

		restoreChatHistory(container) {
			this._state.chatHistory.forEach(message => {
				const newMessage = new ChatMessage(message.text, message.sender, message.context_data);
				newMessage.appendTo(container);
			});
		}

		saveState() {
			this._app_context.setState(this._state);
			this._app_context.postMessage({	command: 'saveState',
				chatHistory: this._state.chatHistory
			});
		}

		/**
		 * Adds a new message to the chat history and saves the changes.
		 * @param {ChatMessage} message The message to be added to the history.
		 */
		add(message) {
			this._state.chatHistory.push(message);
			this.saveState();
		}
	}

	init();

})();
