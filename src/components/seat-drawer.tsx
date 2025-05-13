'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { removeTrainWagon, setSeatNumber } from '@/lib/redux/ticket-slice';
import { fetchFreeSeatsNumbers } from '@/lib/sql/train';

import { twMerge } from 'tailwind-merge';

import { RootState } from '@/lib/redux/store';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function SeatDrawer() {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const wagonId = useAppSelector((state: RootState) => state.ticketReducer.wagon?.wagonId);

    const { data: freeSeats } = useQuery({
        queryKey: ['free', 'seats', wagonId],
        queryFn: async () => {
            if (wagonId) return await fetchFreeSeatsNumbers(wagonId);
            return [];
        },
        initialData: [],
    });

    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = useCallback(() => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollTop = container.scrollTop;
        const itemHeight = container.clientHeight;

        setCurrentIndex(Math.round(scrollTop / itemHeight));
    }, [freeSeats]);

    useEffect(() => {
        const container = scrollRef.current;

        container?.addEventListener('scroll', handleScroll);
        return () => container?.removeEventListener('scroll', handleScroll);
    }, [freeSeats]);

    return (
        <div
            id='background'
            onClick={(event) =>
                (event.target as HTMLElement).id == 'background' && dispatch(removeTrainWagon())
            }
            className={twMerge(
                'fixed top-0 left-0 w-dvw h-dvh transition-all duration-500',
                !wagonId ? 'pointer-events-none' : 'backdrop-blur-sm'
            )}
        >
            <figure
                className={twMerge(
                    'absolute bottom-0 w-dvw h-1/3 p-4 flex flex-col items-center justify-between bg-background transition-all duration-500 rounded-t-lg',
                    !wagonId ? 'translate-y-full' : ''
                )}
            >
                <h3 className='text-xl'>Виберіть місце</h3>
                <section>
                    <div
                        ref={scrollRef}
                        className='scroll-container h-32 w-32 overflow-y-auto snap-container'
                    >
                        {freeSeats.map((number) => (
                            <div
                                key={number}
                                className={
                                    'scroll-item h-32 flex items-center justify-center text-4xl text-primary font-extrabold snap-center'
                                }
                            >
                                {number}
                            </div>
                        ))}
                    </div>
                </section>
                <button
                    className='w-full btn-primary'
                    onClick={() => {
                        dispatch(setSeatNumber(freeSeats[currentIndex]));
                        router.push('/passenger');
                    }}
                >
                    Продовжити
                </button>
            </figure>
        </div>
    );
}
