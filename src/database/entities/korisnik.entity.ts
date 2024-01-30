import { Schema, Document } from "mongoose"
import { AdresaSchema } from "../schemas/adresa.schema"
import { BrojTelefonaSchema } from "../schemas/broj-telefona.schema"
import { pol } from "../enums/pol.enum"
import { Adresa } from "../interfaces/adresa.interface"
import { BrojTelefona } from "../interfaces/broj-telefona.interface"

export const KorisnikSchema = new Schema<Korisnik>({
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
        requited: true,
    }
}, { collection: 'korisnici' })

export interface Korisnik {
    ime: string;
    prezime: string;
    imejl: string;
    lozinka: string;
    hashZaResetLozinke: string;
    kljucProfilneSlike: string;
    adresa: Adresa;
    brojTelefona: BrojTelefona;
    pol: string;
    jmbg: string;
}

export interface KorisnikDocument extends Korisnik, Document {
    id: string;
}
