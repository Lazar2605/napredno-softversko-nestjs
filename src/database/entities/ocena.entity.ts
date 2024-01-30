import { Schema, Document } from "mongoose";
import { modelNames } from "../constants/model-names"
import { RezervacijaDocument } from "./rezervacija.entity";

export const OcenaSchema = new Schema({
    brojZvezdica: {
        type: Number,
        required: true,
    },

    komentar: {
        type: String,
        required: true,
    },

    datumIVreme: {
        type: Date,
        required: true,
    },

    kupacId: {
        type: Schema.Types.ObjectId,
        required: true, 
    },

    rezervacijaId: {
        type: Schema.Types.ObjectId,
        required: true,
    }
}, { collection: 'ocene', 
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})


OcenaSchema.virtual('kupac', {
    ref: modelNames.KORISNIK,
    localField: 'kupacId',
    foreignField: '_id',
    justOne: true,
});

OcenaSchema.virtual('rezervacija', {
    ref: modelNames.REZERVACIJA,
    localField: 'rezervacijaId',
    foreignField: '_id',
    justOne: true,
});

export interface Ocena {
    brojZvezdica: number;
    komentar: string;
    datumIVreme: Date;
    kupacId: Schema.Types.ObjectId;
    rezervacijaId: Schema.Types.ObjectId;
}

export interface OcenaDocument extends Ocena, Document {
    id: string;
    rezervacija?: RezervacijaDocument;
}