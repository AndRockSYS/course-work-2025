'use server';

import SeatDrawer from '@/components/seat-drawer';
import TrainCard from '@/components/ui/train-card';

import { fetchedSearchedTrains } from '@/lib/sql/train';

interface Props {
    searchParams: Promise<{
        from: string;
        to: string;
        date: string;
    }>;
}

export default async function Trains({ searchParams }: Props) {
    const { from, to, date } = await searchParams;
    const trains = await fetchedSearchedTrains(from, to, new Date(date));

    return (
        <main className='p-4 flex flex-col gap-y-2'>
            <div className='mb-2 flex items-end justify-between'>
                <h2 className='text-2xl'>
                    {from} → {to}
                </h2>
                <h3>{date}</h3>
            </div>
            {trains.map((train) => (
                <TrainCard key={train.trainId} train={train} />
            ))}
            <SeatDrawer />
        </main>
    );
}
