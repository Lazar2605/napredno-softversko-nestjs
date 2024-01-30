import { Schema } from 'mongoose';

export const BrojTelefonaSchema = new Schema({
  
    drzavniPozivniBroj: {
      type: String,
      required: true,
    },
    broj: {
      type: String,
      required: true,
    },
  });