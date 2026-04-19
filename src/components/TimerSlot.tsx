import * as React from "react";
import {useState, useEffect} from "react";

type PropsType = {
    index: number;
    timer: {
        time: number;
        text: string;
    };
    updateTimers: (index: number, time: number, text: string) => void;
    onRemove?: () => void;
    canRemove?: boolean;
    warning?: string | null;
}

const TimerSlot = ({index, timer, updateTimers, onRemove, canRemove, warning}: PropsType): React.JSX.Element => {

    const [time, setTime] = useState(timer.time);
    const [text, setText] = useState(timer.text);

    useEffect(() => {
        setTime(timer.time);
        setText(timer.text);
    }, [timer]);

    const handleBlur = () => {
        updateTimers(index, time, text);
    };

    return (
        <div className="timer-slot">
            <div className="timer-header">
                <span className="timer-number">#{index + 1}</span>
                {canRemove && onRemove && (
                    <button className="remove-button" onClick={onRemove} aria-label="Remove timer">
                        ×
                    </button>
                )}
            </div>
            <div className="timer-fields">
                <div className="field">
                    <label htmlFor={`time-${index}`}>Time (seconds)</label>
                    <input
                        id={`time-${index}`}
                        type="number"
                        min="0"
                        value={time}
                        onChange={(e) => setTime(+e.target.value)}
                        onBlur={handleBlur}
                    />
                </div>
                <div className="field">
                    <label htmlFor={`text-${index}`}>Text to speak</label>
                    <textarea
                        id={`text-${index}`}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onBlur={handleBlur}
                        placeholder="Enter text to speak..."
                        rows={3}
                    />
                </div>
            </div>
            {warning && (
                <div className="warning">{warning}</div>
            )}
        </div>
    );
};

export default TimerSlot;