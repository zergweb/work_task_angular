import { Observable } from 'rxjs';

export interface Dictionary<T> {
    [Key: string]: T;
}
// server types
export interface JsonCurrencyDto{
    CharCode: string;
    ID: string;
    Name: string;
    Nominal: number;
    NumCode: string;
    Previous: number;
    Value: number;
}

export interface XmlCurrencyDto  {
    CharCode: string[];
    Name: string[];
    Nominal: string[];
    NumCode: string[];
    Value: string[];
}

export interface JsonRateDto  {
    Valute: Dictionary<JsonCurrencyDto>;
}

export interface XmlRateDto  {
    ValCurs: { Valute: XmlCurrencyDto[] };
}

export interface Currency {
    CharCode: string;
    Nominal: number;
    Value: number;
}

// builders
export abstract class DefaultRateBuilder<TDto> {
    constructor(protected dto: TDto) {}
    abstract getCurrency(): Currency;
}

export class XmlRateBuilder extends DefaultRateBuilder<XmlRateDto> {
    getCurrency() {
        return this.dto.ValCurs.Valute
            .filter(x => x.CharCode[0] === 'EUR')
            .map((x): Currency => {
            return {
                CharCode: x.CharCode[0],
                Nominal: parseFloat(x.Nominal[0].replace(',', '.')),
                Value: parseFloat(x.Value[0].replace(',', '.'))
            };
        })[0];
    }
}

export class JsonRateBuilder extends DefaultRateBuilder<JsonRateDto> {
    public getCurrency() {
        const eurDto = this.dto.Valute.EUR;
        return {
            CharCode: eurDto.CharCode,
            Nominal: eurDto.Nominal,
            Value: eurDto.Value
        };
    }
}
