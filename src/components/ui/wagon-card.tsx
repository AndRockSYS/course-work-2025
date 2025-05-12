'use client';

import { formatTravelTile } from '@/utils/date';

import { SearchedWagon } from '@/types/query';

interface Props {
    wagon: SearchedWagon;
}

export default function WagonCard({ wagon }: Props) {
    const { departure, arrival, travelTime } = formatTravelTile(
        wagon.departureDate,
        wagon.arrivalDate
    );

    return (
        <figure
            className='p-4 rounded-xl card-shadow flex flex-col gap-y-1.5 [&>*]:flex [&>*]:items-center [&>*]:justify-between'
            onClick={() => {}}
        >
            <div className='text-lg font-extrabold'>
                <h3>
                    {departure} - {arrival}
                </h3>
                <h3 className='text-primary'>{wagon.price}₴</h3>
            </div>
            <div className='text-sm text-secondary'>
                <h5>{travelTime}</h5>
                <h5>Потяг №{wagon.trainId}</h5>
            </div>
            <div className='text-sm text-secondary'>
                <h5>{wagon.wagonType}</h5>
                <h5>Місць: {wagon.seatsAmount}</h5>
            </div>
        </figure>
    );
}
