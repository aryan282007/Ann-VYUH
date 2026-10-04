const BCP47 = { en: 'en-IN', hi: 'hi-IN' };

export async function speakText(text, lang) {
  if (!text) return;
  cancelSpeech();

  return new Promise((resolve) => {
    if (!window.speechSynthesis) return resolve();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = BCP47[lang] || 'hi-IN';
    utterance.onend = resolve;
    utterance.onerror = resolve;
    window.speechSynthesis.speak(utterance);
  });
}

export function cancelSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
