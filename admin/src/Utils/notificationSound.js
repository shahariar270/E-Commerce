let audioCtx = null;

// Two-tone "ding" synthesized with the Web Audio API — no asset file needed,
// and it works the moment a user has interacted with the page at least once
// (autoplay policies suspend the context otherwise, so failures are swallowed).
export const playNotificationSound = () => {
    try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }

        const now = audioCtx.currentTime;
        [880, 1320].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const start = now + i * 0.09;

            osc.type = 'sine';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(start);
            osc.stop(start + 0.3);
        });
    } catch {
        // Web Audio unsupported/blocked — sound is a nice-to-have, not critical.
    }
};
