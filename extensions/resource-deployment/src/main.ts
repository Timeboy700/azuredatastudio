/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import vscode = require('vscode');
import { ResourceDeploymentDialog } from './ui/resourceDeploymentDialog';

export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('azdata.resource.create', () => {
		let dialog = new ResourceDeploymentDialog(context);
		dialog.open();
	});
}

// this method is called when your extension is deactivated
export function deactivate(): void {

}