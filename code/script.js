(() => {
  // console.log("%cT.E.T.W. script loaded", "color: green; font-size: 20px;");
  let interval;

  chrome.storage.sync.get(["extensionEnabled"], (result) => {
    if (result.extensionEnabled) {
      startSkipIntro();
    }
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    // console.log(changes.extensionEnabled);
    if (changes.extensionEnabled) {
      if (changes.extensionEnabled.newValue) {
        startSkipIntro();
      } else {
        stopSkipIntro();
      }
    }
  });

  async function waitMS(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function startSkipIntro() {
    if (interval) return;

    // console.log(
    //   "%cStarting skip intro/ads interval...",
    //   "color: red; font-size: 20px;"
    // );
    interval = setInterval(async () => {
      const netflixSkipButton = document.querySelector(
        'button[data-uia="player-skip-intro"]'
      );
      const netflixNextEpisodeButton = document.querySelector(
        'button[data-uia="next-episode-seamless-button"]'
      );
      const netflixSkipRecapButton = document.querySelector(
        'button[data-uia="player-skip-recap"]'
      );
      const primeSkipButton = document.querySelector(
        ".atvwebplayersdk-skipelement-button"
      );
      const primeNextEpisodeButton = document.querySelector(
        ".atvwebplayersdk-nextupcard-button"
      );
      const disneySkipIntroButton = document.querySelector(
        'button[data-testid="skip-credits"]'
      );
      const disneyNextEpisodeButton = document.querySelector(
        'button[data-testid="next-episode-button"]'
      );

      const buttons = [
        netflixSkipButton,
        netflixNextEpisodeButton,
        netflixSkipRecapButton,
        primeSkipButton,
        primeNextEpisodeButton,
        disneySkipIntroButton,
        disneyNextEpisodeButton,
      ];

      const buttonToClick = buttons.find((button) => button);

      if (buttonToClick) {
        // console.log("Button found:", buttonToClick);
        buttonToClick.click();
        stopSkipIntro();
        await waitMS(5000);
        startSkipIntro();
      } else {
        // console.log("No actionable buttons found.");
      }
    }, 1000);
  }

  function stopSkipIntro() {
    clearInterval(interval);
    interval = null;
  }

  // Make stopSkipIntro available globally for the popup
  window.stopSkipIntro = stopSkipIntro;
})();
