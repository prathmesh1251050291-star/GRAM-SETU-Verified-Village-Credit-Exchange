import { useCallback, useEffect, useMemo, useState } from "react";

function pickVoice(voices, languageCode) {
  const normalized = (languageCode || "").toLowerCase();
  return (
    voices.find((voice) => voice.lang.toLowerCase() === normalized) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(normalized.split("-")[0])) ||
    null
  );
}

export function useRiskSpeech(defaultLanguage = "en-IN") {
  const synthesis = typeof window !== "undefined" ? window.speechSynthesis : null;
  const isSupported = Boolean(synthesis && typeof window.SpeechSynthesisUtterance !== "undefined");
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!isSupported) {
      return undefined;
    }

    const loadVoices = () => {
      setVoices(synthesis.getVoices());
    };

    loadVoices();
    synthesis.addEventListener("voiceschanged", loadVoices);
    return () => synthesis.removeEventListener("voiceschanged", loadVoices);
  }, [isSupported, synthesis]);

  const cancelNarration = useCallback(() => {
    if (isSupported) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported, synthesis]);

  const speakRiskNarration = useCallback(
    ({ riskScore, explanation, language = defaultLanguage, rate = 1, pitch = 1, volume = 1 }) => {
      if (!isSupported) {
        return Promise.resolve(false);
      }

      const utterance = new window.SpeechSynthesisUtterance(
        `Risk score is ${riskScore}. ${explanation || ""}`.trim()
      );
      utterance.lang = language;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      const voice = pickVoice(voices, language);
      if (voice) {
        utterance.voice = voice;
      }

      setIsSpeaking(true);
      synthesis.cancel();
      synthesis.speak(utterance);

      return new Promise((resolve) => {
        utterance.onend = () => {
          setIsSpeaking(false);
          resolve(true);
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          resolve(false);
        };
      });
    },
    [defaultLanguage, isSupported, synthesis, voices]
  );

  useEffect(() => cancelNarration, [cancelNarration]);

  const availableLanguages = useMemo(() => [...new Set(voices.map((voice) => voice.lang))], [voices]);

  return {
    isSupported,
    isSpeaking,
    availableLanguages,
    speakRiskNarration,
    cancelNarration,
  };
}
