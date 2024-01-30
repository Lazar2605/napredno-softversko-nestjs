import { Schema, Document } from "mongoose";
import { Prodavac, ProdavacSchema } from "./prodavac.entity";

export const AdminSchema = new Schema({
    korisnickoIme: {
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


}, { collection: 'admin' })

export interface Admin {
    korisnickoIme: string;
    lozinka: string;
}

export interface AdminDocument extends Admin, Document {
    id: string;
}
