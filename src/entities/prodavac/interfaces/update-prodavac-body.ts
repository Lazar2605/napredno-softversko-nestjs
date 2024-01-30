import { Adresa } from "src/database/interfaces/adresa.interface"
import { BrojTelefona } from "src/database/interfaces/broj-telefona.interface"

export interface UpdateProdavacBody {
    prezime: string;
    adresa: Adresa;
    brojTelefona: BrojTelefona;
    nazivPG: string;
    registatskiBrojPG: string;
    brojRacuna: string;
    cenaDostave: number;
}