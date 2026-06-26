import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./styles.scss";
import { dismissNotification } from "@Store/slices/notificationSlice";

/* ------------------------------------------------------------------ */
/*  Per-toast props (as specified):                                    */
/*    type    : 'success' | 'warning' | 'error'                        */
/*    message : string                                                  */
/*    timeout : number (ms) — default 4000                              */
/*    onClose : () => void  — removes the toast from the queue          */
/* ------------------------------------------------------------------ */

const ICONS = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

const TITLE = {
  success: "Success",
  warning: "Warning",
  error: "Error",
};

const Toast = ({ id, type = "success", message, timeout = 4000, onClose }) => {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(100);
  const [leaving, setLeaving] = useState(false);

  // Refs so the single interval can read the latest paused state.
  const remainingRef = useRef(timeout);
  const lastTickRef = useRef(null);
  const pausedRef = useRef(false);
  const intervalRef = useRef(null);

  const close = useCallback(() => {
    // Animate out, then remove from the queue.
    setLeaving(true);
    setTimeout(() => {
      dispatch(dismissNotification(id));
      onClose?.();
    }, 220);
  }, [dispatch, id, onClose]);

  useEffect(() => {
    if (timeout <= 0) return; // 0 = sticky, no auto-dismiss

    lastTickRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      if (pausedRef.current) {
        // Keep lastTick fresh so we don't jump when resuming.
        lastTickRef.current = Date.now();
        return;
      }
      const now = Date.now();
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;

      remainingRef.current -= elapsed;

      const pct = Math.max(0, (remainingRef.current / timeout) * 100);
      setProgress(pct);

      if (remainingRef.current <= 0) {
        clearInterval(intervalRef.current);
        close();
      }
    }, 30);

    return () => clearInterval(intervalRef.current);
  }, [timeout, close]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    if (!pausedRef.current) return;
    pausedRef.current = false;
    lastTickRef.current = Date.now(); // restart the elapsed window
  };

  return (
    <div
      className={`st-toast st-toast--${type} ${leaving ? "is-leaving" : ""}`}
      role="alert"
      aria-live="assertive"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="st-toast__icon">{ICONS[type] || ICONS.success}</div>

      <div className="st-toast__body">
        <span className="st-toast__title">{TITLE[type] || "Notification"}</span>
        <span className="st-toast__message">{message}</span>
      </div>

      <button
        type="button"
        className="st-toast__close"
        aria-label="Dismiss notification"
        onClick={close}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Timeout countdown bar along the bottom edge. Pauses with hover. */}
      {timeout > 0 && (
        <span
          className="st-toast__progress"
          aria-hidden="true"
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Global container — stacks toasts vertically from the top-right.    */
/* ------------------------------------------------------------------ */

const Notifications = () => {
  const notifications = useSelector((state) => state.notification.notifications);

  return (
    <div className="st-toast-container" aria-live="polite" aria-label="Notifications">
      {notifications.map((n) => (
        <Toast
          key={n.id}
          id={n.id}
          type={n.type}
          message={n.message}
          timeout={n.timeout}
        />
      ))}
    </div>
  );
};

export default Notifications;
