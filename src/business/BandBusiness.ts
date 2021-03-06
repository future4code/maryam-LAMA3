import { BandDataBase } from "../data/BandDataBase";
import { InvalidInputError } from "../error/InvalidInputError";
import { UnauthorizedError } from "../error/UnauthorizedError";
import { Band, BandInputDTO } from "../model/Band";
import { UserRole } from "../model/User";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class BandBusiness{
    constructor(
        private bandDataBase: BandDataBase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
    ){}

    async registerBand(input: BandInputDTO, token: string){
        const tokenData = this.authenticator.getData(token)

        if(tokenData.role !== UserRole.ADMIN){
            throw new UnauthorizedError("Only admins can access this feature")
        }

        console.log({input})
        if(!input.name || !input.music_genre || !input.responsible){
            throw new InvalidInputError("Invalid input to registerBand")
        }

        await this.bandDataBase.createBand(
            Band.toBand({
                ...input, 
                id: this.idGenerator.generate()
            })!
        )

        
    }
}