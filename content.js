chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    var video = document.getElementsByTagName("video")[0];

    //Listen PlayPause events  
    if (request.message === "toggle_video_state") {
      if (video) {
        if (video.paused) {
          video.play();
          sendResponse({
            paused: false,
            tabId: request.tabId
          });
        } else {
          video.pause();
          sendResponse({
            paused: true,
            tabId: request.tabId
          });
        }
      } else {
        sendResponse({
          error: 'No video object found'
        });
      }
    }

    //Increment Volume
    if (request.message === "increment_volume") {
      if (video) {
        var volume_value = video.volume;
        if ((volume_value + 0.1) > 1.0) {
          video.volume = 1.0;
        } else {
          video.volume += 0.1;
        }
      } else {
        sendResponse({
          error: 'No video object found'
        });
      }
    }

    //Decrement Volume
    if (request.message === "decrement_volume") {
      if (video) {
        var volume_value = video.volume;
        if ((volume_value - 0.1) < 0.0) {
          video.volume = 0.0;
        } else {
          video.volume -= 0.1;
        }
      } else {
        sendResponse({
          error: 'No video object found'
        });
      }
    }

  }
);
