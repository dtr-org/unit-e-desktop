import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';


export function $(selector: string): ElementFinder {
  return element(by.css(selector));
}

export function $$(selector: string): ElementArrayFinder {
  return element.all(by.css(selector));
}
