// Import debounce utility function.
import {debounce} from './debounce.js';
import SplitType from "split-type";

/**
 * @class
 * TextSplitter helper from using SplitType package
 * @param {HTMLElement} textElement
 * @param {{ resizeCallback: function(ResizeObserverEntry), splitTypeTypes: string }} options
 * @example
 * new TextSplitter(document.querySelector('p'), {
 *     splitTypeTypes: "words, chars",
 *     resizeCallback: () => resizeFunction()
 * })
 */
class TextSplitter {

    constructor(textElement, options = {}) {
        // Ensure the textElement is a valid HTMLElement.
        if (!textElement || !(textElement instanceof HTMLElement)) {
            throw new Error('Invalid text element provided.');
        }

        const {resizeCallback, splitTypeTypes, ...splitTypeOptions} = options;

        this.textElement = textElement;
        this.cloneElement = textElement.cloneNode(true)
        this.innerElement = this.cloneElement.innerHTML;
        // Assign the resize callback if provided and is a function, otherwise null.
        this.onResize = typeof resizeCallback === 'function' ? resizeCallback : null;

        // Set options for SplitType based on provided splitTypeTypes or default to SplitType's default behavior.
        // The 'types' option allows customization of how text is split (e.g., into lines, words, characters).
        // Refer to SplitType documentation for possible values and updates: https://github.com/lukePeavey/SplitType
        const splitOptions = splitTypeTypes ? {types: splitTypeTypes} : {};
        this.options = Object.assign(splitOptions, splitTypeOptions)
        this.splitText = new SplitType(this.textElement, this.options);

        // Initialize ResizeObserver to re-split text on resize events, if a resize callback is provided.
        if (this.onResize) {
            this.initResizeObserver(); // Set up observer to detect resize events.
        }
    }

    // Sets up ResizeObserver to re-split text on element resize.
    initResizeObserver() {
        this.previousContainerWidth = null; // Track element width to detect resize.

        this.resizeObserver = new ResizeObserver(
            debounce((entries) => this.handleResize(entries), 2000)
        );
        this.resizeObserver.observe(this.textElement); // Start observing the text element.
    }

    destroy() {
        if(this.onResize) {
            this.resizeObserver.unobserve(this.textElement)
        }
        this.textElement.innerHTML = this.innerElement;
        this.textElement = null;
    }

    // Handles element resize, re-splitting text if width changes.
    handleResize(entries) {
        const [{contentRect}] = entries;
        const width = Math.floor(contentRect.width);
        // If element width changed, re-split text and call resize callback.
        if (this.previousContainerWidth && this.previousContainerWidth !== width) {
            this.splitText.split(this.options); // Re-split text for new width.
            this.onResize && this.onResize(); // Execute the callback function.
        }
        this.previousContainerWidth = width; // Update stored width.
    }

    // Returns the lines created by splitting the text element.
    getLines() {
        return this.splitText.lines;
    }

    // Returns the words created by splitting the text element.
    getWords() {
        return this.splitText.words;
    }

    // Returns the chars created by splitting the text element.
    getChars() {
        return this.splitText.chars;
    }
}



export { TextSplitter }
