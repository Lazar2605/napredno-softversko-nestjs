import { Schema, Document} from "mongoose"
import { modelNames } from "../constants/model-names";

export const KategorijaSchema = new Schema({
    naziv: {
        type: String,
        required: true,
        unique: true,
    },

    slikaKljuc: {
        type: String,
    },

    roditeljskaKategorijaId: {
        type: Schema.Types.ObjectId,
    },

    dostupna: {
        type: Boolean,
        required: true,
        default: false,
        select: false,
    }

}, { 
    collection: 'kategorije',
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
})

KategorijaSchema.virtual('proizvodi', {
    ref: modelNames.PROIZVOD,
    localField: '_id',
    foreignField: 'kategorijaId',
});

KategorijaSchema.virtual('roditeljska', {
    ref: modelNames.KATEGORIJA,
    localField: 'roditeljskaKategorijaId',
    foreignField: '_id',
    justOne: true,
});

KategorijaSchema.virtual('cerkeKategorije', {
    ref: modelNames.KATEGORIJA,
    localField: '_id',
    foreignField: 'roditeljskaKategorijaId',
});

export interface Kategorija {
    naziv: string;
    slikaKljuc: string;
    roditeljskaKategorijaId: string;
    dostupna: boolean;
}

export interface KategorijaDocument extends Kategorija, Document {
    id: string;
    cerkeKategorija?: [KategorijaDocument];
}
