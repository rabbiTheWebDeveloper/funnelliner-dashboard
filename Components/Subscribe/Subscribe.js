import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { created } from '../../pages/api';
import style from './style.module.css';

const Subscribe = () => {
    const [timerDays, setTimerDays] = useState("00");
    const [timerHours, setTimerHours] = useState("00");
    const [timerMinutes, setTimerMinutes] = useState("00");
    const [timerSeconds, setTimerSeconds] = useState("00")
    let interval = useRef();
    const dateConvert = (data) => {
        const dateStr = data;
        // Extract the day and month from the date string
        const day = dateStr?.split(' ')[0].replace(/[^0-9]/g, '');
        const month = dateStr?.split(' ')[1];
        // Extract the time from the date string
        const time = dateStr?.split(',')[1].trim();
        // Create a new date string in the desired format
        const formattedDateStr = `${month} ${day}, 2023 ${time}`;
        // Create a new Date object from the formatted date string
        return  new Date(formattedDateStr);
    }
    const countdownDate = new Date(dateConvert(created));
    countdownDate.setHours(countdownDate.getHours() + 24);
    const countdownTime = countdownDate.getTime();
    const startTimer = () => {
     
        const countdownDate = new Date(countdownTime).getTime();

        interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                // Stop Timer
                clearInterval(interval.current);
            } else {
                // Update Timer
                setTimerDays(days);
                setTimerHours(hours);
                setTimerMinutes(minutes);
                setTimerSeconds(seconds);
            }
        }, 1000);
    };

    // use Effect
    // Component DidMount
    useEffect(() => {
        startTimer();

        return () => {
            clearInterval(interval.current);
        };
    });

    return (

        <>

            <div className={style.Subscribe}>

                <div className={style.left}>

                    <h5>You have</h5>

                    <ul>
                        <li><span>{timerDays}</span> Days</li>
                        <li><span>{timerHours}</span> Hours</li>
                        <li><span>{timerMinutes}</span> Minutes</li>
                        <li><span>{timerSeconds}</span> Seconds</li>
                    </ul>

                    <h5> left in your free trial ! Upgrade paid for additional benefits.</h5>

                </div>

                <Link href="/subscription">Upgrade Now</Link>

            </div>

        </>

    )

}

export default Subscribe
