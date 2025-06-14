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

	function debugButtons() {
		const labeledButtons = document.querySelectorAll("button.hasLabel");
		console.log("Buttons with hasLabel class:", Array.from(labeledButtons));
	}

	function startSkipIntro() {
		if (interval) return;

		// console.log(
		//   "%cStarting skip intro/ads interval...",
		//   "color: red; font-size: 20px;"
		// );
		interval = setInterval(async () => {
			debugButtons();
			const netflixSkipButton = document.querySelector('button[data-uia="player-skip-intro"]');
			const netflixNextEpisodeButton = document.querySelector('button[data-uia="next-episode-seamless-button"]');
			const netflixNextEpisodeButton2 = document.querySelector('button[data-uia="next-episode-seamless-button-draining"]');
			const netflixSkipRecapButton = document.querySelector('button[data-uia="player-skip-recap"]');
			const primeSkipButton = document.querySelector(".atvwebplayersdk-skipelement-button");
			const primeNextEpisodeButton = document.querySelector(".atvwebplayersdk-nextupcard-button");
			const disneySkipEpisodeButton = document.querySelector(".skip__button");
			const disneyNextEpisodeButton = document.querySelector('[aria-label^="NEXT EPISODE IN"]');
			const wowNextEpisodeButton = document.querySelector("a.playback-binge__card");

			const buttons = [
				netflixSkipButton,
				netflixNextEpisodeButton,
				netflixNextEpisodeButton2,
				netflixSkipRecapButton,
				primeSkipButton,
				primeNextEpisodeButton,
				disneySkipEpisodeButton,
				disneyNextEpisodeButton,
				wowNextEpisodeButton,
			];

			const buttonToClick = buttons.find((button) => button);

			if (buttonToClick) {
				console.log("Button found:", buttonToClick);
				buttonToClick.click();
				stopSkipIntro();
				await waitMS(1000);
				startSkipIntro();
			} else {
				console.log("No actionable buttons found.");
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
