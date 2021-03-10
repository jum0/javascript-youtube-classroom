import { CLASSNAME } from "../constants.js";

const addClass = ($element, className) => {
  $element.classList.add(className);
};

const removeClass = ($element, className) => {
  $element.classList.remove(className);
};

const show = ($element) => {
  removeClass($element, CLASSNAME.HIDDEN);
};

const hide = ($element) => {
  addClass($element, CLASSNAME.HIDDEN);
};

const open = ($element) => {
  addClass($element, CLASSNAME.OPEN);
};

const close = ($element) => {
  removeClass($element, CLASSNAME.OPEN);
};

const customMethod = {
  addClass,
  removeClass,
  show,
  hide,
  open,
  close,
};

Object.setPrototypeOf(customMethod, Function.prototype);

const $ = (parameter) => {
  const selector = Object.values(CLASSNAME).includes(parameter)
    ? `.${parameter}`
    : parameter;

  return document.querySelector(selector);
};

Object.setPrototypeOf($, customMethod);

const $$ = (parameter) => {
  const selector = Object.values(CLASSNAME).includes(parameter)
    ? `.${parameter}`
    : parameter;

  return document.querySelectorAll(selector);
};

export { $, $$ };
