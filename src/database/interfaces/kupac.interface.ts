import { Adresa } from "./adresa.interface";
import { BrojTelefona } from "./broj-telefona.interface";

export interface Kupac {
    ime: string;
    prezime: string;
    imejl: string;
    adresa: Adresa;
    brojTelefona: BrojTelefona;
}