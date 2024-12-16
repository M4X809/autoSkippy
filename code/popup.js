const toggleSwitch = document.getElementById("extension-toggle");

// Load the saved state
chrome.storage.sync
  .get("extensionEnabled")
  .then((result) => {
    if (result.extensionEnabled !== undefined && result.extensionEnabled) {
      toggleSwitch.checked = true;
    }
  })
  .catch((error) => {
    console.error("Error retrieving extension state:", error);
  });

// Function to set the UI based on the detected platform
function setPlatformUI(platform) {
  const platformIcon = document.getElementById("platform-icon");
  const platformText = document.getElementById("platform-text");
  const platformBadge = document.getElementById("platform-badge");

  switch (platform) {
    case "netflix":
      // platformBadge.classList.add("hide");
      platformIcon.src = "/assets/icons8-netflix-96.png";
      platformText.innerText = "Skip Intro, Recap & Next Episode";
      break;
    case "prime":
      // platformBadge.classList.add("hide");
      platformIcon.src = "/assets/icons8-amazon-prime-video-96.png";
      platformText.innerText = "Skip Intro, Recap & Next Episode";
      break;
    case "disney":
      // platformBadge.classList.remove("hide");
      platformIcon.src = "/assets/icons8-disney-plus-96.png";
      platformText.innerText = "Skip Intro & Next Episode";
      break;
    default:
      // platformBadge.classList.add("hide");
      platformIcon.src = "/assets/icons8-no-96.png";
      platformText.innerText = "No supported platform detected";
  }
}

// Get the active tab's URL and set the platform UI
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0].url;
  if (url.includes("netflix.com")) {
    setPlatformUI("netflix");
  } else if (url.includes("amazon.de")) {
    setPlatformUI("prime");
  } else if (url.includes("disneyplus.com")) {
    setPlatformUI("disney");
  } else {
    setPlatformUI("default");
  }
});

toggleSwitch.addEventListener("change", () => {
  if (toggleSwitch.checked) {
    chrome.storage.sync.set({ extensionEnabled: true });
  } else {
    chrome.storage.sync.set({ extensionEnabled: false });
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   chrome.scripting
    //     .executeScript({
    //       target: { tabId: tabs[0].id },
    //       func: () => {
    //         if (window.stopSkipIntro) {
    //           window.stopSkipIntro();
    //         }
    //       },
    //     })
    //     .catch((err) => console.error("Script injection failed:", err));
    // });
  }
});

// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//   chrome.scripting
//     .executeScript({
//       target: { tabId: tabs[0].id },
//       files: ["script.js"],
//     })
//     .catch((err) => console.error("Script injection failed:", err));
// });
