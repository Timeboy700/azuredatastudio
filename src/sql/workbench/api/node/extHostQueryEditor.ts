/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { IMainContext } from 'vs/workbench/api/node/extHost.protocol';
import { ExtHostQueryEditorShape, SqlMainContext, MainThreadQueryEditorShape } from 'sql/workbench/api/node/sqlExtHost.protocol';
import * as azdata from 'azdata';
import * as vscode from 'vscode';

export class ExtHostQueryEditor implements ExtHostQueryEditorShape  {

	private _proxy: MainThreadQueryEditorShape;
	private _nextListenerHandle: number = 0;
	private _queryListeners = new Map<number, azdata.QueryInfoListener>();

	private _nextTabHandle: number = 0;
	private _queryTabs = new Map<number, azdata.QueryInfoListener>();

	constructor(
		mainContext: IMainContext
	) {
		this._proxy = mainContext.getProxy(SqlMainContext.MainThreadQueryEditor);
	}

	public $connect(fileUri: string, connectionId: string): Thenable<void> {
		return this._proxy.$connect(fileUri, connectionId);
	}

	public $runQuery(fileUri: string): void {
		return this._proxy.$runQuery(fileUri);
	}

	public $createQueryTab(fileUri: string, tab: azdata.window.modelviewdialog.DialogTab): void {
		// this._queryTabs[this._nextTabHandle] = tab;
		this._proxy.$createQueryTab(fileUri, tab.title, tab.content);
		// this._nextListenerHandle++;
	}

	public $registerQueryInfoListener(providerId: string, listener: azdata.QueryInfoListener): void {
		this._queryListeners[this._nextListenerHandle] = listener;
		this._proxy.$registerQueryInfoListener(this._nextListenerHandle, providerId);
		this._nextListenerHandle++;
	}

	public $onExecutionPlanAvailable(handle: number, fileUri: string, planXml: string) : void {
		let listener: azdata.QueryInfoListener = this._queryListeners[handle];
		if (listener) {
			listener.onExecutionPlanAvailable(fileUri, planXml);
		}
	}

	public $onExecutionStart(handle: number, fileUri:string): void {
		let listener: azdata.QueryInfoListener = this._queryListeners[handle];
		if (listener) {
			listener.onExecutionStart(fileUri);
		}
	}

	public $onExecutionComplete(handle: number, fileUri:string): void {
		let listener: azdata.QueryInfoListener = this._queryListeners[handle];
		if (listener) {
			listener.onExecutionComplete(fileUri);
		}
	}
}
