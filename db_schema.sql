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
	Username VARCHAR(255),

	CONSTRAINT PK_Account PRIMARY KEY(ID),
	CONSTRAINT UK_Account UNIQUE(Username) -- Username must be unique
);

CREATE INDEX IX_Account_Username ON Account(Username);
GO

Create TABLE AccountPoints(
	ID INTEGER IDENTITY,
	Total REAL DEFAULT 0, -- Can be a negative or a positive
	AccountID INTEGER NOT NULL,
	CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
	CONSTRAINT PK_AccountPoints PRIMARY KEY(ID),
	CONSTRAINT FK_AccountPoints_Account FOREIGN KEY (AccountID) REFERENCES Account(ID)
);


-- Points can be calculated like this
SELECT a.UserName as Username, SUM(ap.Total) AS Points
FROM AccountPoints ap INNER JOIN Account a
	ON ap.AccountID = a.ID
GROUP BY a.Id, a.Username;
-- SELECT SUM(Total) FROM AccountPoints;