declare module 'react-speech-kit' {
  export interface SpeechSynthesisVoice {
    voiceURI: string;
    name: string;
    lang: string;
    localService: boolean;
    default: boolean;
  }

  export interface SpeechSynthesisOptions {
    text: string;
    voice?: SpeechSynthesisVoice | null;
    rate?: number;
    pitch?: number;
    volume?: number;
  }

  export interface UseSpeechSynthesisResult {
    speak: (options: SpeechSynthesisOptions) => void;
    speaking: boolean;
    supported: boolean;
    voices: SpeechSynthesisVoice[];
  }

  export function useSpeechSynthesis(): UseSpeechSynthesisResult;
}