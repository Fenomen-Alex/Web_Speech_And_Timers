import React, {useEffect, useState} from 'react';
import './App.css';
import TimerSlot from "./components/TimerSlot";
import {useStopwatch} from "react-timer-hook";

export default function App() {

  const [timers, setTimers] = useState([
    {time: 2, text: 'this is my message'},
    {time: 5, text: 'hello'},
    {time: 8, text: 'whats up'}
  ]);
  const {seconds, isRunning, start, reset} = useStopwatch({autoStart: true});

  const updateTimers = (index, time, text) => {
    const newTimers = [...timers];
    newTimers[index].time = time;
    newTimers[index].text = text;
    setTimers(newTimers);
  }

  const addTimer = () => {
    const newTimers = [...timers, {time: 12, text: 'new text'}];
    setTimers(newTimers);
  }

  useEffect(() => {
    const foundTimer = timers.find((timer) => timer.time === seconds);
    if (foundTimer) {
      // speak the text
    }

    // check to see if seconds is greater than the last timers time
    if (seconds > timers[timers.length - 1].time) reset();
  }, [seconds, timers, reset])

  return (
    <div className="app">
      <h2>Talk the Talk</h2>

      <div className="timers">
        {/* timers go here */}
        {timers.map((timer, index) => (
          <TimerSlot
            key={index}
            index={index}
            timer={timer}
            updateTimers={updateTimers}
          />
        ))}

        <button className="add-button" onClick={addTimer}>Add</button>
      </div>

      {/* seconds */}
      <h2>{seconds}</h2>

      {/* buttons */}
      <div className="buttons">
        {!isRunning && (
          <button
            className="start-button"
            onClick={start}
          >
            Start
          </button>
        )}
        {isRunning && (
          <button
            className="stop-button"
            onClick={reset}
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
