import Dao from "./dao";
import PrismaSingleton from "@lib/prismaSingleton";
import { Contest } from "@generated/prisma"; 

export default class ContestDao extends Dao<
  Contest,
  typeof PrismaSingleton.instance.contest>
  {
  public constructor() {
    super(PrismaSingleton.instance.contest);
  }
}
