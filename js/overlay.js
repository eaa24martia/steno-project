"use strict"

const overlay = document.getElementById("startOverlay");
  const audio = document.getElementById("voiceAudio1");
  const content = document.getElementById("mainContent");

// gemmer overlay ved klik og starter audio
  overlay.addEventListener("click", () => {
      overlay.classList.add("hidden");
      content.classList.remove("hidden");
      audio.play();
  });
  