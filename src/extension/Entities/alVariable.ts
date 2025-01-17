export class ALVariable {
    public name: string | undefined;
    public type: string;
    public isLocal: boolean = false;
    public isVar: boolean = false;
    public canBeVar: boolean = false;
    public procedure: string | undefined;
    public memberAttributes: string[] = [];
    public isResultParameter: boolean = false;
    constructor(name: string | undefined, type: string);
    constructor(name: string | undefined, type: string, memberAttributes: string[]);
    constructor(name: string | undefined, type: string, procedure: string | undefined, isVar: boolean);
    constructor(name: string | undefined, type: string, procedure: string | undefined, isVar: boolean, canBeVar: boolean);
    constructor(name: string | undefined, type: string, procedure: string | undefined, isVar: boolean, memberAttributes: string[]);
    public constructor(...args: any[]) {
        this.name = args[0];
        this.type = args[1];
        switch (args.length) {
            case 3:
                this.memberAttributes = args[2]
                break;
            case 4:
                this.procedure = args[2]
                this.isVar = args[3];
                break;
            case 5:
                this.procedure = args[2];
                this.isVar = args[3];
                if (typeof (args[4]) == 'boolean')
                    this.canBeVar = args[4];
                else
                    this.memberAttributes = args[4];
                break;
            default:
                break;
        }
        this.isLocal = this.procedure !== undefined
    }

    public getVariableDeclarationString(indent: string = ''): string {
        let declarationString = indent;
        for (const memberAttribute of this.memberAttributes)
            declarationString += memberAttribute + '\r\n' + indent;
        declarationString += this.name + ": " + this.type;
        return declarationString;
    }
    public getParameterDeclarationString(indent: string = ''): string {
        let declarationString = indent;
        if (this.isVar) {
            declarationString = "var ";
        }
        declarationString += this.name + ": " + this.type;
        return declarationString;
    }
    public getTypeShort(): string {
        return this.type.split(' ')[0].split('[')[0]
    }
    public getNameOrEmpty(): string {
        return this.name == undefined ? "" : this.name
    }
    public sanitizeName(): ALVariable {
        if (this.name == undefined)
            return this
        this.name = this.name.trim();
        this.name = this.name.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
        this.name = this.name.replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue');
        this.name = this.name.replace(/[^\w]/g, '');
        return this;
    }
}