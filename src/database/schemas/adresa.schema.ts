import { Schema } from 'mongoose';

export const AdresaSchema = new Schema({
    ulica: {
      type: String,
      required: true,
    },

    grad: {
      type: String,
      required: true,
    },

    postanskiBroj: {
      type: Number,
      required: true,
    },
  });