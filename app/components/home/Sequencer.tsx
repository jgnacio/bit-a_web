"use client";

import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

const STEPS = 16;
const BPM = 96;
/** Sixteenth notes: four steps per beat. */
const STEP_SECONDS = 60 / BPM / 4;
/** How far ahead of the clock notes are handed to the audio engine. */
const LOOKAHEAD_SECONDS = 0.1;
const SCHEDULER_MS = 25;
/** After this long without a running audio clock, say so. */
const SILENT_AFTER_SECONDS = 0.8;

const TRACKS = ["kick", "snare", "hat", "bass"] as const;
type TrackId = (typeof TRACKS)[number];

const row = (pattern: string) => Array.from(pattern, (mark) => mark === "x");

/** The pattern the page opens with: a plain worship groove. */
const STARTER: readonly boolean[][] = [
  row("x...x...x...x..."),
  row("....x.......x..."),
  row("x.x.x.x.x.x.x.x."),
  row("x..x..x...x..x.."),
];

/** One bass note per step: a line in E that only sounds where the bass track is on. */
const BASS_HZ = [
  82.41, 82.41, 82.41, 98.0, 110.0, 110.0, 98.0, 82.41, 82.41, 82.41, 82.41, 98.0, 123.47, 110.0, 98.0, 82.41,
];

export interface SequencerLabels {
  play: string;
  stop: string;
  clear: string;
  /** Brings back the pattern that Clear just removed. */
  undo: string;
  restore: string;
  tracks: Record<TrackId, string>;
  /** Accessible name of the whole grid. */
  steps: string;
  /** Template with `{track}` and `{step}`. */
  step: string;
  /** Template with `{step}`. */
  position: string;
  positionIdle: string;
  tempo: string;
  sound: { idle: string; on: string; off: string };
  legend: string;
  size: string;
}

type SoundState = "idle" | "on" | "off";

/**
 * The four voices, built from oscillators and noise. Nothing is downloaded,
 * and the audio context is created on the first Play, inside the click, as
 * browsers require.
 */
class Voices {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;

  /** Creates the context if needed and asks it to run. Safe to call again. */
  wake(): void {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      try {
        const ctx = new Ctor();
        const master = ctx.createGain();
        master.gain.value = 0.6;
        master.connect(ctx.destination);

        const length = Math.floor(ctx.sampleRate * 0.25);
        const noise = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

        this.ctx = ctx;
        this.master = master;
        this.noise = noise;
      } catch {
        this.ctx = null;
        return;
      }
    }
    if (this.ctx.state !== "running") void this.ctx.resume().catch(() => {});
  }

  get running(): boolean {
    return this.ctx?.state === "running";
  }

  get time(): number {
    return this.ctx?.currentTime ?? 0;
  }

  play(track: TrackId, step: number, at: number): void {
    const { ctx, master, noise } = this;
    if (!ctx || !master || !noise) return;

    const out = ctx.createGain();
    out.connect(master);
    const fade = (peak: number, seconds: number) => {
      out.gain.setValueAtTime(peak, at);
      out.gain.exponentialRampToValueAtTime(0.001, at + seconds);
    };

    if (track === "kick") {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, at);
      osc.frequency.exponentialRampToValueAtTime(45, at + 0.12);
      fade(0.9, 0.24);
      osc.connect(out);
      osc.start(at);
      osc.stop(at + 0.26);
      return;
    }

    if (track === "bass") {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(BASS_HZ[step], at);
      const low = ctx.createBiquadFilter();
      low.type = "lowpass";
      low.frequency.value = 520;
      fade(0.4, 0.22);
      osc.connect(low);
      low.connect(out);
      osc.start(at);
      osc.stop(at + 0.24);
      return;
    }

    // Snare and hi-hat: the same noise, filtered high and cut short.
    const source = ctx.createBufferSource();
    source.buffer = noise;
    const high = ctx.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = track === "snare" ? 1400 : 7000;
    fade(track === "snare" ? 0.5 : 0.22, track === "snare" ? 0.16 : 0.05);
    source.connect(high);
    high.connect(out);
    source.start(at);
    source.stop(at + 0.2);
  }

  close(): void {
    void this.ctx?.close().catch(() => {});
    this.ctx = null;
  }
}

