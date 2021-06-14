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
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(null);

  const { seconds, isRunning, start, reset } = useStopwatch({});
  const { speak, speaking, supported, voices } = useSpeechSynthesis();

  const voice = voices[voiceIndex] || null;

  const styleFlexRow = { display: 'flex', flexDirection: 'row' };
  const styleContainerRatePitch = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 12,
  };

  const doReset = useCallback(() => reset(0, false), []);
  // const doSpeak = useCallback((...p) => speak(...p), [speak]);

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
      speak({ text: foundTimer.text, voice, rate, pitch })
    }

    // check to see if seconds is greater than the last timers time
    if (seconds > timers[timers.length - 1].time) doReset();
  }, [seconds, timers, doReset, rate, pitch, voice])

  if (!supported) {
    return <div>Your browser is not supported. Sorry</div>
  }

  return (
    <div className="app">
      <h2>Talk the Talk</h2>

      <form>
        <label htmlFor="voice">Voice</label>
        <select
          id="voice"
          name="voice"
          value={voiceIndex || ''}
          onChange={(event) => {
            setVoiceIndex(event.target.value);
          }}
        >
          <option value="">Default</option>
          {voices.map((option, index) => (
            <option key={option.voiceURI} value={index}>
              {`${option.lang} - ${option.name}`}
            </option>
          ))}
        </select>
        <div style={styleContainerRatePitch}>
          <div style={styleFlexRow}>
            <label htmlFor="rate">Rate: </label>
            <div className="rate-value">{rate}</div>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            defaultValue="1"
            step="0.1"
            id="rate"
            onChange={(event) => {
              setRate(event.target.value);
            }}
          />
        </div>
        <div style={styleContainerRatePitch}>
          <div style={styleFlexRow}>
            <label htmlFor="pitch">Pitch: </label>
            <div className="pitch-value">{pitch}</div>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            defaultValue="1"
            step="0.1"
            id="pitch"
            onChange={(event) => {
              setPitch(event.target.value);
            }}
          />
        </div>
      </form>

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
