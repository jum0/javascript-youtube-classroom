import {
  MESSAGE,
  MAX_SAVED_VIDEOS_COUNT,
  LOCAL_STORAGE_KEY,
  CLASSNAME,
} from "../constants.js";
import deliveryMan from "../deliveryMan.js";
import { $ } from "../utils/DOM.js";
import { renderWatchLaterVideo, VIDEO_TEMPLATE } from "../utils/videoInfo.js";

export default class WatchLaterVideoWrapper {
  constructor() {
    this.savedVideoItemsMap = new Map(
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.SAVED_VIDEO_ITEMS))
    );

    this.savedVideosMap = new Map();

    this.$noSavedVideoImage = $(CLASSNAME.NO_SAVED_VIDEO_IMAGE);
    this.$watchLaterVideoWrapper = $(CLASSNAME.WATCH_LATER_VIDEO_WRAPPER);

    deliveryMan.addMessageListener(
      MESSAGE.SAVE_VIDEO_BUTTON_CLICKED,
      this.saveVideoItem.bind(this)
    );

    deliveryMan.addMessageListener(
      MESSAGE.HIDE_IF_VIDEO_IS_SAVED,
      this.hideIfVideoIsSaved.bind(this)
    );

    this.$watchLaterVideoWrapper.addEventListener("click", (event) => {
      if (event.target.classList.contains(CLASSNAME.DELETE_ICON)) {
        // eslint-disable-next-line no-alert
        if (window.confirm("정말 삭제하시겠습니까?")) {
          const { videoId } = event.target.parentElement.dataset;
          this.deleteVideo(videoId);
        }
      }
    });

    this.render();
  }

  deleteVideo(videoId) {
    this.savedVideoItemsMap.delete(videoId);

    this.updateLocalStorage();

    this.savedVideosMap.get(videoId).remove();
    this.savedVideosMap.delete(videoId);

    if (this.savedVideosMap.size === 0) {
      $.show(this.$noSavedVideoImage);
    }
  }

  saveVideoItem({ videoId, item }) {
    this.savedVideoItemsMap.set(videoId, item);

    if (this.savedVideoItemsMap.size > MAX_SAVED_VIDEOS_COUNT) {
      this.savedVideoItemsMap = new Map(
        Array.from(this.savedVideoItemsMap).slice(-MAX_SAVED_VIDEOS_COUNT)
      );
      this.$watchLaterVideoWrapper.children[
        this.$watchLaterVideoWrapper.childElementCount - 1
      ].remove();
    }

    this.updateLocalStorage();

    deliveryMan.deliverMessage(MESSAGE.VIDEO_SAVED, {
      savedVideosCount: this.savedVideoItemsMap.size,
    });

    this.renderSingleVideo(item);
  }

  updateLocalStorage() {
    localStorage.setItem(
      LOCAL_STORAGE_KEY.SAVED_VIDEO_ITEMS,
      JSON.stringify(this.savedVideoItemsMap, (key, value) =>
        value instanceof Map ? Array.from(value) : value
      )
    );
  }

  hideIfVideoIsSaved({ videoId, callback }) {
    if (this.savedVideoItemsMap.has(videoId)) {
      callback();
    }
  }

  render() {
    if (this.savedVideoItemsMap.size === 0) {
      $.show(this.$noSavedVideoImage);
      return;
    }

    this.savedVideoItemsMap.forEach(this.renderSingleVideo.bind(this));
  }

  renderSingleVideo(item) {
    $.hide(this.$noSavedVideoImage);

    this.$watchLaterVideoWrapper.insertAdjacentHTML(
      "afterBegin",
      VIDEO_TEMPLATE
    );

    const $video = this.$watchLaterVideoWrapper.children[0];
    renderWatchLaterVideo($video, item);

    const { videoId } = item.id;
    this.savedVideosMap.set(videoId, $video);
  }
}
