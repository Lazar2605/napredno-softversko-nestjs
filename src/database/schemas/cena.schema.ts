import { Schema } from 'mongoose';

export const CenaSchema = new Schema({
    kolicina: {
      type: Number,
      required: true,
    },

    mera: {
      type: String,
      required: true,
    },

    iznos: {
        type: Number,
        required: true,
    }

  });