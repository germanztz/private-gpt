# Contributing a View Container & View

- Contribute a view container using the [viewsContainers](https://code.visualstudio.com/api/references/contribution-points#contributes.viewsContainers) extension point.
- Contribute a view using the [views](https://code.visualstudio.com/api/references/contribution-points#contributes.views) extension point.
- Register a data provider for the view using the [TreeDataProvider](https://code.visualstudio.com/api/references/vscode-api#_TreeDataProvider) API.
- Contribute actions to the view using `view/title` and `view/item/context` locations in [menus](https://code.visualstudio.com/api/references/contribution-points#contributesmenus) extension point.

## contributes.viewsContainers extension point

As of Visual Studio Code v1.23.0, you can move custom views into your own view container which will show up in the activity bar.

To do such, extension writers can add a `viewsContainers` object in the contributes section. each object will require three things:

- `id`: The name of the new view you're creating
- `title`: The name which will show up at the top of the view
- `icon`: an image which will be displayed for the view container in the activity bar

## contributes.views extension point

You must specify an identifier and name for the view. You can contribute to following locations

- `explorer`: Explorer view in the Side bar
- `debug`: Debug view in the Side bar
- `scm`: Source Control Management view in the Side bar

When the user opens the view, VS Code will then emit an activationEvent `onView:${viewId}` (e.g. `onView:nodeDependencies` for the example below). You can also control the visibility of the view by providing the `when` context value.

Following, in the views object, you can then add a field with the same string as the `id` in the `viewsContainers`.

```json
"contributes": {
    "viewsContainers": {
        "activitybar": [
            {
                "id": "copaliat",
                "title": "CoPal-IAt",
                "icon": "media/dep.svg"
            }
        ]
    },
    "views": {
        "tree-view": [
            {
                "id": "nodeDependencies",
                "name": "Node Dependencies",
                "when": "workspaceHasPackageJSON"
            }
        ]
    }
}
```

## View actions

You can contribute actions at following locations in the view

- `view/title`: Location to show actions in the view title. Primary or inline actions use `"group": "navigation"` and rest are secondary actions which are in `...` menu.
- `view/item/context`: Location to show actions for the tree item. Inline actions use `"group": "inline"` and rest are secondary actions which are in `...` menu.

You can control the visibility of these actions using the `when` property.

Examples:

```json
"contributes": {
    "commands": [
        {
            "command": "nodeDependencies.refreshEntry",
            "title": "Refresh",
            "icon": {
                "light": "resources/light/refresh.svg",
                "dark": "resources/dark/refresh.svg"
            }
        }
    ],
    "menus": {
        "view/title": [
            {
                "command": "nodeDependencies.refreshEntry",
                "when": "view == nodeDependencies",
                "group": "navigation"
            }
        ]
    }
}
```

**Note:** If you want to show an action for specific items, you can do it by defining context of a tree item using `TreeItem.contextValue` and you can specify the context value for key `viewItem` in `when` expression.

Examples:

```json
"contributes": {
    "menus": {
       "view/item/context": [
           {
                "command": "nodeDependencies.deleteEntry",
                "when": "view == nodeDependencies && viewItem == dependency"
            }
        ]
    }
}
```

## TreeDataProvider

Extension writers should register a [provider](https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider) programmatically to populate data in the view.

```typescript
vscode.window.registerTreeDataProvider('nodeDependencies', new DepNodeProvider());
```

See [nodeDependencies.ts](src/nodeDependencies.ts) for the implementation.

## TreeView

If you would like to perform some UI operations on the view programmatically, you can use `window.createTreeView` instead of `window.registerDataProvider`. This will give access to the view which you can use for performing view operations.

```typescript
vscode.window.createTreeView('ftpExplorer', {
	treeDataProvider: new FtpTreeDataProvider(),
});
```

See [ftpExplorer.ts](src/ftpExplorer.ts) for the implementation.


```bash

api_name: /_upload_file

curl -X POST http://private-gpt.127.0.0.1.nip.io/call/_upload_file -s -H "Content-Type: application/json" -d '{
  "data": [
    [handle_file('https://github.com/gradio-app/gradio/raw/main/test/test_files/sample_file.pdf')]
]}' \
  | awk -F'"' '{ print $4}'  \
  | read EVENT_ID; curl -N http://private-gpt.127.0.0.1.nip.io/call/_upload_file/$EVENT_ID

Accepts 1 parameter:

[0] any Required

The input value that is provided in the "Upload File(s)" Uploadbutton component.
Returns 1 element

The output value that appears in the "Ingested Files" Dataframe component.
api_name: /_list_ingested_files

curl -X POST http://private-gpt.127.0.0.1.nip.io/call/_list_ingested_files -s -H "Content-Type: application/json" -d '{
  "data": [
]}' \
  | awk -F'"' '{ print $4}'  \
  | read EVENT_ID; curl -N http://private-gpt.127.0.0.1.nip.io/call/_list_ingested_files/$EVENT_ID

Accepts 0 parameters:
Returns 1 element

The output value that appears in the "Ingested Files" Dataframe component.
api_name: /_deselect_selected_file

curl -X POST http://private-gpt.127.0.0.1.nip.io/call/_deselect_selected_file -s -H "Content-Type: application/json" -d '{
  "data": [
]}' \
  | awk -F'"' '{ print $4}'  \
  | read EVENT_ID; curl -N http://private-gpt.127.0.0.1.nip.io/call/_deselect_selected_file/$EVENT_ID

Accepts 0 parameters:
Returns 1 element

string

The output value that appears in the "Selected for Query or Deletion" Textbox component.
api_name: /_selected_a_file

curl -X POST http://private-gpt.127.0.0.1.nip.io/call/_selected_a_file -s -H "Content-Type: application/json" -d '{
  "data": [
]}' \
  | awk -F'"' '{ print $4}'  \
  | read EVENT_ID; curl -N http://private-gpt.127.0.0.1.nip.io/call/_selected_a_file/$EVENT_ID

Accepts 0 parameters:
Returns 1 element

string

The output value that appears in the "Selected for Query or Deletion" Textbox component.
api_name: /_delete_selected_file

curl -X POST http://private-gpt.127.0.0.1.nip.io/call/_delete_selected_file -s -H "Content-Type: application/json" -d '{
  "data": [
]}' \
  | awk -F'"' '{ print $4}'  \
  | read EVENT_ID; curl -N http://private-gpt.127.0.0.1.nip.io/call/_delete_selected_file/$EVENT_ID

Accepts 0 parameters:
Returns list of 2 elements

[0]

The output value that appears in the "Ingested Files" Dataframe component.

[1] string

The output value that appears in the "Selected for Query or Deletion" Textbox component.
api_name: /_delete_all_files

curl -X POST http://private-gpt.127.0.0.1.nip.io/call/_delete_all_files -s -H "Content-Type: application/json" -d '{
  "data": [
]}' \
  | awk -F'"' '{ print $4}'  \
  | read EVENT_ID; curl -N http://private-gpt.127.0.0.1.nip.io/call/_delete_all_files/$EVENT_ID

Accepts 0 parameters:
Returns list of 2 elements

[0]

The output value that appears in the "Ingested Files" Dataframe component.

[1] string

The output value that appears in the "Selected for Query or Deletion" Textbox component.
api_name: /_set_current_mode

curl -X POST http://private-gpt.127.0.0.1.nip.io/call/_set_current_mode -s -H "Content-Type: application/json" -d '{
  "data": [
    "RAG"
]}' \
  | awk -F'"' '{ print $4}'  \
  | read EVENT_ID; curl -N http://private-gpt.127.0.0.1.nip.io/call/_set_current_mode/$EVENT_ID

Accepts 1 parameter:

[0] string Required

The input value that is provided in the "Mode" Radio component.
Returns list of 2 elements

[0] string

The output value that appears in the "System Prompt" Textbox component.

[1] string

The output value that appears in the "value_6" Textbox component.
api_name: /_set_system_prompt

curl -X POST http://private-gpt.127.0.0.1.nip.io/call/_set_system_prompt -s -H "Content-Type: application/json" -d '{
  "data": [
    "Hello!!"
]}' \
  | awk -F'"' '{ print $4}'  \
  | read EVENT_ID; curl -N http://private-gpt.127.0.0.1.nip.io/call/_set_system_prompt/$EVENT_ID

Accepts 1 parameter:

[0] string Required

The input value that is provided in the "System Prompt" Textbox component.
Returns 1 element
api_name: /chat

curl -X POST http://private-gpt.127.0.0.1.nip.io/call/chat -s -H "Content-Type: application/json" -d '{
  "data": [
    "Hello!!",
    "RAG",
    [handle_file('https://github.com/gradio-app/gradio/raw/main/test/test_files/sample_file.pdf')],
    "Hello!!"
]}' \
  | awk -F'"' '{ print $4}'  \
  | read EVENT_ID; curl -N http://private-gpt.127.0.0.1.nip.io/call/chat/$EVENT_ID

Accepts 4 parameters:

[0] string Required

The input value that is provided in the "Message" Textbox component.

[1] any Required

The input value that is provided in the "Mode" Radio component.

[2] string Required

The input value that is provided in the "Upload File(s)" Uploadbutton component.

[3] any Required

The input value that is provided in the "System Prompt" Textbox component.
Returns 1 element

string

The output value that appears in the "Message" Textbox component.
api_name: /_list_ingested_files_1

curl -X POST http://private-gpt.127.0.0.1.nip.io/call/_list_ingested_files_1 -s -H "Content-Type: application/json" -d '{
  "data": [
]}' \
  | awk -F'"' '{ print $4}'  \
  | read EVENT_ID; curl -N http://private-gpt.127.0.0.1.nip.io/call/_list_ingested_files_1/$EVENT_ID

Accepts 0 parameters:
Returns 1 element

The output value that appears in the "Ingested Files" Dataframe component.

```