import { Schema, Document } from "mongoose";
import { modelNames } from "../constants/model-names";
import { ProizvodDocument } from "./proizvod.entity";
import { KorisnikDocument } from "./korisnik.entity";
import { ProdavacDocument } from "./prodavac.entity";

export const KorpaSchema = new Schema({
    ukupnaCena: {
        type: Number,
    },

    kupacId: {
        type: Schema.Types.ObjectId,
    },

    hashZaNelogovanogKupca: {
        type: String,
    },

    prodavacId: {
        type: Schema.Types.ObjectId,
    },
    proizvodiKolicina: {
        type: [{
            proizvodId: {
                type: Schema.Types.ObjectId,
                ref: modelNames.PROIZVOD, 
                required: true
            },
            kvantitet: {
                type: Number,
                required: true,
                default: 1
            }
        }],
    }

}, 
{ 
    collection: 'korpe' ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

KorpaSchema.virtual('proizvodi', {
    ref: modelNames.PROIZVOD,
    localField: 'proizvodiKolicina.proizvodId',
    foreignField: '_id',
});

KorpaSchema.virtual('kupac', {
    ref: modelNames.KORISNIK,
    localField: 'kupacId',
    foreignField: '_id',
    justOne: true,
})

KorpaSchema.virtual('prodavac', {
    ref: modelNames.PRODAVAC,
    localField: 'prodavacId',
    foreignField: '_id',
    justOne: true,
})

export interface Korpa {
    ukupnaCena: number;
    prodavacId: Schema.Types.ObjectId;
    proizvodiKolicina:  [{
        proizvodId: Schema.Types.ObjectId;
        kvantitet: number;
    }];
    kupacId?: Schema.Types.ObjectId;
    hashZaNelogovanogKupca?: string;
}

export interface KorpaDocument extends Korpa, Document {
    id: string;
    proizvodi: [ProizvodDocument];
    kupac: KorisnikDocument;
    prodavac: ProdavacDocument;
}