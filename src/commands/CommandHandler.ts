export default interface CommandHandler{
    handle(): Promise<any>;
}
