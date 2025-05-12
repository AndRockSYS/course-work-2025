export const createTrain = `
INSERT INTO train
(arrivalDate, departureDate, departureStation, arrivalStation)
VALUES (?, ?, ?, ?)
`;

export const createWagon = `
INSERT INTO wagon
(wagonNumber, wagonType, seatsAmount, price, trainId)
VALUES(?, ?, ?, ?, ?)
`;

export const createClient = `
INSERT INTO client
(phoneNumber, name, surname, birthDate, email)
(?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE id = id`;

export const createTicket = `
INSERT INTO ticket
(clientId, trainId, wagonId, seatNumber, status)
(?, ?, ?, ?)
`;

export const createTransaction = `
INSERT INTO transaction
(value, paymentType, paymentStatus, paymentDate, ticketId)
(?, ?, ?, ?, ?)
`;

export const addTicketService = `
INSERT INTO ticketService
(ticketId, serviceId)
(?, ?)
`;

export const selectTrains = `
SELECT train.*, MIN(price) AS startingPrice
FROM wagon, train
WHERE train.departureStation = ?
AND train.arrivalStation = ?
AND DATE(train.departureDate) = ?
AND train.departureDate > NOW()
AND seatsAmount > 0
GROUP BY train.trainId
`;

export const selectWagonsForTrain = `
SELECT *
FROM wagon
WHERE wagon.trainId = ?
AND seatsAmount > 0
`;

export const getAdditionalServices = `SELECT * FROM additionalService`;

export const getDepartureStations = `
SELECT DISTINCT departureStation from train
`;

export const getDestinationStations = `
SELECT DISTINCT arrivalStation from train
`;
