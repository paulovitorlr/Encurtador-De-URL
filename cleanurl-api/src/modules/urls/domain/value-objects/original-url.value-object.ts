export class OriginalUrl{
    private constructor(private readonly internalValue: string){}

    static create(value: string): OriginalUrl{
        const normalizedValue = value.trim();

        if (!normalizedValue){
            throw new Error('A URL original é obrigatória.');
        }

        let parsedUrl: URL;

        try{
            parsedUrl = new URL(normalizedValue);
        }catch{
            throw new Error ('A URL original é inválida.');
        }

        if(!['http:', 'https:'].includes(parsedUrl.protocol)){
            throw new Error('A URL deve utilizar o protocolo HTTP ou HTTPS.');
        }

        return new OriginalUrl(normalizedValue);
    }

    get value(): string{
        return this.internalValue
    }

}