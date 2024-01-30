import { Schema, Document } from "mongoose";
import { CenaSchema } from "../schemas/cena.schema";
import { Cena } from "../interfaces/cena.interface";
import { modelNames } from "../constants/model-names";
import { ProdavacDocument } from "./prodavac.entity";
import { KategorijaDocument } from "./kategorija.entity";

export const ProizvodSchema = new Schema({
    naziv: {
        type: String,
        required: true,
    },

    kategorijaId: {
        type: Schema.Types.ObjectId,
    },

    opis: {
        type: String,
    },

    cena: {
        type: CenaSchema,
        required: true,
    },

    slikaKljuc: {
        type: String,
    },

    dostupan: {
        type: Boolean,
        default: false,
        required: true,
    },

    prodavacId: {
        type: Schema.Types.ObjectId,
        required: true,
    }

}, { 
    collection: 'proizvodi' ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictPopulate: false, 
})

ProizvodSchema.virtual('prodavac', {
    ref: modelNames.PRODAVAC,
    localField: 'prodavacId',
    foreignField: '_id',
    justOne: true,
});

ProizvodSchema.virtual('kategorija', {
    ref: modelNames.KATEGORIJA,
    localField: 'kategorijaId',
    foreignField: '_id',
    justOne: true,
});



export interface Proizvod {
    naziv: string;
    kategorijaId: Schema.Types.ObjectId;
    opis: string;
    cena: Cena;
    dostupan: boolean;
}

export interface ProizvodDocument extends Proizvod, Document {
    id: string;
    prodavac?: ProdavacDocument;
    kategorija?: KategorijaDocument;

} 

