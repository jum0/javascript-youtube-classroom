import {
  MESSAGE,
  MAX_SAVED_VIDEOS_COUNT,
  LOCAL_STORAGE_KEY,
  CLASSNAME,
} from "../constants.js";
import deliveryMan from "../deliveryMan.js";
import { $ } from "../utils/DOM.js";
import { renderVideo, VIDEO_TEMPLATE } from "../utils/videoInfo.js";

export default class WatchLaterVideoWrapper {
  constructor() {
    this.savedVideoItemsMap = new Map(
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.SAVED_VIDEO_ITEMS))
    );

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

    this.render(); // 전체 렌더
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

    localStorage.setItem(
      LOCAL_STORAGE_KEY.SAVED_VIDEO_ITEMS,
      JSON.stringify(this.savedVideoItemsMap, (key, value) =>
        value instanceof Map ? Array.from(value) : value
      )
    );

    deliveryMan.deliverMessage(MESSAGE.VIDEO_SAVED, {
      savedVideosCount: this.savedVideoItemsMap.size,
    });

    this.renderSingleVideo(item); // 하나만 렌더
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

    $.hide(this.$noSavedVideoImage);

    this.savedVideoItemsMap.forEach(this.renderSingleVideo.bind(this));
  }

  renderSingleVideo(item) {
    $.hide(this.$noSavedVideoImage);

    this.$watchLaterVideoWrapper.insertAdjacentHTML(
      "afterBegin",
      VIDEO_TEMPLATE
    );

    const $video = this.$watchLaterVideoWrapper.children[0];
    renderVideo($video, item);
  }
}
