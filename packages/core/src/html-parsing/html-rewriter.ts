import HTMLParser, { type OnAllTextCb, type OnTextCb } from "../models/html-parser";
import { getOrInsert } from "../utils/map";

interface OnTextCbTrackingData {
  /** Combined text to pass to the callback */
  text: string,

  /** Amount of times a matched element for this callback's css selector is matched */
  count: number
}

interface OnAllTextCbTrackingData {
  /** Combined text strings to pass to the callback */
  allText: string[],

  /** Index in `allText` to append data to */
  index: number
}

export default class HTMLRewriterHTMLParser extends HTMLParser {
  #htmlResponse: Response
  #htmlRewriter: HTMLRewriter
  #onTextCbTrackingMap = new Map<OnTextCb, OnTextCbTrackingData>()
  #onAllTextCbTrackingMap = new Map<OnAllTextCb, OnAllTextCbTrackingData>()

	constructor(res: Response) {
    super();

    this.#htmlResponse = res;
    this.#htmlRewriter = new HTMLRewriter()
	}

	static override async init(htmlRes: Response): Promise<HTMLRewriterHTMLParser> {
		return new HTMLRewriterHTMLParser(htmlRes);
  }

  #getValInOnTextCbTrackingMap(cb: OnTextCb):OnTextCbTrackingData {
    return getOrInsert(this.#onTextCbTrackingMap, cb, {count:0, text:""})
  }

  #getValInOnAllTextCbTrackingMap(cb: OnAllTextCb):OnAllTextCbTrackingData {
    return getOrInsert(this.#onAllTextCbTrackingMap, cb, {index:0, allText:[]})
  }

  #modifyOnTextCbMap(cbKey: OnTextCb, cbMod: (cb:OnTextCbTrackingData) => OnTextCbTrackingData) {
    const oldVal = this.#getValInOnTextCbTrackingMap(cbKey)

  this.#onTextCbTrackingMap.set(cbKey, cbMod(oldVal))
  }

  #modifyOnAllTextCbMap(cb: OnAllTextCb,  cbMod: (cb:OnAllTextCbTrackingData) => OnAllTextCbTrackingData) {
    const oldVal = this.#getValInOnAllTextCbTrackingMap(cb)

  this.#onAllTextCbTrackingMap.set(cb, cbMod(oldVal))
}

  override async process(): Promise<void> {
    let htmlRewriter = this.#htmlRewriter
    const self = this

    // The text we want is the text content of the entire element so we initially setup handlers to concatenate all the text we need
		for (const { cb, css, isOne } of this.cbs) {
      if (isOne) {
        htmlRewriter = htmlRewriter.on(css, {
          element(el) {

            // With this, we can specifically be sure that we've reached the ending tag / processed  single element
            el.onEndTag(() => {
               self.#modifyOnTextCbMap(cb, prev => { prev.count++;  return prev})
            })

          },
          text({text}) {
            if (self.#getValInOnTextCbTrackingMap(cb).count > 0) return

            self.#modifyOnTextCbMap(cb, prev => { prev.text += text;  return prev})
          },
        }).on(`${css} *`, {
          text({ text }) {
            if (self.#getValInOnTextCbTrackingMap(cb).count > 0) return

            self.#modifyOnTextCbMap(cb,  prev => { prev.text += text;  return prev})
          }
			})
      } else {

        htmlRewriter = htmlRewriter.on(css, {
          element(el) {

            // With this, we can specifically be sure that we've reached the ending tag / processed  single element
            el.onEndTag(() => {
               self.#modifyOnAllTextCbMap(cb, prev => { prev.index++;  return prev})
            })

          },
          text({text}) {
            self.#modifyOnAllTextCbMap(cb, prev => { const oldText = prev.allText[prev.index] || ""; prev.allText[prev.index] = `${oldText}${text}`;  return prev})
          },
        }).on(`${css} *`, {
          text({ text }) {
            self.#modifyOnAllTextCbMap(cb, prev => { const oldText = prev.allText[prev.index] || ""; prev.allText[prev.index] = `${oldText}${text}`;  return prev})
          }
			})
			}
    }

    htmlRewriter.transform(this.#htmlResponse)

    const promises: Promise<void>[] = []

    for (const [cb, {text}] of this.#onTextCbTrackingMap) {
      promises.push(Promise.resolve(cb(text)))
    }
    for (const [cb, {allText}] of this.#onAllTextCbTrackingMap) {
      promises.push(Promise.resolve(cb(allText)))
    }

    await Promise.all(promises)
	}
}
