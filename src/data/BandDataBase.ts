import { Band } from "../model/Band";
import { BaseDatabase } from "./BaseDatabase";

export class BandDataBase extends BaseDatabase{

    private static TABLE_NAME = "lama_bands";

    public async createBand(band: Band): Promise<void>{
        try{
            await this.getConnection()
            .insert({
                id: band.getId(),
                name: band.getName(),
                music_genre: band.getMusicGenre(),
                responsible: band.getResponsible()
            })
            .into(BandDataBase.TABLE_NAME)
        }catch(error){
            throw new Error(error.sqlMessage || error.message)
        }
    }
}