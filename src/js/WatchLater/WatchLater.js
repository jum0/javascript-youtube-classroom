import {
  MESSAGE,
  MAX_SAVED_VIDEOS_COUNT,
  LOCAL_STORAGE_KEY,
  CLASSNAME,
} from "../constants.js";
import deliveryMan from "../deliveryMan.js";
import { $, $show, $hide } from "../utils/querySelector.js";

export default class WatchLater {
  constructor() {
    this.savedVideoIds =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.SAVED_VIDEO_IDS)) || [];

    this.$noSavedVideoImage = $(CLASSNAME.NO_SAVED_VIDEO_IMAGE);

    deliveryMan.addMessageListener(
      MESSAGE.SAVE_VIDEO_BUTTON_CLICKED,
      this.saveVideoId.bind(this)
    );

    deliveryMan.addMessageListener(
      MESSAGE.HIDE_IF_VIDEO_IS_SAVED,
      this.hideIfVideoIsSaved.bind(this)
    );

    this.render();
  }

  saveVideoId({ videoId }) {
    this.savedVideoIds.push(videoId);
    this.savedVideoIds = this.savedVideoIds.slice(-MAX_SAVED_VIDEOS_COUNT);

    localStorage.setItem(
      LOCAL_STORAGE_KEY.SAVED_VIDEO_IDS,
      JSON.stringify(this.savedVideoIds)
    );

    deliveryMan.deliverMessage(MESSAGE.VIDEO_SAVED, {
      savedVideosCount: this.savedVideoIds.length,
    });

    this.render();
  }

  hideIfVideoIsSaved({ videoId, callback }) {
    if (this.savedVideoIds.includes(videoId)) {
      callback();
    }
  }

  render() {
    if (this.savedVideoIds.length === 0) {
      $show(this.$noSavedVideoImage);
      return;
    }

    $hide(this.$noSavedVideoImage);
  }
}
