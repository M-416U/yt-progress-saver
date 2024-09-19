window.onload = () => {
  let video = document.querySelector(".video-stream");

  if (!video) {
    return;
  }

  const videoId = window.location.href.split("v=")[1]?.split("&")[0];

  function formatTime(time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  }
  function removeBtn() {
    setTimeout(() => {
      const continueWatchBtn = document.querySelector("#continueWatchBtn");
      if (continueWatchBtn) {
        continueWatchBtn.remove();
      }
    }, 10 * 1000);
  }
  function createContinueButton(continueTime) {
    const button = document.createElement("button");
    button.id = "continueWatchBtn";
    button.innerHTML = `<span>&#10554;</span> Continue watching at ${formatTime(
      continueTime
    )}`;

    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.zIndex = "9999";
    button.style.padding = "12px 18px";
    button.style.fontSize = "18px";
    button.style.borderRadius = "8px";
    button.style.backgroundColor = "#F05365";
    button.style.color = "#ffffff";
    button.style.border = "none";
    button.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
    button.style.cursor = "pointer";
    button.style.transition = "background-color 0.3s ease";

    button.onmouseover = () => {
      button.style.backgroundColor = "#d54454";
    };
    button.onmouseout = () => {
      button.style.backgroundColor = "#F05365";
    };

    button.onclick = () => {
      video.currentTime = continueTime;
      button.remove();
    };

    document.body.appendChild(button);
  }

  function saveVideoProgress() {
    removeBtn();
    if (video && !video.ended) {
      chrome.storage.sync.set(
        {
          [videoId]: video.currentTime,
        },
        () => {}
      );
    }
  }

  function loadVideoProgress() {
    chrome.storage.sync.get(videoId, (result) => {
      if (result[videoId]) {
        const continueTime = result[videoId];
        createContinueButton(continueTime);
      } else {
      }
    });
  }

  function removeVideoProgress() {
    chrome.storage.sync.remove(videoId, () => {});
  }

  loadVideoProgress();
  video.addEventListener("timeupdate", saveVideoProgress);
  video.addEventListener("ended", removeVideoProgress);
};
