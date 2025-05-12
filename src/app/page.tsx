'use client';

import Image from 'next/image';
import Select from '@/components/ui/select';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { fetchStations } from '@/lib/sql/train';

export default function Home() {
    const router = useRouter();

    const [departureStation, setDepartureStation] = useState('');
    const [arrivalStation, setArrivalStation] = useState('');
    const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);

    const dateRef = useRef<HTMLInputElement>(null);

    const { data: stations } = useQuery({
        queryKey: ['stations'],
        queryFn: async () => await fetchStations(),
        initialData: [[], []],
    });

    return (
        <main className='p-4 [&>*]:w-full flex flex-col gap-y-8'>
            <h4 className='font-extrabold text-xl text-center'>Залізниця</h4>
            <section className='flex flex-col gap-y-4'>
                <Select
                    placeholder='Станція відправлення'
                    name='from'
                    options={stations[0]}
                    setValue={setDepartureStation}
                    value={departureStation}
                    image='/icons/departure.svg'
                />
                <Select
                    placeholder='Станція прибуття'
                    name='to'
                    options={stations[1]}
                    setValue={setArrivalStation}
                    value={arrivalStation}
                    image='/icons/arrival.svg'
                />
                <section className='select' onClick={() => dateRef.current?.showPicker()}>
                    <Image src='/icons/date.svg' alt='date' width={18} height={18} />
                    <input
                        ref={dateRef}
                        className='appearance-none'
                        type='date'
                        value={departureDate}
                        onChange={(event) => setDepartureDate(event.currentTarget.value)}
                    />
                </section>
            </section>
            <button
                className='btn-primary'
                onClick={() => {
                    if (departureStation && arrivalStation)
                        router.push(
                            `/trains?from=${departureStation}&to=${arrivalStation}&date=${departureDate}`
                        );
                }}
            >
                Пошук Рейсів
            </button>
        </main>
    );
}
