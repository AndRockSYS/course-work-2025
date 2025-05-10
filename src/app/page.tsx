'use client';

import { addTrain, fetchSearchTrains } from '@/lib/sql/train';

export default function Home() {
    return (
        <main className='flex flex-col'>
            <button
                onClick={() => addTrain(new Date(Date.now()), new Date(Date.now()), 'from', 'to')}
            >
                Add Trains
            </button>
            <button
                onClick={() =>
                    fetchSearchTrains('from', 'to', new Date('2025-05-10T11:46:57.000Z'))
                }
            >
                Search Trains
            </button>
        </main>
    );
}
