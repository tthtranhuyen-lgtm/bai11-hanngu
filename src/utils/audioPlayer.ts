import { VocabWord, DialogueLine, VOCAB_WORDS } from '../data/chineseData';
import exampleAudioMapRaw from '../data/exampleAudioMap.json';

const exampleAudioMap: Record<string, string> = exampleAudioMapRaw as Record<string, string>;

let audioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    } catch {
      // ignore
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Sound effects using Web Audio
export function playSfxClick() {
  const ac = getAudioContext();
  if (!ac) return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(660, t);
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(0.08, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.14);
}

export function playSfxSlice() {
  const ac = getAudioContext();
  if (!ac) return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1300, t);
  osc.frequency.exponentialRampToValueAtTime(320, t + 0.11);
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(0.25, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.13);
}

export function playSfxMiss() {
  const ac = getAudioContext();
  if (!ac) return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(220, t);
  osc.frequency.exponentialRampToValueAtTime(70, t + 0.28);
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.3);
}

export function playSfxSuccess() {
  const ac = getAudioContext();
  if (!ac) return;
  const t = ac.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t + idx * 0.08);
    gain.gain.setValueAtTime(0.001, t + idx * 0.08);
    gain.gain.linearRampToValueAtTime(0.15, t + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.22);
    osc.connect(gain).connect(ac.destination);
    osc.start(t + idx * 0.08);
    osc.stop(t + idx * 0.08 + 0.24);
  });
}

// Active single audio element for prompt clicks
let currentSingleAudio: HTMLAudioElement | null = null;

export function stopAllAudio() {
  if (currentSingleAudio) {
    currentSingleAudio.pause();
    currentSingleAudio.currentTime = 0;
    currentSingleAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Safely resolves an asset URL relative to Vite base (e.g. for GitHub Pages subpath hosting)
 */
export function resolveAssetUrl(url: string): string {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  const clean = url.startsWith('/') ? url.slice(1) : url;
  const base = import.meta.env.BASE_URL || './';
  return `${base}${clean}`;
}

/**
 * Play an audio URL with speed setting and fallback to SpeechSynthesis
 */
export function playAudioUrl(
  url: string,
  speed: number = 1.0,
  fallbackText?: string,
  onEnd?: () => void
): Promise<void> {
  return new Promise((resolve) => {
    stopAllAudio();
    const rawTarget = url || (fallbackText && exampleAudioMap[fallbackText]) || '';
    const targetUrl = resolveAssetUrl(rawTarget);

    if (!targetUrl && fallbackText) {
      // Use standard Google TTS URL
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        fallbackText
      )}&tl=zh-CN&client=tw-ob`;
      return playAudioUrl(ttsUrl, speed, fallbackText, onEnd).then(resolve);
    }

    const audio = new Audio(targetUrl);
    currentSingleAudio = audio;
    audio.playbackRate = speed;

    const cleanupAndResolve = () => {
      audio.onended = null;
      audio.onerror = null;
      if (currentSingleAudio === audio) {
        currentSingleAudio = null;
      }
      if (onEnd) onEnd();
      resolve();
    };

    audio.onended = cleanupAndResolve;

    audio.onerror = () => {
      if (fallbackText) {
        speakFallback(fallbackText, speed, cleanupAndResolve);
      } else {
        cleanupAndResolve();
      }
    };

    audio.play().catch(() => {
      if (fallbackText) {
        speakFallback(fallbackText, speed, cleanupAndResolve);
      } else {
        cleanupAndResolve();
      }
    });
  });
}

/**
 * Play a specific sentence (checks example audio map first)
 */
export function playSentence(text: string, speed: number = 0.9): Promise<void> {
  const mappedUrl = exampleAudioMap[text];
  if (mappedUrl) {
    return playAudioUrl(mappedUrl, speed, text);
  }
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
    text
  )}&tl=zh-CN&client=tw-ob`;
  return playAudioUrl(ttsUrl, speed, text);
}

/**
 * Play a specific vocab word by Hanzi or ID
 */
export function playWord(wordOrHanzi: VocabWord | string, speed: number = 1.0): Promise<void> {
  let word: VocabWord | undefined;
  if (typeof wordOrHanzi === 'string') {
    word = VOCAB_WORDS.find((w) => w.h === wordOrHanzi || w.id === wordOrHanzi);
  } else {
    word = wordOrHanzi;
  }

  if (word && word.audioClip) {
    return playAudioUrl(word.audioClip, speed, word.h);
  }

  const textToSpeak = typeof wordOrHanzi === 'string' ? wordOrHanzi : word?.h || '';
  return playSentence(textToSpeak, speed);
}

/**
 * Play a specific dialogue line
 */
export function playDialogueLineAudio(line: DialogueLine, speed: number = 1.0): Promise<void> {
  return playAudioUrl(line.clip, speed, line.zh);
}

/**
 * SpeechSynthesis fallback for custom sentences
 */
export function speakFallback(text: string, rate: number = 0.85, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = rate;

  const voices = window.speechSynthesis.getVoices() || [];
  const cantoNames = ['sinji', 'cantonese', 'yue', 'zh-hk', 'zh_hk', 'hong kong'];
  const mandarinVoices = voices.filter((v) => {
    const lang = (v.lang || '').toLowerCase();
    const name = (v.name || '').toLowerCase();
    const isCanto = cantoNames.some((c) => lang.includes(c) || name.includes(c));
    return !isCanto && (lang.includes('zh') || name.includes('chinese') || name.includes('mandarin'));
  });

  const preferredVoice = mandarinVoices.find(
    (v) =>
      v.name.includes('Xiaoxiao') ||
      v.name.includes('Yunxi') ||
      v.name.includes('Ting-Ting') ||
      v.name.includes('Google 普通话')
  );

  if (preferredVoice) {
    u.voice = preferredVoice;
  }

  u.onend = () => {
    if (onEnd) onEnd();
  };
  u.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(u);
}
