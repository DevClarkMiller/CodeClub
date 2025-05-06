USE MASTER 
GO

-- This will allow the database to be dropped
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'CodeClub')
BEGIN
    ALTER DATABASE CodeClub 
    SET SINGLE_USER 
    WITH ROLLBACK IMMEDIATE;
END
--------------------------------------------- 

GO
DROP DATABASE IF EXISTS CodeClub;
GO
CREATE DATABASE CodeClub;
GO
USE CodeClub;
GO
CREATE TABLE Account(
	ID INTEGER IDENTITY,
	DiscordUsername VARCHAR(255) NOT NULL,
	CodeforcesUsername VARCHAR(255) NULL,
	KattisUsername VARCHAR(255) NULL,
	ShowElo BIT DEFAULT 0 NOT NULL,

	CONSTRAINT PK_Account PRIMARY KEY(ID),

	-- Discord username is the only thing which will have a table level unique for account
	CONSTRAINT AK_Account_DiscordUsername UNIQUE(DiscordUsername),
);

GO

-- Unique index for non-null CodeforcesUsername
CREATE UNIQUE INDEX UX_Account_CodeforcesUsername
ON Account(CodeforcesUsername)
WHERE CodeforcesUsername IS NOT NULL;

-- Unique index for non-null KattisUsername
CREATE UNIQUE INDEX UX_Account_KattisUsername
ON Account(KattisUsername)
WHERE KattisUsername IS NOT NULL;

CREATE INDEX IX_Account_DiscordUsername ON Account(DiscordUsername);
GO

Create TABLE AccountElo(
	ID INTEGER IDENTITY,
	Total REAL DEFAULT 0, -- Can be a negative or a positive
	AccountID INTEGER NOT NULL,
	CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
	CONSTRAINT PK_AccountElo PRIMARY KEY(ID),
	CONSTRAINT FK_AccountElo_Account FOREIGN KEY (AccountID) REFERENCES Account(ID) ON DELETE CASCADE
);

CREATE INDEX IX_Account_DiscordUsername ON Account(DiscordUsername);
GO

CREATE TABLE Contest(
	ID INTEGER IDENTITY,
	Name VARCHAR(255) NULL,
	


	CONSTRAINT PK_Contest PRIMARY KEY (ID)
);

---- Points can be calculated like this
--SELECT a.UserName as Username, SUM(ap.Total) AS Points
--FROM AccountPoints ap INNER JOIN Account a
--	ON ap.AccountID = a.ID
--GROUP BY a.Id, a.Username;
---- SELECT SUM(Total) FROM AccountPoints;