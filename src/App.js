import React, {useState} from 'react';
import './App.css';
import TimerSlot from "./components/TimerSlot";

export default function App() {

  const [timers, setTimers] = useState([
    { time: 2, text: 'this is my message'},
    { time: 5, text: 'hello'},
    { time: 8, text: 'whats up'}
  ]);

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
      <h2>0</h2>

      {/* buttons */}
      <div className="buttons">
        <button className="start-button">Start</button>
        <button className="stop-button">Stop</button>
      </div>
    </div>
  );
}
