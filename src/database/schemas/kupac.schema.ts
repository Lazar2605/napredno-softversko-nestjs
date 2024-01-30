import { Schema } from 'mongoose';
import { AdresaSchema } from './adresa.schema';
import { BrojTelefonaSchema } from './broj-telefona.schema';

export const KupacSchema = new Schema({
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
    },

    adresa: {
        type: AdresaSchema,
        required: true,
    },

    brojTelefona: {
        type: BrojTelefonaSchema,
        required: true,
    },
  });