import { CLASSNAME, MESSAGE } from "../constants.js";
import deliveryMan from "../deliveryMan.js";
import { $ } from "./DOM.js";

const SAVED_VIDEO_BUTTON_TEMPLATE = `
<div class="${CLASSNAME.SAVE_VIDEO_BUTTON_WRAPPER} d-flex justify-end --hidden">
  <button class="${CLASSNAME.SAVE_VIDEO_BUTTON} btn">⬇️ 저장</button> 
</div>
`;

const ICON_BUTTONS_TEMPLATE = `
<div class=${CLASSNAME.ICONS_WRAPPER}>
  <span class="${CLASSNAME.WATCHED_ICON} opacity-hover">✅</span>
  <span class="${CLASSNAME.LIKE_ICON} opacity-hover">👍</span>
  <span class="${CLASSNAME.COMMENT_ICON} opacity-hover">💬</span>
  <span class="${CLASSNAME.DELETE_ICON} opacity-hover">🗑️</span>
</div>`;

const GENERATE_TEMPLATE = (buttonTemplate) => `
<article class="clip ${CLASSNAME.SKELETON}">
  <div class="preview-container">
    <iframe
    class="${CLASSNAME.VIDEO_ID} image"
    width="100%"
      height="118"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
  <div class="content-container pt-2 px-1">
    <h3 class="${CLASSNAME.VIDEO_TITLE} line"></h3>
    <div>
      <a
        target="_blank"
        class="${CLASSNAME.CHANNEL_TITLE} line channel-name mt-1"
      >
      </a>
      <div class="line meta">
        <p class="${CLASSNAME.PUBLISHED_AT}">
        </p>
      </div>
      ${buttonTemplate}
    </div>
  </div>
</article>`;

const SEARCH_VIDEO_TEMPLATE = GENERATE_TEMPLATE(SAVED_VIDEO_BUTTON_TEMPLATE);

const VIDEO_TEMPLATE = GENERATE_TEMPLATE(ICON_BUTTONS_TEMPLATE);

const createVideoInfo = (item) => {
  const {
    id: { videoId },
    snippet: { title, channelId, channelTitle, publishedAt },
  } = item;

  return {
    videoId,
    title,
    channelId,
    channelTitle,
    publishedAt,
  };
};

const renderVideo = ($video, item) => {
  const {
    videoId,
    title,
    channelId,
    channelTitle,
    publishedAt,
  } = createVideoInfo(item);

  const $iframe = $video.querySelector(`.${CLASSNAME.VIDEO_ID}`);
  const $videoTitle = $video.querySelector(`.${CLASSNAME.VIDEO_TITLE}`);
  const $channelTitle = $video.querySelector(`.${CLASSNAME.CHANNEL_TITLE}`);
  const $publishedAt = $video.querySelector(`.${CLASSNAME.PUBLISHED_AT}`);

  $iframe.src = `https://www.youtube.com/embed/${videoId}`;

  $videoTitle.innerText = title;

  $channelTitle.href = `https://www.youtube.com/channel/${channelId}`;
  $channelTitle.innerText = channelTitle;

  $publishedAt.innerText = new Date(publishedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  $.removeClass($video, CLASSNAME.SKELETON);
};

const renderWatchLaterVideo = ($video, item) => {
  renderVideo($video, item);

  const { videoId } = item.id;

  const $iconsWrapper = $video.querySelector(`.${CLASSNAME.ICONS_WRAPPER}`);

  $iconsWrapper.dataset.videoId = videoId;
};

const renderSearchVideo = ($video, item) => {
  renderVideo($video, item);

  const { videoId } = item.id;

  const $saveVideoButton = $video.querySelector(
    `.${CLASSNAME.SAVE_VIDEO_BUTTON}`
  );
  const $saveVideoButtonWrapper = $video.querySelector(
    `.${CLASSNAME.SAVE_VIDEO_BUTTON_WRAPPER}`
  );

  $saveVideoButton.dataset.videoId = videoId;

  $.show($saveVideoButtonWrapper);

  deliveryMan.deliverMessage(MESSAGE.HIDE_IF_VIDEO_IS_SAVED, {
    videoId,
    callback: () => $.hide($saveVideoButton),
  });
};

export {
  SEARCH_VIDEO_TEMPLATE,
  VIDEO_TEMPLATE,
  renderWatchLaterVideo,
  renderSearchVideo,
};
