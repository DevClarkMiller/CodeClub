import Dao from "./dao";
import PrismaSingleton from "@lib/prismaSingleton";
import { Account, ContestParticipant } from "@generated/prisma";
import ContestDao from "./contestDao";

export default class ContestParticipantDao extends Dao<
  ContestParticipant,
  typeof PrismaSingleton.instance.contestParticipant>
  {
  public constructor() {
    super(PrismaSingleton.instance.contestParticipant);
  }

  public async addStandings(contestID: number, standings: number[]): Promise<any>{
    try{
      for(const accountID of standings){
        await this.add({AccountID: accountID, ContestID: contestID});
      }
    }catch(err: any){
      console.error(err);
    }
  }
}