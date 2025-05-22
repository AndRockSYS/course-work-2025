'use client';

import { useEffect, useState } from 'react';

import { setDeparture, setArrival, TrainCreation } from '@/lib/redux/train-slice';

import { AppDispatch } from '@/lib/redux/store';

interface Props {
    train: TrainCreation;
    dispatch: AppDispatch;
    stations: string[];
    isArrival?: boolean;
}

export default function SelectStation({ stations, train, dispatch, isArrival }: Props) {
    const [station, setStation] = useState('');
    const [showList, setShowList] = useState(false);

    const filteredStations = stations.filter((station) => {
        if (
            station
                .toLowerCase()
                .includes(
                    isArrival
                        ? train.arrivalStation.toLowerCase()
                        : train.departureStation.toLowerCase()
                )
        )
            if (
                (isArrival && train.departureStation != station) ||
                (!isArrival && train.arrivalStation != station)
            )
                return true;

        return false;
    });

    useEffect(() => {
        dispatch(isArrival ? setArrival({ station: station }) : setDeparture({ station: station }));
    }, [station]);

    return (
        <section className='relative input col-span-2'>
            <input
                type='text'
                value={station}
                placeholder={isArrival ? 'Станція прибуття' : 'Станція відправлення'}
                onChange={(event) => {
                    const value = event.currentTarget.value;
                    setShowList(filteredStations.length > 0);
                    setStation(value);
                }}
                onBlur={() => setShowList(false)}
            />
            {showList && station.length > 0 && filteredStations.length > 0 && (
                <ul className='absolute z-10 top-20 left-0 w-full p-2 bg-tetriary rounded-lg flex flex-col gap-2 '>
                    {filteredStations.map((station) => (
                        <li
                            className='w-full p-2 text-background bg-primary text-center border border-background rounded-lg'
                            key={station}
                            onMouseDown={() => {
                                console.log(station);
                                setStation(station);
                                setShowList(false);
                            }}
                        >
                            {station}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
