'use server';

import WagonCard from '@/components/ui/wagon-card';

import { fetchSearchedWagons } from '@/lib/sql/train';

interface Props {
    searchParams: Promise<{
        from: string;
        to: string;
        date: string;
    }>;
}

export default async function Trains({ searchParams }: Props) {
    const { from, to, date } = await searchParams;
    const wagons = await fetchSearchedWagons(from, to, new Date(date));

    return (
        <main className='p-4 flex flex-col gap-y-2'>
            <div className='mb-2 flex items-end justify-between'>
                <h2 className=' text-3xl'>
                    {from} → {to}
                </h2>
                <h3>{date}</h3>
            </div>
            {wagons.map((wagon) => (
                <WagonCard key={wagon.wagonId} wagon={wagon} />
            ))}
        </main>
    );
}
