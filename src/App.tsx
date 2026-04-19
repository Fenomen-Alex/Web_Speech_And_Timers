import * as React from 'react';
import {useCallback, useEffect, useState, useRef} from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import TimerSlot from './components/TimerSlot';
import { useStopwatch } from 'react-timer-hook';
import './App.css';

type Timer = { time: number; text: string };

export default function App(): React.JSX.Element {
  const [timers, setTimers] = useState<Timer[]>([
    {time: 2, text: 'this is my message'},
    {time: 5, text: 'hello'},
    {time: 8, text: 'whats up'}
  ]);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { seconds, isRunning, start, pause, reset } = useStopwatch({ autoStart: false });
  const { speak, speaking, supported, voices } = useSpeechSynthesis();

  const voice = voiceIndex !== null ? voices[voiceIndex] : null;
  const lastSpokenRef = useRef<number>(-1);

  const doReset = useCallback(() => {
    lastSpokenRef.current = -1;
    reset(new Date(0), false);
  }, [reset]);

  const updateTimers = (index: number, time: number, text: string) => {
    const newTimers = [...timers];
    newTimers[index] = { time, text };
    setTimers(newTimers);
  };

  const addTimer = () => {
    const lastTime = timers.length > 0 ? timers[timers.length - 1].time : 0;
    const newTimers = [...timers, { time: lastTime + 3, text: 'new text' }];
    setTimers(newTimers);
  };

  const removeTimer = (index: number) => {
    if (timers.length <= 1) return;
    const newTimers = timers.filter((_, i) => i !== index);
    setTimers(newTimers);
  };

  const stop = useCallback(() => {
    pause();
    doReset();
  }, [pause, doReset]);

  useEffect(() => {
    if (speaking) {
      setIsSpeaking(true);
    } else {
      const timeout = setTimeout(() => setIsSpeaking(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [speaking]);

  useEffect(() => {
    if (!isRunning) return;
    if (seconds > timers[timers.length - 1].time && timers.length > 0) {
      doReset();
      return;
    }
    if (seconds === lastSpokenRef.current) return;

    const foundTimer = timers.find((timer) => timer.time === seconds);
    if (foundTimer) {
      lastSpokenRef.current = seconds;
      if (speaking) {
        setTimeout(() => speak({ text: foundTimer.text, voice, rate, pitch }), 200);
      } else {
        speak({ text: foundTimer.text, voice, rate, pitch });
      }
    }
  }, [seconds, isRunning, timers, doReset, rate, pitch, voice, speak, speaking]);

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getTimeWarnings = (index: number): string | null => {
    const current = timers[index];
    const next = timers[index + 1];
    if (!next) return null;
    
    const gap = next.time - current.time;
    const wordsPerSecond = rate * 1.5;
    const wordCount = current.text.trim().split(/\s+/).filter(Boolean).length;
    const estimatedDuration = wordCount / wordsPerSecond;
    
    if (estimatedDuration > gap) {
      return `Warning: ~${Math.ceil(estimatedDuration)}s needed, only ${gap}s available`;
    }
    return null;
  };

  if (!supported) {
    return <div className="app"><div className="error">Your browser is not supported. Sorry</div></div>;
  }

  return (
    <div className="app">
      <header>
        <h1>🗣️ Talk the Talk</h1>
        <p className="subtitle">Text-to-Speech Timer</p>
      </header>

      <section className="voice-settings">
        <div className="setting-group">
          <label htmlFor="voice">Voice</label>
          <select
            id="voice"
            name="voice"
            value={voiceIndex ?? ''}
            onChange={(event) => setVoiceIndex(event.target.value ? parseInt(event.target.value) : null)}
          >
            <option value="">System Default</option>
            {voices.map((option, index) => (
              <option key={option.voiceURI} value={index}>
                {option.name} ({option.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="setting-group">
          <div className="label-row">
            <label htmlFor="rate">Rate</label>
            <span className="value">{rate.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            defaultValue="1"
            step="0.1"
            id="rate"
            onChange={(event) => setRate(+event.target.value)}
          />
        </div>

        <div className="setting-group">
          <div className="label-row">
            <label htmlFor="pitch">Pitch</label>
            <span className="value">{pitch.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            defaultValue="1"
            step="0.1"
            id="pitch"
            onChange={(event) => setPitch(+event.target.value)}
          />
        </div>
      </section>

      <section className="timers-section">
        <h2>Timers</h2>
        <div className="timers">
          {timers.map((timer, index) => (
            <TimerSlot
              key={index}
              index={index}
              timer={timer}
              updateTimers={updateTimers}
              onRemove={() => removeTimer(index)}
              canRemove={timers.length > 1}
              warning={getTimeWarnings(index)}
            />
          ))}
          <button className="add-button" onClick={addTimer}>
            + Add Timer
          </button>
        </div>
      </section>

      <section className="timer-display">
        <div className={`time ${isRunning ? 'running' : ''}`}>
          {formatTime(seconds)}
        </div>
        {isSpeaking && <div className="speaking-indicator">🔊 Speaking...</div>}
      </section>

      <section className="controls">
        {!isRunning ? (
          <button className="start-button" onClick={start}>
            ▶ Start
          </button>
        ) : (
          <button className="stop-button" onClick={stop}>
            ■ Stop
          </button>
        )}
      </section>
    </div>
  );
}