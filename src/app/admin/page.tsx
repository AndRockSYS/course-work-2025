'use client';

import Select from '@/components/ui/select';
import SelectStation from './select-station';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import {
    setArrival,
    setDeparture,
    updateWagon,
    addEmptyWagon,
    removeLastWagon,
} from '@/lib/redux/train-slice';
import {
    addTrain,
    addWagon,
    fetchAllActiveTrains,
    fetchSalesByTrainId,
    fetchStations,
    fetchTrainById,
    getOrAddStation,
} from '@/lib/sql/train';

import { validateNewTrain } from '@/utils/validator';

import { RootState } from '@/lib/redux/store';
import { downloadPdf } from '@/lib/pdf-creator';

export default function Admin() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const train = useAppSelector((state: RootState) => state.trainReducer);

    const departureRef = useRef<HTMLInputElement>(null);
    const arrivalRef = useRef<HTMLInputElement>(null);

    const { data: stations } = useQuery({
        queryKey: ['stations'],
        queryFn: async () => {
            const stations = await fetchStations();
            return stations.map((station) => station.name);
        },
        initialData: [],
    });

    const handleNumber = useCallback(
        (event: React.FormEvent<HTMLInputElement>, wagonNumber: number) => {
            const name = event.currentTarget.id;
            dispatch(updateWagon({ wagonNumber, [name]: event.currentTarget.value }));
        },
        [train]
    );

    const handleTrainCreation = useCallback(async () => {
        try {
            validateNewTrain(train);

            const departureId = await getOrAddStation(train.departureStation);
            const arrivalId = await getOrAddStation(train.arrivalStation);

            const trainId = await addTrain(
                new Date(train.departureDate),
                new Date(train.arrivalDate),
                departureId,
                arrivalId
            );

            for (let wagon of train.wagons) {
                await addWagon(
                    wagon.wagonNumber,
                    wagon.wagonType,
                    wagon.seatsAmount,
                    wagon.price,
                    trainId
                );
            }

            alert('Успішно');
            router.push('/');
        } catch (error: any) {
            alert(error.message);
        }
    }, [train]);

    return (
        <main className='p-4 flex flex-col gap-8'>
            <h4 className='font-extrabold text-xl text-center'>Адміністративна панель</h4>
            <section className='flex flex-col gap-4'>
                <h3 className='text-xl'>Отримання звіту</h3>
                <button
                    className='btn-primary'
                    onClick={async () => {
                        const activeTrains = await fetchAllActiveTrains();

                        const sales: any[] = [];
                        for (let train of activeTrains) {
                            const trainSales = await fetchSalesByTrainId(train.trainId);
                            sales.push(trainSales);
                        }

                        downloadPdf(activeTrains, sales);
                    }}
                >
                    Отримати звіт для усіх активних потягів
                </button>
            </section>
            <section className='flex flex-col gap-4'>
                <h3 className='text-xl'>Створення рейсу</h3>
                <div className='grid grid-cols-2 gap-4'>
                    <SelectStation stations={stations} dispatch={dispatch} train={train} />
                    <SelectStation
                        stations={stations}
                        dispatch={dispatch}
                        train={train}
                        isArrival
                    />
                    <input
                        className='input'
                        type='text'
                        readOnly
                        value={train.departureDate.replace('T', ' ')}
                        onClick={() => departureRef.current?.showPicker()}
                        placeholder='Дата відправлення'
                    />
                    <input
                        className='input'
                        type='text'
                        readOnly
                        value={train.arrivalDate.replace('T', ' ')}
                        onClick={() => arrivalRef.current?.showPicker()}
                        placeholder='Дата прибуття'
                    />
                    <input
                        className='hidden'
                        ref={departureRef}
                        onChange={(event) =>
                            dispatch(setDeparture({ date: event.currentTarget.value }))
                        }
                        type='datetime-local'
                    />
                    <input
                        className='hidden'
                        ref={arrivalRef}
                        onChange={(event) =>
                            dispatch(setArrival({ date: event.currentTarget.value }))
                        }
                        type='datetime-local'
                    />
                </div>
                <h4 className='text-lg'>Вагони</h4>
                <section className='flex flex-col gap-4'>
                    {train.wagons.map((wagon) => (
                        <div className='grid grid-cols-2 gap-4' key={wagon.wagonNumber}>
                            <h4 className='col-span-2'>Вагон №{wagon.wagonNumber}</h4>
                            <div className='col-span-2'>
                                <Select
                                    placeholder='Спосіб оплати'
                                    name='payment-method'
                                    options={['Плацкарт', 'Купе', 'Люкс']}
                                    setValue={(value) =>
                                        dispatch(updateWagon({ ...wagon, wagonType: value }))
                                    }
                                    value={wagon.wagonType}
                                />
                            </div>
                            <input
                                className='input'
                                type='text'
                                id='seatsAmount'
                                placeholder='К-сть місць'
                                value={wagon.seatsAmount > 0 ? wagon.seatsAmount : ''}
                                onInput={(event) => handleNumber(event, wagon.wagonNumber)}
                            />
                            <input
                                className='input'
                                type='text'
                                id='price'
                                placeholder='Вартість'
                                value={wagon.price > 0 ? wagon.price : ''}
                                onInput={(event) => handleNumber(event, wagon.wagonNumber)}
                            />
                        </div>
                    ))}
                </section>
                <div className='grid grid-cols-2 gap-4'>
                    <button className='btn-primary' onClick={() => dispatch(addEmptyWagon())}>
                        Додати вагон
                    </button>
                    <button className='btn-primary' onClick={() => dispatch(removeLastWagon())}>
                        Видалити вагон
                    </button>
                </div>
                <button className='btn-primary' onClick={handleTrainCreation}>
                    Створити потяг
                </button>
            </section>
        </main>
    );
}
