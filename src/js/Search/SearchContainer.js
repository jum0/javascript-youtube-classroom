import { CLASSNAME } from "../constants.js";
import { $ } from "../utils/querySelector.js";
import SearchForm from "./SearchForm.js";
import KeywordHistory from "./KeywordHistory.js";
import SearchVideoWrapper from "./SearchVideoWrapper.js";
import SavedVideosCount from "./SavedVideosCount.js";

export default class SearchContainer {
  constructor() {
    this.$modal = $(CLASSNAME.MODAL);
    this.$modalClose = $(CLASSNAME.MODAL_CLOSE);
    this.$modalInner = $(CLASSNAME.MODAL_INNER);

    this.searchForm = new SearchForm();
    this.keywordHistory = new KeywordHistory();
    this.savedVideosCount = new SavedVideosCount();
    this.searchVideoWrapper = new SearchVideoWrapper();

    this.searchForm.fetchData();

    this.$modalClose.addEventListener("click", this.close.bind(this));
  }

  open() {
    this.$modal.classList.add(CLASSNAME.OPEN);
  }

  close() {
    this.$modal.classList.remove(CLASSNAME.OPEN);
  }
}
