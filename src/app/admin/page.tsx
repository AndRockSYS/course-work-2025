'use client';

import Select from '@/components/ui/select';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useCallback, useRef } from 'react';

import { setArrival, setDeparture, updateWagon, addEmptyWagon } from '@/lib/redux/train-slice';
import { addTrain, addWagon } from '@/lib/sql/train';

import { validateNewTrain } from '@/utils/validator';

import { RootState } from '@/lib/redux/store';

export default function Admin() {
    const dispatch = useAppDispatch();
    const train = useAppSelector((state: RootState) => state.trainReducer);

    const departureRef = useRef<HTMLInputElement>(null);
    const arrivalRef = useRef<HTMLInputElement>(null);

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

            const trainId = await addTrain(
                new Date(train.departureDate),
                new Date(train.arrivalDate),
                train.departureStation,
                train.arrivalStation
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
        } catch (error: any) {
            alert(error.message);
        }
    }, [train]);

    return (
        <main className='p-4 flex flex-col gap-8'>
            <h4 className='font-extrabold text-xl text-center'>Адміністративна панель</h4>
            <section className='flex flex-col gap-4'>
                <h3 className='text-xl'>Створення рейсу</h3>
                <div className='grid grid-cols-2 gap-4'>
                    <input
                        className='input col-span-2'
                        type='text'
                        value={train.departureStation}
                        placeholder='Станція відправлення'
                        onInput={(event) =>
                            dispatch(setDeparture({ station: event.currentTarget.value }))
                        }
                    />
                    <input
                        className='input col-span-2'
                        type='text'
                        value={train.arrivalStation}
                        placeholder='Станція прибуття'
                        onInput={(event) =>
                            dispatch(setArrival({ station: event.currentTarget.value }))
                        }
                    />
                    <input
                        className='input'
                        type='text'
                        value={train.departureDate.replace('T', ' ')}
                        onClick={() => departureRef.current?.showPicker()}
                        placeholder='Дата відправлення'
                    />
                    <input
                        className='input'
                        type='text'
                        value={train.arrivalDate.replace('T', ' ')}
                        onClick={() => arrivalRef.current?.showPicker()}
                        placeholder='Дата прибуття'
                    />

                    <input
                        className='hidden'
                        ref={departureRef}
                        onInput={(event) =>
                            dispatch(setDeparture({ date: event.currentTarget.value }))
                        }
                        type='datetime-local'
                    />
                    <input
                        className='hidden'
                        ref={arrivalRef}
                        onInput={(event) =>
                            dispatch(setArrival({ date: event.currentTarget.value }))
                        }
                        type='datetime-local'
                    />
                </div>
                <div className='flex items-center justify-between'>
                    <h4 className='text-lg'>Вагони</h4>
                    <button className='btn-primary' onClick={() => dispatch(addEmptyWagon())}>
                        Додати вагон
                    </button>
                </div>
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
                <button className='btn-primary' onClick={handleTrainCreation}>
                    Створити потяг
                </button>
            </section>
        </main>
    );
}
