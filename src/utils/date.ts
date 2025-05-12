export function formatTravelTile(departureDate: Date, arrivalDate: Date) {
    const departure = `${departureDate.getHours()}:${departureDate.getMinutes()}`;
    const arrival = `${arrivalDate.getHours()}:${arrivalDate.getMinutes()}`;

    const seconds = Math.floor((arrivalDate.getTime() - departureDate.getTime()) / 1_000);
    const hours = Math.round(seconds / 60 / 60);
    const minutes = Math.round(seconds / 60 - hours * 60);

    return { departure, arrival, travelTime: `${hours}г ${minutes}хв` };
}
