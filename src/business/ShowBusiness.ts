import { BandDataBase } from "../data/BandDataBase";
import { ShowDatabase } from "../data/ShowDatabase";
import { InvalidInputError } from "../error/InvalidInputError";
import { UnauthorizedError } from "../error/UnauthorizedError";
import { Show, ShowInputDTO } from "../model/Show";
import { UserRole } from "../model/User";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class ShowBusiness {
    constructor(
        private showDatabase: ShowDatabase,
        private bandDatabase: BandDataBase,
        private idGenerate: IdGenerator,
        private authenticator: Authenticator
    ){}

    async createShow(input: ShowInputDTO, token: string){
        const tokenData = this.authenticator.getData(token)

        if(tokenData.role !== UserRole.ADMIN){
            throw new UnauthorizedError("Only admins can access this feature")
        }

        if(!input.bandId || !input.weekDay || !input.startTime || !input.endTime){
            throw new InvalidInputError("Invalid input to createShow")
        }

        if(input.startTime < 8 || input.endTime > 23 || input. startTime >= input.endTime){
            throw new InvalidInputError("Invalid times to createShow")
        }

        if(!Number.isInteger(input.startTime) || !Number.isInteger(input.endTime)){
            throw new InvalidInputError("Times should be integer to createShow")
        }

        // const band = await this.bandDatabase.getBandByIdOrName(input.bandId)

        // if(!band){
        //     throw new NotFoundError(Band not found)
        // }


        const registeredShows = await this.showDatabase.getShowsByTimes(input.weekDay, input.startTime, input.endTime)

        if(registeredShows.length){
            throw new InvalidInputError("No more shows can be created at this times")
        }

        await this.showDatabase.createShow(
            Show.toShow({
                ...input,
                id: this.idGenerate.generate()
            })
        )
    }
}