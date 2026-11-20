"use client";

import { useEffect } from "react";

import { restoreMotionChoice, setMotionPaused, useMotionPaused } from "./motion";

interface MotionToggleProps {
  pauseLabel: string;
  resumeLabel: string;
}

/**
 * Pauses and resumes every looping animation on the site. Motion that runs by
 * itself for more than a few seconds needs a way to stop it that does not
 * depend on a system setting.
 */
export function MotionToggle({ pauseLabel, resumeLabel }: MotionToggleProps) {
  const paused = useMotionPaused();

  useEffect(() => {
    restoreMotionChoice();
  }, []);

  return (
    <button type="button" className="motion-toggle label" onClick={() => setMotionPaused(!paused)}>
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        {paused ? (
          <path d="M4 2.5v11L13.5 8z" fill="currentColor" />
        ) : (
          <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" />
        )}
      </svg>
      {paused ? resumeLabel : pauseLabel}
    </button>
  );
}
