import Dao from "./dao";
import PrismaSingleton from "@lib/prismaSingleton";
import { Account, AccountElo, Prisma } from "@generated/prisma"; // or "@generated/prisma" if that's your path

export default class AccountEloDao extends Dao<
  AccountElo,
  typeof PrismaSingleton.instance.accountElo>
  {
  public constructor() {
    super(PrismaSingleton.instance.accountElo);
  }

  public async totalEloForAccount(account: Account): Promise<number> {
    try {
      const res = await PrismaSingleton.instance.accountElo.aggregate({
        _sum: { Total: true },
        where: { AccountID: account.ID },
      });

      if (!res._sum.Total) return 1;
      return Math.max(res._sum.Total, 1);
    } catch (err: any) {
      console.error(err.message);
      return 0;
    }
  }
}
