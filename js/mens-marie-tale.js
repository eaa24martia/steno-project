"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", () => { // sikrer at JavaScript ikke prøver at bruge elementer på siden før de findes
    const overlay = document.getElementById("startOverlay");
    const mainContent = document.getElementById("mainContent");
    const voiceAudio1 = document.getElementById("voiceAudio1");

    // Hvis vi er på forsiden og har overlay og voiceAudio1
    if (overlay && mainContent && voiceAudio1) {
      overlay.addEventListener("click", () => {
        overlay.style.display = "none";
        mainContent.classList.remove("hidden");

        voiceAudio1.currentTime = 0;
        voiceAudio1.play().catch((error) => {
          console.error("Fejl ved afspilning af voiceAudio1:", error);
        });
      });

      return; 
    }

    // Ellers: Tjek for andre voice-audio-id'er til autoplay
    const possibleAudioIds = ['voiceAudioStart', 'voiceAudioQuiz', 'voiceAudioSpil'];
    for (const id of possibleAudioIds) {
      const audio = document.getElementById(id);
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.error(`Fejl ved automatisk afspilning (${id}):`, error);
        });
        break;
      }
    }
  });

  // Kør autoplay igen hvis brugeren bruger browserens back/forward-knap
  window.addEventListener("pageshow", () => {
    const possibleAudioIds = ['voiceAudioStart', 'voiceAudioQuiz', 'voiceAudioSpil'];
    for (const id of possibleAudioIds) {
      const audio = document.getElementById(id);
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.error(`Fejl ved pageshow-afspilning (${id}):`, error);
        });
        break;
      }
    }
  });
})();