'use client';

import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';

import { fetchAdditionalServices } from '@/lib/sql/additional-services';
import { manangeService, setPhone, setTextValue } from '@/lib/redux/ticket-slice';

import { validatePhoneNumber } from '@/utils/validator';

import { RootState } from '@/lib/redux/store';

export default function Passenger() {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const ticket = useAppSelector((state: RootState) => state.ticketReducer);

    const dateRef = useRef<HTMLInputElement>(null);

    const { data: services } = useQuery({
        queryKey: ['services'],
        queryFn: async () => await fetchAdditionalServices(),
        initialData: [],
    });

    return (
        <main className='p-4 flex flex-col gap-y-4'>
            <h4 className='font-extrabold text-xl text-center'>Інформація про пасажира</h4>
            <section className='flex flex-col gap-4'>
                <div className='grid grid-cols-2 gap-4'>
                    <input
                        className='input'
                        type='text'
                        id='name'
                        placeholder="Ім'я"
                        value={ticket.name}
                        onInput={(event) =>
                            dispatch(
                                setTextValue({ type: 'name', value: event.currentTarget.value })
                            )
                        }
                    />
                    <input
                        className='input'
                        type='text'
                        id='surname'
                        placeholder='Прізвище'
                        value={ticket.surname}
                        onInput={(event) =>
                            dispatch(
                                setTextValue({ type: 'surname', value: event.currentTarget.value })
                            )
                        }
                    />
                </div>
                <input
                    className='input'
                    type='text'
                    id='phone'
                    value={ticket.phoneNumber}
                    placeholder='Номер телефону'
                    onInput={(event) => {
                        event.preventDefault();

                        const validated = validatePhoneNumber(event.currentTarget.value);
                        dispatch(setPhone(validated));
                    }}
                />
                <input
                    className='input'
                    type='text'
                    id='mail'
                    value={ticket.email}
                    placeholder='Електронна пошта'
                    onInput={(event) =>
                        dispatch(setTextValue({ type: 'email', value: event.currentTarget.value }))
                    }
                />
                <input
                    className='input'
                    type='text'
                    id='date'
                    onClick={() => dateRef.current?.showPicker()}
                    value={ticket.date}
                    placeholder='Дата народження'
                />
                <input
                    className='hidden'
                    ref={dateRef}
                    onInput={(event) =>
                        dispatch(setTextValue({ type: 'date', value: event.currentTarget.value }))
                    }
                    type='date'
                    id='birth-date'
                />
            </section>
            <h4 className='mt-4 text-2xl'>Додаткові послуги</h4>
            <section className='flex flex-col gap-y-4'>
                {services.map((service) => (
                    <div key={service.serviceName} className='flex items-center justify-between'>
                        <label htmlFor={service.serviceId.toString()}>
                            {service.serviceName} ₴{service.price}
                        </label>
                        <input
                            id={service.serviceId.toString()}
                            type='checkbox'
                            onInput={(event) =>
                                dispatch(
                                    manangeService({
                                        checked: event.currentTarget.checked,
                                        serviceId: service.serviceId,
                                    })
                                )
                            }
                        />
                    </div>
                ))}
            </section>
            <button
                className='mt-4 btn-primary'
                onClick={() => {
                    if (
                        ticket.email &&
                        ticket.name &&
                        ticket.phoneNumber != '+380' &&
                        ticket.surname
                    )
                        router.push('/payment');
                }}
            >
                Продовжити
            </button>
        </main>
    );
}