/**
 * A 16-step sequencer: the home's way of saying "made to be played".
 *
 * Notes are scheduled a little ahead on the audio clock, so the rhythm does
 * not wobble with the page's timers. If the browser gives no sound, the
 * pattern still runs on the page clock and the readout says there is no sound.
 */
export function Sequencer({ labels }: { labels: SequencerLabels }) {
  const [steps, setSteps] = useState<boolean[][]>(() => STARTER.map((track) => [...track]));
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(-1);
  const [sound, setSound] = useState<SoundState>("idle");
  /** The one step that is in the tab order; arrows move it. */
  const [cursor, setCursor] = useState<readonly [number, number]>([0, 0]);

  /** The pattern that Clear removed, kept until the next edit so it can come back. */
  const [cleared, setCleared] = useState<boolean[][] | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const voicesRef = useRef<Voices | null>(null);
  const stepsRef = useRef(steps);
  const run = useRef({
    timer: 0,
    frame: 0,
    nextTime: 0,
    nextStep: 0,
    onAudioClock: false,
    startedAt: 0,
    shown: -1,
    queue: [] as { step: number; time: number }[],
  });

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  const halt = useCallback(() => {
    const state = run.current;
    window.clearInterval(state.timer);
    window.cancelAnimationFrame(state.frame);
    state.queue.length = 0;
    state.shown = -1;
    setPlaying(false);
    setPosition(-1);
  }, []);

  const start = useCallback(() => {
    const voices = (voicesRef.current ??= new Voices());
    voices.wake();

    const state = run.current;
    const pageNow = () => performance.now() / 1000;
    state.onAudioClock = voices.running;
    state.nextTime = (state.onAudioClock ? voices.time : pageNow()) + 0.06;
    state.nextStep = 0;
    state.startedAt = pageNow();
    state.queue.length = 0;
    state.shown = -1;

    const schedule = () => {
      // The audio clock starts a moment after the click: follow it when it does.
      if (voices.running !== state.onAudioClock) {
        state.onAudioClock = voices.running;
        state.nextTime = (state.onAudioClock ? voices.time : pageNow()) + 0.06;
        state.queue.length = 0;
      }
      const now = state.onAudioClock ? voices.time : pageNow();
      while (state.nextTime < now + LOOKAHEAD_SECONDS) {
        if (state.onAudioClock) {
          TRACKS.forEach((track, index) => {
            if (stepsRef.current[index][state.nextStep]) voices.play(track, state.nextStep, state.nextTime);
          });
        }
        state.queue.push({ step: state.nextStep, time: state.nextTime });
        state.nextTime += STEP_SECONDS;
        state.nextStep = (state.nextStep + 1) % STEPS;
      }
    };

    const draw = () => {
      const now = state.onAudioClock ? voices.time : pageNow();
      let shown = state.shown;
      while (state.queue.length > 0 && state.queue[0].time <= now) {
        shown = state.queue.shift()!.step;
      }
      if (shown !== state.shown) {
        state.shown = shown;
        setPosition(shown);
      }
      if (voices.running) setSound("on");
      else if (pageNow() - state.startedAt > SILENT_AFTER_SECONDS) setSound("off");
      state.frame = window.requestAnimationFrame(draw);
    };

    schedule();
    state.timer = window.setInterval(schedule, SCHEDULER_MS);
    state.frame = window.requestAnimationFrame(draw);
    setPlaying(true);
  }, []);

  // Stop when the tab goes to the background, and clean up on the way out.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) halt();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      halt();
      voicesRef.current?.close();
      voicesRef.current = null;
    };
  }, [halt]);

  const toggleStep = (track: number, step: number) => {
    setCleared(null);
    setSteps((current) =>
      current.map((line, index) =>
        index === track ? line.map((on, column) => (column === step ? !on : on)) : line,
      ),
    );
  };

  const empty = steps.every((track) => track.every((on) => !on));
  /**
   * One button, three jobs. With a pattern on the grid it clears it, and then
   * offers to undo that. On a grid emptied by hand it offers the starter.
   */
  const secondaryLabel = cleared ? labels.undo : empty ? labels.restore : labels.clear;
  const onSecondary = () => {
    if (cleared) {
      setSteps(cleared);
      setCleared(null);
    } else if (empty) {
      setSteps(STARTER.map((track) => [...track]));
    } else {
      setCleared(steps);
      setSteps(STARTER.map((track) => track.map(() => false)));
    }
  };

  /** One tab stop for the whole grid; arrows, Home and End move inside it. */
  const onGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let [track, step] = cursor;
    switch (event.key) {
      case "ArrowRight":
        step = (step + 1) % STEPS;
        break;
      case "ArrowLeft":
        step = (step + STEPS - 1) % STEPS;
        break;
      case "ArrowDown":
        track = Math.min(track + 1, TRACKS.length - 1);
        break;
      case "ArrowUp":
        track = Math.max(track - 1, 0);
        break;
      case "Home":
        step = 0;
        break;
      case "End":
        step = STEPS - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setCursor([track, step]);
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-cell="${track}-${step}"]`)?.focus();
  };

  const stepNumber = position < 0 ? null : String(position + 1).padStart(2, "0");

  return (
    <div className="seq" data-surface="inverse">
      <div className="seq__bar">
        <button
          type="button"
          className="btn seq__play"
          data-playing={playing ? "" : undefined}
          onClick={playing ? halt : start}
        >
          <span className="seq__icon" aria-hidden="true">
            <svg className="seq__icon-play" viewBox="0 0 16 16">
              <path d="M3 1.8v12.4L14 8z" fill="currentColor" />
            </svg>
            <svg className="seq__icon-stop" viewBox="0 0 16 16">
              <rect x="2.5" y="2.5" width="11" height="11" rx="2" fill="currentColor" />
            </svg>
          </span>
          {playing ? labels.stop : labels.play}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onSecondary}>
          {secondaryLabel}
        </button>

        <div className="seq__readout">
          <span className="label seq__sound" role="status">
            {labels.sound[sound]}
          </span>
          <span className="label">{labels.tempo}</span>
          <span className="label seq__position">
            {stepNumber ? labels.position.replace("{step}", stepNumber) : labels.positionIdle}
          </span>
        </div>
      </div>

      <div ref={gridRef} className="seq__grid" role="group" aria-label={labels.steps} onKeyDown={onGridKeyDown}>
        {TRACKS.map((track, trackIndex) => (
          <div key={track} className="seq__track" role="group" aria-label={labels.tracks[track]}>
            <span className="seq__name" aria-hidden="true">
              {labels.tracks[track]}
            </span>
            <div className="seq__steps">
              {steps[trackIndex].map((on, stepIndex) => (
                <button
                  key={stepIndex}
                  type="button"
                  className="seq__step"
                  data-cell={`${trackIndex}-${stepIndex}`}
                  data-beat={stepIndex % 4 === 0 ? "" : undefined}
                  data-now={playing && position === stepIndex ? "" : undefined}
                  aria-pressed={on}
                  aria-label={labels.step
                    .replace("{track}", labels.tracks[track])
                    .replace("{step}", String(stepIndex + 1))}
                  tabIndex={cursor[0] === trackIndex && cursor[1] === stepIndex ? 0 : -1}
                  onClick={() => toggleStep(trackIndex, stepIndex)}
                  onFocus={() => setCursor([trackIndex, stepIndex])}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="seq__foot">
        <span className="small">{labels.legend}</span>
        <span className="label">{labels.size}</span>
      </div>
    </div>
  );
}
