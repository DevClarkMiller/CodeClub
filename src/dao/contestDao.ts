import Dao from "./dao";
import PrismaSingleton from "@lib/prismaSingleton";
import { Account, AccountElo, Contest, Prisma } from "@generated/prisma"; // or "@generated/prisma" if that's your path

export default class ContestDao extends Dao<
  Contest,
  typeof PrismaSingleton.instance.contest>
  {
  public constructor() {
    super(PrismaSingleton.instance.contest);
  }
}
