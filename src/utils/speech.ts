/**
 * High-Precision Speech Synthesis & Voice Recognition Engine for Pip
 * Enables Pip to speak aloud automatically and listen to user's voice via microphone.
 */

export interface SpeechCaptionListener {
  (caption: string, isSpeaking: boolean): void;
}

class PipSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private captionListeners: SpeechCaptionListener[] = [];
  public isListening: boolean = false;
  public isSpeaking: boolean = false;
  public enabled: boolean = true;
  public voicePitch: number = 1.0;
  public voiceRate: number = 1.05;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  public subscribeCaptions(listener: SpeechCaptionListener) {
    this.captionListeners.push(listener);
    return () => {
      this.captionListeners = this.captionListeners.filter((l) => l !== listener);
    };
  }

  private notifyCaptions(text: string, isSpeaking: boolean) {
    this.captionListeners.forEach((l) => l(text, isSpeaking));
  }

  /**
   * Speak message aloud as Pip with high-clarity voice
   */
  public speak(text: string, onEnd?: () => void) {
    if (!this.enabled || !this.synth) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.synth.cancel(); // Stop any pending speech

      // Clean markdown tags for natural speech
      const cleanText = text
        .replace(/[*#_`~>]/g, '')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/\n+/g, ' ');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.pitch = this.voicePitch;
      utterance.rate = this.voiceRate;

      // Select best futuristic / natural English voice
      const voices = this.synth.getVoices();
      const preferred =
        voices.find((v) => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen')) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0];

      if (preferred) {
        utterance.voice = preferred;
      }

      this.isSpeaking = true;
      this.notifyCaptions(cleanText, true);

      utterance.onend = () => {
        this.isSpeaking = false;
        this.notifyCaptions('', false);
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        this.notifyCaptions('', false);
        if (onEnd) onEnd();
      };

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      this.isSpeaking = false;
      this.notifyCaptions('', false);
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.notifyCaptions('', false);
    }
  }

  /**
   * Listen to user speech from microphone
   */
  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition not supported in this browser.');
      return;
    }

    try {
      this.isListening = true;
      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (final) {
          onResult(final.trim(), true);
          this.isListening = false;
        } else if (interim) {
          onResult(interim.trim(), false);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        if (onError) onError(event.error || 'Recognition error');
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    } catch (e: any) {
      this.isListening = false;
      if (onError) onError(e.message || 'Failed to start mic');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
    }
  }
}

export const pipSpeech = new PipSpeechEngine();
