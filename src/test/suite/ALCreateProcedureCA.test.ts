import * as assert from 'assert';
import * as path from 'path';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { ALCreateProcedureCA } from '../../extension/alCreateProcedureCA';
import { ALProcedure } from '../../extension/alProcedure';
import { ALTestProject } from './ALTestProject';
import { ALLanguageExtension } from '../alExtension';
import { SupportedDiagnosticCodes } from '../../extension/supportedDiagnosticCodes';
// import * as myExtension from '../extension';

suite('ALCreateProcedureCA Test Suite', function () {
	let codeunit1Document: vscode.TextDocument;
	let tableDocument: vscode.TextDocument;
	this.timeout(0);
	this.beforeAll('beforeTests', async function () {
		this.timeout(0);
		await ALLanguageExtension.getInstance().activate();

		//open the file just once
		let fileName = path.resolve(ALTestProject.dir, 'codeunit1.al');
		await vscode.workspace.openTextDocument(fileName).then(document => {
			codeunit1Document = document;
		});
		fileName = path.resolve(ALTestProject.dir, 'table.al');
		await vscode.workspace.openTextDocument(fileName).then(document => {
			tableDocument = document;
		});

		vscode.window.showInformationMessage('Start all tests of ALCodeActionProvider.');
	});

	test('getProcedureToCreate_NoParameter', async () => {
		let procedureName = 'MissingProcedureWithoutParameters';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0118.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.equal(alProcedure.returnType, undefined);
		assert.equal(alProcedure.parameters.length, 0);
	}).timeout(3000); //First time opening something can take a little bit longer
	test('getProcedureToCreate_OneParameter', async () => {
		let procedureName = 'MissingProcedureWithParameter';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0118.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.equal(alProcedure.returnType, undefined);
		assert.equal(alProcedure.parameters.length, 1);
	});
	test('getProcedureToCreate_TwoParameters', async () => {
		let procedureName = 'MissingProcedureWithParameters';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0118.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.equal(alProcedure.returnType, undefined);
		assert.equal(alProcedure.parameters.length, 2);
		assert.equal(alProcedure.parameters[0].name, 'myInteger');
		assert.equal(alProcedure.parameters[0].type, 'Integer');
		assert.equal(alProcedure.parameters[1].name, 'myBoolean');
		assert.equal(alProcedure.parameters[1].type, 'Boolean');
	});
	test('getProcedureToCreate_ReturnValue1', async () => {
		let procedureName = 'MissingProcedureWithReturn1';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0118.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.notEqual(alProcedure.returnType, undefined);
		assert.equal(alProcedure.getReturnTypeAsString(), 'Text[20]');
		assert.equal(alProcedure.parameters.length, 1);
		assert.equal(alProcedure.parameters[0].name, 'myInteger');
		assert.equal(alProcedure.parameters[0].type, 'Integer');
	});
	test('getProcedureToCreate_ReturnValue2', async () => {
		let procedureName = 'MissingProcedureWithReturn2';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0118.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.notEqual(alProcedure.returnType, undefined);
		assert.equal(alProcedure.getReturnTypeAsString(), 'Text[20]');
		assert.equal(alProcedure.parameters.length, 1);
		assert.equal(alProcedure.parameters[0].name, 'myInteger');
		assert.equal(alProcedure.parameters[0].type, 'Integer');
	});

	test('getProcedureToCreate_ReturnValueField1', async () => {
		let procedureName = 'MissingProcedureWithFieldReturn1';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0118.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.notEqual(alProcedure.returnType, undefined);
		assert.equal(alProcedure.getReturnTypeAsString(), 'Integer');
		assert.equal(alProcedure.parameters.length, 1);
		assert.equal(alProcedure.parameters[0].name, 'myInteger');
		assert.equal(alProcedure.parameters[0].type, 'Integer');
	});
	test('getProcedureToCreate_ReturnValueField2', async () => {
		let procedureName = 'MissingProcedureWithFieldReturn2';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0118.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.notEqual(alProcedure.returnType, undefined);
		assert.equal(alProcedure.getReturnTypeAsString(), 'Integer');
		assert.equal(alProcedure.parameters.length, 1);
		assert.equal(alProcedure.parameters[0].name, 'myInteger');
		assert.equal(alProcedure.parameters[0].type, 'Integer');
	});
	test('getProcedureToCreate_ReturnValueField3', async () => {
		let procedureName = 'MissingProcedureWithFieldReturn3';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0118.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.notEqual(alProcedure.returnType, undefined);
		assert.equal(alProcedure.getReturnTypeAsString(), 'Integer');
		assert.equal(alProcedure.parameters.length, 1);
		assert.equal(alProcedure.parameters[0].name, 'myInteger');
		assert.equal(alProcedure.parameters[0].type, 'Integer');
	});

	test('getProcedureToCreate_OfOtherObject', async () => {
		let procedureName = 'MissingProcedureOfOtherObject';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0132.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, false);
		assert.equal(alProcedure.returnType, undefined);
		assert.equal(alProcedure.parameters.length, 2);
		assert.equal(alProcedure.parameters[0].name, 'myInteger');
		assert.equal(alProcedure.parameters[0].type, 'Integer');
		assert.equal(alProcedure.parameters[1].name, 'myBoolean');
		assert.equal(alProcedure.parameters[1].type, 'Boolean');
		assert.equal(alProcedure.ObjectOfProcedure.name, "SecondCodeunit");
	});
	test('getProcedureToCreate_OfOtherObjectWithReturn', async () => {
		let procedureName = 'MissingProcedureOfOtherObjectWithReturn';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0132.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, false);
		assert.notEqual(alProcedure.returnType, undefined);
		assert.equal(alProcedure.getReturnTypeAsString(), "Text[20]");
		assert.equal(alProcedure.parameters.length, 2);
		assert.equal(alProcedure.parameters[0].name, 'myInteger');
		assert.equal(alProcedure.parameters[0].type, 'Integer');
		assert.equal(alProcedure.parameters[1].name, 'myBoolean');
		assert.equal(alProcedure.parameters[1].type, 'Boolean');
		assert.equal(alProcedure.ObjectOfProcedure.name, "SecondCodeunit");
	});
	test('getProcedureToCreate_MissingPublicProcedureOfSameObjectWithReturn', async () => {
		let procedureName = 'MissingPublicProcedureOfSameObjectWithReturn';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0132.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, false);
		assert.notEqual(alProcedure.returnType, undefined);
		assert.equal(alProcedure.getReturnTypeAsString(), "Text[20]");
		assert.equal(alProcedure.parameters.length, 2);
		assert.equal(alProcedure.parameters[0].name, 'myInteger');
		assert.equal(alProcedure.parameters[0].type, 'Integer');
		assert.equal(alProcedure.parameters[1].name, 'myBoolean');
		assert.equal(alProcedure.parameters[1].type, 'Boolean');
		assert.equal(alProcedure.ObjectOfProcedure.name, "FirstCodeunit");
	});

	test('getProcedureToCreate_ProcedureWithProcedureCallInside1', async () => {
		let procedureName = 'MissingProcedureWithProcedureCallInside1';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0118.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.equal(alProcedure.returnType, undefined);
		assert.equal(alProcedure.parameters.length, 1);
		assert.equal(alProcedure.parameters[0].name, 'arg');
		assert.equal(alProcedure.parameters[0].type, 'Integer');
	});
	test('getProcedureToCreate_ProcedureWithProcedureCallInside2', async () => {
		let procedureName = 'MissingProcedureWithProcedureCallInside2';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0118.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.equal(alProcedure.returnType, undefined);
		assert.equal(alProcedure.parameters.length, 2);
		assert.equal(alProcedure.parameters[0].name, 'arg');
		assert.equal(alProcedure.parameters[0].type, 'Integer');
		assert.equal(alProcedure.parameters[1].name, 'myInteger');
		assert.equal(alProcedure.parameters[1].type, 'Integer');
	});
	test('getProcedureToCreate_ProcedureWithProcedureCallInside3', async () => {
		let procedureName = 'MissingProcedureWithProcedureCallInside3';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0118.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.equal(alProcedure.returnType, undefined);
		assert.equal(alProcedure.parameters.length, 2);
		assert.equal(alProcedure.parameters[0].name, 'arg');
		assert.equal(alProcedure.parameters[0].type, 'Integer');
		assert.equal(alProcedure.parameters[1].name, 'myInteger');
		assert.equal(alProcedure.parameters[1].type, 'Integer');
	});
	test('getProcedureToCreate_ReturnValueDirectlyUsed', async () => {
		let procedureName = 'MissingProcedureWithDirectlyUsedReturnValue';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = SupportedDiagnosticCodes.AL0118.toString();
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		//TODO: Not supported yet
		assert.equal(alProcedure, undefined);
		// assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		// alProcedure = alProcedure as ALProcedure;
		// assert.equal(alProcedure.name, procedureName);
		// assert.equal(alProcedure.isLocal, true);
		//assert.notEqual(alProcedure.returnType, undefined);
		// assert.equal(alProcedure.getReturnTypeAsString(), "Integer");
		// assert.equal(alProcedure.parameters.length, 0);
	});
	test('getProcedureToCreate_CallingProcedureWithParameterIncludingBrackets', async function () {
		let procedureName = 'creatableProcedure';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic: vscode.Diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = 'AL0118';
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.equal(alProcedure.returnType, undefined);
		assert.equal(alProcedure.parameters.length, 1);
		assert.equal(alProcedure.parameters[0].name, 'LineDisplay');
		assert.equal(alProcedure.parameters[0].type, 'Option " ","DM-D101","IBM VFD (serielle Direktverbindung)"');
	});

	//Currently these tests can't run on a pipeline because the executeDefinitionProvider fails in finding the symbols.
	test('getProcedureToCreate_FieldsOfOtherAppAsParameter', async function () {
		let procedureName = 'MissingProcedureWithFieldsOfOtherAppAsParameter';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic: vscode.Diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = 'AL0118';
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.equal(alProcedure.returnType, undefined);
		assert.equal(alProcedure.parameters.length, 3);
		assert.equal(alProcedure.parameters[0].name, '"No."');
		assert.equal(alProcedure.parameters[0].type, "Code[20]");
		assert.equal(alProcedure.parameters[1].name, 'Reserve');
		assert.equal(alProcedure.parameters[1].type, 'Enum "Reserve Method"');
		assert.equal(alProcedure.parameters[2].name, '"Application Method"');
		assert.equal(alProcedure.parameters[2].type, 'Option Manual,"Apply to Oldest"');
	}); //first time interacting with the symbols and another extensin can take some time.
	test('getProcedureToCreate_FieldsOfSameAppAsParameter', async function () {
		let procedureName = 'MissingProcedureWithFieldsOfSameAppAsParameter';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic: vscode.Diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = 'AL0118';
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.equal(alProcedure.returnType, undefined);
		assert.equal(alProcedure.parameters.length, 1);
		assert.equal(alProcedure.parameters[0].name, 'MyField');
		assert.equal(alProcedure.parameters[0].type, "Integer");
	});

	test('getProcedureToCreate_TwoFieldsWithSameNameAsParameter1', async function () {
		let procedureName = 'MissingProcedureWithTwoFieldsWithSameNameAsParameter1';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic: vscode.Diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = 'AL0118';
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.equal(alProcedure.returnType, undefined);
		assert.equal(alProcedure.parameters.length, 2);
		assert.equal(alProcedure.parameters[0].name, '"No.1"');
		assert.equal(alProcedure.parameters[0].type, "Code[20]");
		assert.equal(alProcedure.parameters[1].name, '"No.2"');
		assert.equal(alProcedure.parameters[1].type, "Code[20]");
	});
	test('getProcedureToCreate_TwoFieldsWithSameNameAsParameter2', async function () {
		let procedureName = 'MissingProcedureWithTwoFieldsWithSameNameAsParameter2';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic: vscode.Diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = 'AL0118';
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.equal(alProcedure.returnType, undefined);
		assert.equal(alProcedure.parameters.length, 2);
		assert.equal(alProcedure.parameters[0].name, '"No.1"');
		assert.equal(alProcedure.parameters[0].type, "Code[20]");
		assert.equal(alProcedure.parameters[1].name, '"No.2"');
		assert.equal(alProcedure.parameters[1].type, "Code[20]");
	});

	test('getProcedureToCreate_PrimitiveTypes', async function () {
		let procedureName = 'MissingProcedureWithPrimitiveTypes';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic: vscode.Diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = 'AL0118';
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.equal(alProcedure.returnType, undefined);
		assert.equal(alProcedure.parameters.length, 4);
		assert.equal(alProcedure.parameters[0].name, 'arg1');
		assert.equal(alProcedure.parameters[0].type, "Text");
		assert.equal(alProcedure.parameters[1].name, 'arg2');
		assert.equal(alProcedure.parameters[1].type, "Integer");
		assert.equal(alProcedure.parameters[2].name, 'arg3');
		assert.equal(alProcedure.parameters[2].type, "Decimal");
		assert.equal(alProcedure.parameters[3].name, 'arg4');
		assert.equal(alProcedure.parameters[3].type, "Boolean");
	});
	test('getProcedureToCreate_EventSubscriber', async function () {
		let procedureName = 'testfuncInSubscriber';
		let rangeOfProcedureName = getRangeOfProcedureName(codeunit1Document, procedureName);
		let diagnostic: vscode.Diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = 'AL0118';
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(codeunit1Document, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.equal(alProcedure.returnType, undefined);
		assert.equal(alProcedure.parameters.length, 0);
	});
	test('getProcedureToCreate_Table_OnValidateOfTableField', async function () {
		let procedureName = 'CreatableProcedure1';
		let rangeOfProcedureName = getRangeOfProcedureName(tableDocument, procedureName);
		let diagnostic: vscode.Diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = 'AL0118';
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(tableDocument, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.notEqual(alProcedure.returnType, undefined);
		assert.equal(alProcedure.getReturnTypeAsString(), "Boolean");
		assert.equal(alProcedure.parameters.length, 1);
		assert.equal(alProcedure.parameters[0].name, 'MyField');
		assert.equal(alProcedure.parameters[0].type, "Integer");
	});
	test('getProcedureToCreate_Table_OnInsertTrigger', async function () {
		let procedureName = 'CreatableProcedure2';
		let rangeOfProcedureName = getRangeOfProcedureName(tableDocument, procedureName);
		let diagnostic: vscode.Diagnostic = new vscode.Diagnostic(rangeOfProcedureName, '');
		diagnostic.code = 'AL0118';
		let alProcedure = await new ALCreateProcedureCA().createProcedureObject(tableDocument, diagnostic);
		assert.notEqual(alProcedure, undefined, 'Procedure should be created');
		alProcedure = alProcedure as ALProcedure;
		assert.equal(alProcedure.name, procedureName);
		assert.equal(alProcedure.isLocal, true);
		assert.notEqual(alProcedure.returnType, undefined);
		assert.equal(alProcedure.getReturnTypeAsString(), "Integer");
		assert.equal(alProcedure.parameters.length, 2);
		assert.equal(alProcedure.parameters[0].name, 'MyField');
		assert.equal(alProcedure.parameters[0].type, "Integer");
		assert.equal(alProcedure.parameters[1].name, 'myInt');
		assert.equal(alProcedure.parameters[1].type, "Integer");
	});
	

	function getRangeOfProcedureName(document: vscode.TextDocument, procedureName: string): vscode.Range {
		let line: number | undefined;
		for (let i = 0; i < document.lineCount; i++) {
			if (document.lineAt(i).text.includes(procedureName + '(')) {
				line = i;
				break;
			}
		}
		assert.notEqual(line, undefined, 'line should be found.');
		line = line as number;
		let lineText = document.lineAt(line).text;
		let startPos = lineText.indexOf(procedureName);
		let endPos = lineText.indexOf('(', startPos);
		return new vscode.Range(line, startPos, line, endPos);
	}
});