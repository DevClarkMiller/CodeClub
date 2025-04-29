import SlashCommandHandler from "./SlashCommandHandler";

// This will be tough, will have to use puppeteer and manually click through fields to get it, or use selenium.
export class CreateGymCommandHandler extends SlashCommandHandler{
    handle(): Promise<any> {
        return Promise.resolve("GOING TO CREATE GYM");
    }
}