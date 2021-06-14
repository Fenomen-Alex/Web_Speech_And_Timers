import React, {useCallback, useEffect, useState} from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import TimerSlot from './components/TimerSlot';
import { useStopwatch } from 'react-timer-hook';
import './App.css';


export default function App() {

  const [timers, setTimers] = useState([
    {time: 2, text: 'this is my message'},
    {time: 5, text: 'hello'},
    {time: 8, text: 'whats up'}
  ]);
  const { seconds, isRunning, start, reset } = useStopwatch({});
  const { speak, speaking, supported } = useSpeechSynthesis();

  const doReset = useCallback(() => reset(0, false), [reset]);
  const doSpeak = useCallback((...p) => speak(...p), [speak]);

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
      doSpeak({text: foundTimer.text})
    }

    // check to see if seconds is greater than the last timers time
    if (seconds > timers[timers.length - 1].time) doReset();
  }, [seconds, timers, doReset, doSpeak])

  if (!supported) {
    return <div>Your browser is not supported. Sorry</div>
  }

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
            onClick={doReset}
          >
            Stop
          </button>
        )}

        {speaking && <p>I am speaking...</p>}
      </div>
    </div>
  );
}
