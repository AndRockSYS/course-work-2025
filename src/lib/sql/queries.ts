// Basic getters

export const getAdditionalServices = `SELECT * FROM additionalService`;

export const getDepartureStations = `
SELECT DISTINCT departureStation from train
`;

export const getDestinationStations = `
SELECT DISTINCT arrivalStation from train
`;

// Data creation

export const createTrain = `
INSERT INTO train
(arrivalDate, departureDate, departureStation, arrivalStation)
VALUES (?, ?, ?, ?)
`;

export const createWagon = `
INSERT INTO wagon
(wagonNumber, wagonType, seatsAmount, price, trainId)
VALUES (?, ?, ?, ?, ?)
`;

export const createClient = `
INSERT INTO client
(phoneNumber, name, surname, birthDate, email)
VALUES (?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
	name = VALUES(name),
    surname = VALUES(surname),
    birthDate = VALUES(birthDate),
    email = VALUES(email)
`;

export const createTicket = `
INSERT INTO ticket
(clientId, trainId, wagonId, seatNumber, status)
VALUES (?, ?, ?, ?, ?)
`;

export const createTransaction = `
INSERT INTO transaction
(value, paymentType, paymentStatus, paymentDate, ticketId)
VALUES (?, ?, ?, ?, ?)
`;

export const createService = `
INSERT INTO additionalService
(serviceName, price)
VALUES (?, ?)
`;

export const addTicketService = `
INSERT INTO ticketService
(ticketId, serviceId)
VALUES (?, ?)
`;

// Custom queries for booking

export const selectTrainById = `
SELECT *
FROM train
WHERE trainId = ?
`;

export const selectTrains = `
SELECT train.*, MIN(price) AS startingPrice
FROM wagon, train
WHERE train.departureStation = ?
AND train.arrivalStation = ?
AND DATE(train.departureDate) = ?
AND train.departureDate > NOW()
AND seatsAmount > (
	SELECT COUNT(*)
	FROM ticket
	WHERE ticket.wagonId = wagon.wagonId
    )
GROUP BY train.trainId;

`;

export const selectWagonsForTrain = `
SELECT *, wagon.seatsAmount - (
	SELECT COUNT(*)
    FROM ticket
    WHERE ticket.wagonId = wagon.wagonId
	) as freeSeats
FROM wagon
WHERE wagon.trainId = ?
HAVING freeSeats > 0
`;

export const selectFreeSeatsNumberForWagon = `
WITH RECURSIVE allSeats AS (
    SELECT 1 AS seatNumber
    UNION ALL
    SELECT seatNumber + 1
    FROM allSeats
    WHERE seatNumber < (
		SELECT seatsAmount
        FROM wagon
        WHERE wagon.wagonId = ?
    )
)
SELECT seatNumber
FROM allSeats
WHERE seatNumber NOT IN (
    SELECT seatNumber 
    FROM ticket
    WHERE ticket.wagonId = ?
)
ORDER BY seatNumber
`;
