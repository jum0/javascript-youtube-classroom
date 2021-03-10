import { CLASSNAME } from "./constants.js";
import { $ } from "./utils/querySelector.js";
import SearchContainer from "./Search/SearchContainer.js";
import WatchLaterContainer from "./WatchLater/WatchLaterContainer.js";

export default class App {
  constructor() {
    this.$watchLaterTabButton = $(CLASSNAME.WATCH_LATER_TAB);
    this.$historyTabButton = $(CLASSNAME.HISTORY_TAB);
    this.$searchTabButton = $(CLASSNAME.SEARCH_TAB);

    // TODO: history Container
    this.watchLaterContainer = new WatchLaterContainer();
    this.searchContainer = new SearchContainer();

    this.$searchTabButton.addEventListener(
      "click",
      this.searchContainer.open.bind(this.searchContainer)
    );
  }
}
