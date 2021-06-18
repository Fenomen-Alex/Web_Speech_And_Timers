import * as React from "react";
import {useState} from "react";

type PropsType = {
    index: number,
    timer: {
        time: number,
        text: string
    },
    updateTimers: Function
}

const TimerSlot = ({index, timer, updateTimers}: PropsType): JSX.Element => {

    const [time, setTime] = useState(timer.time);
    const [text, setText] = useState(timer.text);

    const handleBlur = () => {
        updateTimers(index, time, text);
    }

    return (
        <form className="timer" key={index}>
            <input
                type="number"
                value={time}
                onChange={(e) => setTime(+e.target.value)}
                onBlur={handleBlur}
            />
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleBlur}
            />
        </form>
    )
}

export default TimerSlot;
