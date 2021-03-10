import {
  CLASSNAME,
  MESSAGE,
  MAX_RESULTS_COUNT,
  API_END_POINT,
  SCROLL_EVENT_THRESHOLD,
  THROTTLE_TIME_IN_MS,
} from "../constants.js";
import { $ } from "../utils/DOM.js";
import deliveryMan from "../deliveryMan.js";
import { SKELETON_TEMPLATE, render } from "../utils/videoInfo.js";

export default class SearchVideoWrapper {
  constructor() {
    this.currentQuery = "";
    this.currentNextPageToken = "";

    this.$searchVideoWrapper = $(CLASSNAME.SEARCH_VIDEO_WRAPPER);
    this.$notFoundImg = $(CLASSNAME.NOT_FOUND_IMAGE);

    deliveryMan.addMessageListener(MESSAGE.KEYWORD_SUBMITTED, ({ query }) => {
      $.hide(this.$notFoundImg);
      this.$searchVideoWrapper.innerHTML = "";
      this.currentQuery = query;
      this.mountTemplate();
    });

    deliveryMan.addMessageListener(
      MESSAGE.DATA_LOADED,
      ({ nextPageToken, items }) => {
        if (items.length === 0) {
          this.$searchVideoWrapper.innerHTML = "";
          $.show(this.$notFoundImg);

          return;
        }

        this.attachData({ nextPageToken, items });
      }
    );

    this.$searchVideoWrapper.addEventListener(
      "scroll",
      this.handlePageScroll.bind(this)
    );

    this.$searchVideoWrapper.addEventListener("click", (event) => {
      if (!event.target.classList.contains(CLASSNAME.SAVE_VIDEO_BUTTON)) {
        return;
      }

      this.saveVideo(event.target);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  saveVideo($button) {
    const { videoId } = $button.dataset;
    deliveryMan.deliverMessage(MESSAGE.SAVE_VIDEO_BUTTON_CLICKED, { videoId });
    $.hide($button);
  }

  mountTemplate() {
    Array.from({ length: MAX_RESULTS_COUNT }).forEach(() => {
      this.$searchVideoWrapper.insertAdjacentHTML(
        "beforeEnd",
        SKELETON_TEMPLATE
      );
    });
  }

  attachData({ nextPageToken, items }) {
    this.currentNextPageToken = nextPageToken;

    const $$videos = Array.from(this.$searchVideoWrapper.children).slice(
      -MAX_RESULTS_COUNT
    );

    Array.from({ length: MAX_RESULTS_COUNT })
      .map((_, i) => [$$videos[i], items[i]])
      .forEach(([$video, item]) => render($video, item));
  }

  handlePageScroll() {
    if (
      this.$searchVideoWrapper.scrollTop +
        this.$searchVideoWrapper.clientHeight <=
      this.$searchVideoWrapper.scrollHeight * SCROLL_EVENT_THRESHOLD
    ) {
      return;
    }

    if (this.throttle) return;

    this.throttle = setTimeout(() => {
      this.throttle = null;
      this.loadData();
    }, THROTTLE_TIME_IN_MS);
  }

  async loadData() {
    this.mountTemplate();

    try {
      const response = await fetch(
        API_END_POINT(this.currentQuery, this.currentNextPageToken)
      );
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error.message);
      }

      const { nextPageToken, items } = body;

      this.attachData({ nextPageToken, items });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
}
