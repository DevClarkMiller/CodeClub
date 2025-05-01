USE CodeClub;
GO

SELECT a.*, SUM(ae.Total) AS TotalPoints
FROM Account a INNER JOIN AccountElo ae
ON a.ID = ae.AccountID
GROUP BY a.ID, a.DiscordUsername, a.CodeforcesUsername, a.KattisUsername, a.ShowElo;