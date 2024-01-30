import { Schema } from "mongoose";
import { Korisnik, KorisnikDocument } from "./korisnik.entity";
import { pol } from "../enums/pol.enum";
import { BrojTelefonaSchema } from "../schemas/broj-telefona.schema";
import { AdresaSchema } from "../schemas/adresa.schema";
import { modelNames } from "../constants/model-names";


export const ProdavacSchema = new Schema<Prodavac>({
    ime: {
        type: String,
        required: true,
    },

    prezime: {
        type: String,
        required: true,
    },

    imejl: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },

    lozinka: {
        type: String,
        required: true,
        select: false,
    },

    hashZaResetLozinke: {
        type: String,
        select: false, 
    },

    kljucProfilneSlike: {
        type: String,
    },

    adresa: {
        type: AdresaSchema,
        required: true,
    },

    brojTelefona: {
        type: BrojTelefonaSchema,
        required: true,
    },

    pol: {
        type: String,
        required: true,
        enum: pol,
    },

    jmbg: {
        type: String,
        required: true,
    },

    nazivPG: {
        type: String,
        required: true,
    },

    registatskiBrojPG: {
        type: String,
        required: true,
    },

    brojRacuna: {
        type: String,
    },

    cenaDostave: {
        type: Number,
        required: true,
    },

    prosecnaOcena: {
        type: Number,
        required: true,
        default: 0
    },

    dostupan: {
        type: Boolean,
        required: true,
        default: false,
        select: false,
    }

}, { 
    collection: 'prodavci' ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

ProdavacSchema.virtual('proizvodi', {
    ref: modelNames.PROIZVOD,
    localField: 'proizvodiIds',
    foreignField: '_id',
});

export interface Prodavac extends Korisnik{
    nazivPG: string;
    registatskiBrojPG: string;
    brojRacuna: string;
    cenaDostave: number;
    prosecnaOcena: number;
    proizvodiIds: Schema.Types.ObjectId[];
    dostupan: boolean;
}

export interface ProdavacDocument extends Prodavac, KorisnikDocument, Document {
    id: string;
}