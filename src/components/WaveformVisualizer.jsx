// WaveformVisualizer Component

import { useEffect, useRef } from 'react';
import { UI_CONSTANTS } from '../utils/constants.js';

export default function WaveformVisualizer({ stream, isActive = true }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    // Setup audio context and analyser
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    // Start visualization
    visualize();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stream]);

  const visualize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    
    if (!ctx || !analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.fillStyle = '#f9fafb'; // gray-50
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / UI_CONSTANTS.waveformBars;
      const spacing = 2;
      let x = 0;

      for (let i = 0; i < UI_CONSTANTS.waveformBars; i++) {
        const dataIndex = Math.floor((i / UI_CONSTANTS.waveformBars) * bufferLength);
        const barHeight = (dataArray[dataIndex] / 255) * canvas.height;

        // Color gradient based on activity
        const opacity = isActive ? 1 : 0.3;
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, `rgba(37, 99, 235, ${opacity})`); // primary-600
        gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`); // primary-500

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - spacing, barHeight);

        x += barWidth;
      }
    };

    draw();
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg border border-gray-200 p-4">
      <canvas
        ref={canvasRef}
        width={800}
        height={UI_CONSTANTS.waveformHeight}
        className="w-full h-full"
        style={{ height: `${UI_CONSTANTS.waveformHeight}px` }}
      />
    </div>
  );
}
