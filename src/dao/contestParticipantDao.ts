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

  public async addStandings(contestID: number, standings: Account[][]): Promise<any>{
    try{
      for(const accountGroup of standings){
        for(const account of accountGroup){
          await this.add({AccountID: account.ID, ContestID: contestID});
        }
      }
    }catch(err: any){
      console.error(err);
    }
  }
}
