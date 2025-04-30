import { PrismaClient } from "@generated/prisma/";

export default class PrismaSingleton{
    static #instance: PrismaClient;

    private constructor() {}

    public static get instance(): PrismaClient{
        if (!PrismaSingleton.#instance)
            PrismaSingleton.#instance = new PrismaClient();

        return PrismaSingleton.#instance;
    }
}