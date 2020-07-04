import * as vscode from 'vscode';
import { ALFullSyntaxTreeNodeExt } from '../AL Code Outline Ext/alFullSyntaxTreeNodeExt';
import { DocumentUtils } from '../Utils/documentUtils';
import { ALFullSyntaxTreeNode } from '../AL Code Outline/alFullSyntaxTreeNode';
import { SyntaxTree } from '../AL Code Outline/syntaxTree';
import { FullSyntaxTreeNodeKind } from '../AL Code Outline Ext/fullSyntaxTreeNodeKind';
import { TextRangeExt } from '../AL Code Outline Ext/textRangeExt';
import { TypeDetective } from '../Utils/typeDetective';

export class ReturnTypeAnalyzer {
    private document: vscode.TextDocument;
    private treeNodeStart: ALFullSyntaxTreeNode;
    private treeNodeEnd: ALFullSyntaxTreeNode;
    private rangeOfTreeNodes: vscode.Range;
    private returnType: string | undefined;
    private addVariableToCallingPosition: boolean;
    private addVariableToExtractedRange: boolean;
    constructor(document: vscode.TextDocument, treeNodeStart: ALFullSyntaxTreeNode, treeNodeEnd: ALFullSyntaxTreeNode) {
        this.document = document;
        this.treeNodeStart = treeNodeStart;
        this.treeNodeEnd = treeNodeEnd;
        let rangeOfTreeNodeStart: vscode.Range = DocumentUtils.trimRange(document, TextRangeExt.createVSCodeRange(treeNodeStart.fullSpan));
        let rangeOfTreeNodeEnd: vscode.Range = DocumentUtils.trimRange(document, TextRangeExt.createVSCodeRange(treeNodeStart.fullSpan));
        this.rangeOfTreeNodes = new vscode.Range(rangeOfTreeNodeStart.start, rangeOfTreeNodeEnd.end);
        this.addVariableToCallingPosition = false;
        this.addVariableToExtractedRange = false;
        this.returnType = undefined;
    }
    public async analyze() {
        let returnTypeIf: string | undefined = await this.getReturnValueIfInsideIfStatement(this.document, this.rangeOfTreeNodes);
        if (returnTypeIf) {
            this.addVariableToExtractedRange = true;
            this.returnType = returnTypeIf;
            return;
        }
        let returnTypeExit: string | undefined = await this.getReturnTypeIfSelectionContainsExitStatement(this.document, this.rangeOfTreeNodes);
        if (returnTypeExit) {
            this.addVariableToCallingPosition = true;
            this.returnType = returnTypeExit;
            return;
        }
        if (this.treeNodeStart === this.treeNodeEnd) {
            this.returnType = await TypeDetective.findReturnTypeOfTreeNode(this.document, this.treeNodeStart);
            if (this.returnType) {
                this.addVariableToExtractedRange = true;
                return;
            }
        }
    }
    public getReturnType(): string | undefined {
        return this.returnType;
    }
    public getAddVariableToExtractedRange(): boolean {
        return this.addVariableToExtractedRange;
    }
    public getAddVariableToCallingPosition(): boolean {
        return this.addVariableToCallingPosition;
    }
    private async getReturnValueIfInsideIfStatement(document: vscode.TextDocument, rangeExpanded: vscode.Range): Promise<string | undefined> {
        let syntaxTree: SyntaxTree = await SyntaxTree.getInstance(document);
        let startSyntaxTreeNode: ALFullSyntaxTreeNode | undefined = syntaxTree.findTreeNode(rangeExpanded.start);
        let endSyntaxTreeNode: ALFullSyntaxTreeNode | undefined = syntaxTree.findTreeNode(rangeExpanded.end);
        if (!startSyntaxTreeNode || !endSyntaxTreeNode) {
            return undefined;
        }
        if (startSyntaxTreeNode === endSyntaxTreeNode) {
            return undefined;
        }
        startSyntaxTreeNode = ALFullSyntaxTreeNodeExt.reduceLevels(document, startSyntaxTreeNode, true);
        endSyntaxTreeNode = ALFullSyntaxTreeNodeExt.reduceLevels(document, endSyntaxTreeNode, false);
        if (startSyntaxTreeNode.parentNode && endSyntaxTreeNode.parentNode) {
            if (startSyntaxTreeNode.parentNode === endSyntaxTreeNode.parentNode &&
                startSyntaxTreeNode.parentNode.kind &&
                startSyntaxTreeNode.parentNode.kind === FullSyntaxTreeNodeKind.getIfStatement()) {
                return 'Boolean';
            }
        }
    }
    private async getReturnTypeIfSelectionContainsExitStatement(document: vscode.TextDocument, rangeExpanded: vscode.Range): Promise<string | undefined> {
        let syntaxTree: SyntaxTree = await SyntaxTree.getInstance(document);
        let exitStatementTreeNodes: ALFullSyntaxTreeNode[] = syntaxTree.collectNodesOfKindXInWholeDocument(FullSyntaxTreeNodeKind.getExitStatement());

        for (let i = 0; i < exitStatementTreeNodes.length; i++) {
            let exitStatementTreeNode = exitStatementTreeNodes[i];
            if (exitStatementTreeNode.fullSpan && exitStatementTreeNode.fullSpan.start) {
                let rangeOfExitStatement: vscode.Range = TextRangeExt.createVSCodeRange(exitStatementTreeNode.fullSpan);
                rangeOfExitStatement = DocumentUtils.trimRange(document, rangeOfExitStatement);
                if (rangeExpanded.contains(rangeOfExitStatement)) {
                    let methodOrTriggerTreeNode: ALFullSyntaxTreeNode | undefined = syntaxTree.findTreeNode(rangeOfExitStatement.start, [FullSyntaxTreeNodeKind.getMethodDeclaration(), FullSyntaxTreeNodeKind.getTriggerDeclaration()]);
                    if (methodOrTriggerTreeNode) {
                        let outReturnList: ALFullSyntaxTreeNode[] = [];
                        ALFullSyntaxTreeNodeExt.collectChildNodes(methodOrTriggerTreeNode, FullSyntaxTreeNodeKind.getReturnValue(), false, outReturnList);
                        if (outReturnList.length === 1) {
                            let returnValue: ALFullSyntaxTreeNode = outReturnList[0];
                            if (returnValue.childNodes && returnValue.childNodes[returnValue.childNodes.length - 1].fullSpan) {
                                let returnValueRange: vscode.Range = TextRangeExt.createVSCodeRange(returnValue.childNodes[returnValue.childNodes.length - 1].fullSpan);
                                return document.getText(returnValueRange).trim();
                            }
                        }
                    }
                }
            }
        }
        return undefined;
    }
}