// Import the TextSplitter class for handling text splitting.
import { TextSplitter } from '../../utils';

// Defines a class to create scroll-triggered animation effects on text.
export class BlurScrollEffect {
    constructor(textElement, callback) {
        // Check if the provided element is valid.
        if (!textElement || !(textElement instanceof HTMLElement)) {
            throw new Error('Invalid text element provided.');
        }

        this.textElement = textElement;

        // Set up the effect for the provided text element.
        this.initializeEffect(callback);
    }

    // Sets up the initial text effect on the provided element.
    initializeEffect(callback) {
        // Callback to re-trigger animations on resize.
        const textResizeCallback = () => this.scroll(callback);

        // Split text for animation and store the reference.
        this.splitter = new TextSplitter(this.textElement, {
            resizeCallback: textResizeCallback,
            splitTypeTypes: 'words, chars'
        });

        this.scroll(callback)
    }

    // Animates text based on the scroll position.
    scroll(callback) {
        // Query all individual characters in the line for animation.
        const chars = this.splitter.getChars();
        callback(chars);
    }
}
