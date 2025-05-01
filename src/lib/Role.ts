enum Role{
    ADMIN = 1,
    USER = 2,
    // For testing
    TestRole = 3,
    Organizer = 4,
    UnknownRole = 10
}

export class RoleError extends Error{
    constructor(msg: string){
        super(msg);
    }
}

export function getRoleValue(role: string): Role{
    switch(role){
        case "Admin": return Role.ADMIN;
        case "User": return Role.USER;
        case "Organizer": return Role.Organizer;
        default: return Role.UnknownRole;
    }
}

export function getRoleName(role: Role): string{
    switch(role){
        case Role.USER: return "User";
        case Role.ADMIN: return "Admin";
        case Role.TestRole: return "TestRole";
        case Role.Organizer: return "Organizer";
        default: return "";   
    }
}

export function roleCommands(role: Role){
    let res: string[] = []; // Res is built onto from the role, this is done for clarity

    switch(role){
        case Role.ADMIN:
            res.push("- /addRole --user USER --role ROLE $ Assigns the given user the specified role");
            res.push("- /removeRole --user USER --role ROLE $ Removes role from the given user");
            break;
        case Role.USER: 
            res.push("- /help $ Returns a list of commands");
            res.push("- /elo --user USER $ Returns the amount of elo the given user has");
            res.push("- /statsGym --GYM_URL $ Returns the stats on the given gym");
            res.push("- /toggleShowELO $ Will toggle if your nickname has your ELO included");
            break;
        case Role.Organizer: 
            let currentDate: number = Date.now();
            let date: Date = new Date(currentDate);
            date.setDate(date.getDate() + 1); // Add a single day to the date
            let dateStr: string = date.toISOString().split('T')[0];

            res.push(`- /createGym --name GYM_NAME --date ${dateStr} --time 16:00 --problems https://prob1url.com https://prob2url.com https://prob3url.com $ Creates a gym with the given name, for the given datetime with the given problemset`);
            break;
    }

    return res.join("\n");
}

export default Role;