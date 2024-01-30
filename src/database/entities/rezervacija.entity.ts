import { Schema, Document } from "mongoose";
import { KupacSchema } from "../schemas/kupac.schema";
import { Kupac } from "../interfaces/kupac.interface";
import { modelNames } from "../constants/model-names";
import { ProizvodDocument } from "./proizvod.entity";
import { statusRezervacije } from "../enums/status-rezervacije.enum";
import { ProdavacDocument } from "./prodavac.entity";

export const RezervacijaSchema = new Schema({
    ukupnaCena: {
        type: Number,
        required: true,
    },

    prodavacId: {
        type: Schema.Types.ObjectId,
        required: true,
    },

    kupac: {
        type: KupacSchema,
        required: true,
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
    },

    datum: {
        type: Date,
        required: true,
    },

    status: {
        type: String,
        default: statusRezervacije.OBRADJUJE_SE,
        enum: statusRezervacije,
        required: true,
    }

}, 
{ 
    collection: 'rezervacije' ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

RezervacijaSchema.virtual('proizvodi', {
    ref: modelNames.PROIZVOD,
    localField: 'proizvodiKolicina.proizvodId',
    foreignField: '_id',
});


RezervacijaSchema.virtual('prodavac', {
    ref: modelNames.PRODAVAC,
    localField: 'prodavacId',
    foreignField: '_id',
    justOne: true,
});

export interface Rezervacija {
    ukupnaCena: number;
    prodavacId: Schema.Types.ObjectId;
    proizvodiKolicina:  [{
        proizvodId: Schema.Types.ObjectId;
        kvantitet: number;
    }];
    kupac: Kupac;
    datum: Date;
    status: string;
}

export interface RezervacijaDocument extends Rezervacija, Document {
    id: string;
    proizvodi?: [ProizvodDocument];
    prodavac?: ProdavacDocument;
}