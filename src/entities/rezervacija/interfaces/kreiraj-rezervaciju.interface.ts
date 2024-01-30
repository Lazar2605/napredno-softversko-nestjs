import { Kupac } from "src/database/interfaces/kupac.interface";

export interface KreirajRezervaciju {
    kupac: Kupac;
    hash: string;
    cena: number;
}