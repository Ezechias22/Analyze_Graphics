import { useCallback } from 'react';

export const useSound = () => {
  const playSound = useCallback((type: string) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const createBeep = (frequency: number, duration: number, volume: number = 0.3) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      };

      const createNotification = (frequencies: number[], durations: number[]) => {
        frequencies.forEach((freq, index) => {
          setTimeout(() => {
            createBeep(freq, durations[index] || 0.2);
          }, index * 150);
        });
      };

      switch (type) {
        case 'upload':
          createBeep(800, 0.1, 0.2);
          break;
        
        case 'analyzing':
          // Son de traitement - série de bips courts
          [600, 700, 800].forEach((freq, index) => {
            setTimeout(() => createBeep(freq, 0.1, 0.15), index * 100);
          });
          break;
        
        case 'analysis-complete':
          // Son de succès - mélodie ascendante
          createNotification([523, 659, 784, 1047], [0.15, 0.15, 0.15, 0.3]);
          break;
        
        case 'buy':
          // Son d'achat - tons verts/positifs
          createNotification([659, 784, 988], [0.2, 0.2, 0.4]);
          break;
        
        case 'sell':
          // Son de vente - tons descendants
          createNotification([988, 784, 659], [0.2, 0.2, 0.4]);
          break;
        
        case 'session-start':
          // Son de démarrage de session
          createNotification([440, 554, 659], [0.15, 0.15, 0.25]);
          break;
        
        case 'session-warning':
          // Son d'alerte - 10 secondes restantes
          createBeep(1200, 0.1, 0.4);
          setTimeout(() => createBeep(1200, 0.1, 0.4), 200);
          break;
        
        case 'session-end':
          // Son de fin de session - mélodie descendante
          createNotification([1047, 784, 659, 523], [0.2, 0.2, 0.2, 0.4]);
          break;
        
        case 'tick':
          // Son de tick pour les dernières secondes
          createBeep(1000, 0.05, 0.3);
          break;
        
        case 'error':
          // Son d'erreur
          createNotification([400, 300, 200], [0.2, 0.2, 0.3]);
          break;
        
        case 'hover':
          // Son subtil au survol
          createBeep(600, 0.05, 0.1);
          break;
        
        default:
          createBeep(500, 0.1, 0.2);
      }
    } catch (error) {
      console.log('Audio not supported or blocked');
    }
  }, []);

  return { playSound };
};