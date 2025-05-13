'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';

import { fetchWagonByTrain } from '@/lib/sql/train';
import { setTrainWagon } from '@/lib/redux/ticket-slice';

import { formatTravelTile } from '@/utils/date';
import { twMerge } from 'tailwind-merge';

import { SearchedTrain } from '@/types/query';

interface Props {
    train: SearchedTrain;
}

export default function TrainCard({ train }: Props) {
    const dispatch = useAppDispatch();

    const { departure, arrival, travelTime } = formatTravelTile(
        train.departureDate,
        train.arrivalDate
    );

    const [showWagons, setShowWagons] = useState(false);
    const { data: wagons } = useQuery({
        queryKey: ['wagons', train.trainId],
        queryFn: async () => await fetchWagonByTrain(train.trainId),
        initialData: [],
    });

    return (
        <section className='relative flex flex-col gap-y-2 [&>*]:flex [&_div]:flex [&>*]:flex-col [&_div]:items-center [&_div]:justify-between'>
            <figure
                className='p-4 rounded-xl card-shadow gap-y-1.5 transition-all duration-500'
                onClick={() => setShowWagons(!showWagons)}
            >
                <div className='text-lg font-extrabold'>
                    <h3>
                        {departure} - {arrival}
                    </h3>
                    <h3 className='text-primary'>від {train.startingPrice}₴</h3>
                </div>
                <div className='text-sm text-secondary'>
                    <h5>{travelTime}</h5>
                    <h5>Потяг №{train.trainId}</h5>
                </div>
            </figure>
            {showWagons &&
                wagons.map((wagon) => (
                    <figure
                        className={twMerge('p-4 rounded-xl gap-y-1.5 bg-tetriary')}
                        key={wagon.wagonId}
                        onClick={() => dispatch(setTrainWagon(wagon))}
                    >
                        <div className='text-lg font-extrabold'>
                            <h3>{wagon.wagonType}</h3>
                            <h3>{wagon.price}₴</h3>
                        </div>
                        <div className='text-sm text-secondary'>
                            <h5>Місць: {wagon.freeSeats}</h5>
                            <h5>Вагон №{wagon.wagonNumber}</h5>
                        </div>
                    </figure>
                ))}
        </section>
    );
}
