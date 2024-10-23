# Views & View Containers

This sample demonstrates how to implement and contribute a tree view in VS Code. This includes:

- Contributing views and view containers.
- Contributing actions in various location of the view.
- Implementing the tree data provider for the view.
- Creating and working with the view.

This sample provides following views

- Node dependencies view
- Ftp file explorer view

Following example shows Node dependencies view in CoPal-IAt View container.

![CoPal-IAt](./resources/copaliat.png)

## VS Code API

This sample uses following contribution points, activation events and APIs

### Contribution Points

- `views`
- `viewsContainers`
- `menu`
  - `view/title`
  - `view/item/context`

### Activation Events

- `onView:${viewId}`

### APIs

- `window.createTreeView`
- `window.registerTreeDataProvider`
- `TreeView`
- `TreeDataProvider`

Refer to [Usage](./USAGE.md) document for more details.

## Running the Sample

- Open this example in VS Code Insiders
- `npm install`
- `npm run watch`
- `F5` to start debugging
- Node dependencies view is shown in CoPal-IAt view container in Activity bar.
- FTP file explorer view should be shown in Explorer


## TEST

The issue "Property 'registerKeybinding' does not exist on type 'typeof commands'" is occurring because the `registerKeybinding` method does not exist on the `vscode.commands` object in the current version of the VS Code API.

In the VS Code API, keybindings are registered using the `registerCommand` method, not `registerKeybinding`. The `registerCommand` method is used to register a command that can be executed by the user, and it can be bound to a specific keybinding using the `keybindings` contribution point in the `package.json` file.

To fix this issue, you can remove the `registerKeybinding` call and instead register the keybinding in the `package.json` file. For example:

```typescript
context.subscriptions.push(
  vscode.commands.registerCommand('copaliat.sendMessage', async () => {
    // ...
  })
);
```

Then, in your `package.json` file, add the following contribution point:

```json
"contributes": {
  "keybindings": [
    {
      "command": "copaliat.sendMessage",
      "key": "ctrl+shift+enter",
      "when": "editorTextFocus"
    }
  ]
}
```

This will register the `copaliat.sendMessage` command and bind it to the `ctrl+shift+enter` keybinding when the editor has focus.