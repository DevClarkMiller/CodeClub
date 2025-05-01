import dotenv from "dotenv";


dotenv.config();
const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DB_URL, OWNER_USERNAME } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DB_URL || !OWNER_USERNAME) {
    throw new Error("Missing environment variables");
}

export const config = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    DB_URL,
    OWNER_USERNAME
};