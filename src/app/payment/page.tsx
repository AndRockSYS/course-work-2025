'use client';

import Select from '@/components/ui/select';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { removeTrainWagon, setPaymentMethod } from '@/lib/redux/ticket-slice';
import { fetchTrainById } from '@/lib/sql/train';
import { addServiceForTicket, fetchAdditionalServices } from '@/lib/sql/additional-services';

import { RootState } from '@/lib/redux/store';
import { addClient, addTicket, addTransaction } from '@/lib/sql/ticket';

export default function Payment() {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const ticket = useAppSelector((state: RootState) => state.ticketReducer);

    const { data: train } = useQuery({
        queryKey: ['train', ticket.wagon?.trainId ?? undefined],
        queryFn: async () => {
            if (ticket.wagon) return await fetchTrainById(ticket.wagon.trainId);
            return undefined;
        },
    });

    const { data: services } = useQuery({
        queryKey: ['services'],
        queryFn: async () => await fetchAdditionalServices(),
        initialData: [],
    });

    const totalSum = useMemo(() => {
        if (!ticket.wagon) return 0;

        let sum = ticket.wagon.price;
        services.map((service) => {
            if (ticket.services.includes(service.serviceId)) sum += service.price;
        });

        return sum;
    }, [ticket, services]);

    const handlePayment = useCallback(async () => {
        if (!ticket.wagon || !totalSum) return;

        await addClient(
            ticket.phoneNumber,
            ticket.name,
            ticket.surname,
            new Date(ticket.date),
            ticket.email
        );
        const ticketId = await addTicket(
            ticket.phoneNumber,
            ticket.wagon.trainId,
            ticket.wagon.wagonId,
            ticket.seatNumber,
            'Активний'
        );

        for (let i = 0; i < ticket.services.length; i++) {
            await addServiceForTicket(ticketId, ticket.services[i]);
        }

        await addTransaction(totalSum, ticket.paymentMethod, 'success', ticketId);
        alert!('Успішно! Ваш квиток був направлений вам на пошту!');
        dispatch(removeTrainWagon());
        router.push('/');
    }, [ticket, totalSum]);

    if (!ticket.wagon) router.push('/');
    if (!ticket.wagon || !train) return <></>;

    return (
        <main className='p-4'>
            <h4 className='font-extrabold text-xl text-center'>Оплата</h4>
            <section className='flex flex-col gap-8 [&>*]:flex [&>*]:flex-col [&>div]:gap-4'>
                <header>
                    <h3 className='text-xl'>Потяг №{ticket.wagon?.trainId}</h3>
                    <h5 className='text-secondary'>
                        {ticket.wagon?.wagonType}, Вагон {ticket.wagon?.wagonNumber}, Місце{' '}
                        {ticket.seatNumber}
                    </h5>
                </header>
                <div className='[&_h5]:text-sm [&_h5]:text-secondary [&_h4]:font-bold'>
                    <div>
                        <h4>Відправлення</h4>
                        <h5>
                            {train.departureStation}, {train.departureDate.toLocaleString()}
                        </h5>
                    </div>
                    <div>
                        <h4>Прибуття</h4>
                        <h5>
                            {train.arrivalStation}, {train.arrivalDate.toLocaleString()}
                        </h5>
                    </div>
                    {ticket.services && (
                        <div>
                            <h4>Додаткові сервіси</h4>
                            {ticket.services.map((id) => (
                                <h5 key={id}>
                                    {services.find((looked) => looked.serviceId == id)?.serviceName}
                                    {' ₴'}
                                    {services.find((looked) => looked.serviceId == id)?.price}
                                </h5>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <h3 className='text-xl'>Спосіб оплати</h3>
                    <Select
                        placeholder='Спосіб оплати'
                        name='payment-method'
                        options={['Google Pay', 'Apple Pay', 'Bank Transfer']}
                        setValue={(value) => dispatch(setPaymentMethod(value))}
                        value={ticket.paymentMethod}
                        image='/icons/card.svg'
                    />
                </div>
                <button className='btn-primary' onClick={handlePayment}>
                    Сплатити ₴{totalSum}
                </button>
            </section>
        </main>
    );
}
