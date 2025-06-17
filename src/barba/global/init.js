import {LenisController} from "../../utils";
import imagesLoaded from 'imagesloaded';
import FontFaceObserver from 'fontfaceobserver'

const timeout = 50000

/**
 *
 * @param {typeof import('@barba/core').ISchemaPage} data
 * @param {typeof import('lenis').LenisOptions} lenisOptions
 * @param {function || undefined} beforeScriptCallback
 * @param {function || undefined} afterScriptCallback
 */
function initScript(data, lenisOptions, beforeScriptCallback = function(){}, afterScriptCallback= function(){}) {

    if(window.matchMedia("(min-width: 600px)").matches){
        window.lenisScroll = new LenisController(lenisOptions)
    }

    // Make default function value if undefined
    if (!beforeScriptCallback) {
        beforeScriptCallback = function() {}
    }

    // Make default function value if undefined
    if (!afterScriptCallback) {
        afterScriptCallback = function() {}
    }

    runScript(data, beforeScriptCallback, afterScriptCallback);
}

function runScript(data, beforeScriptCallback, afterScriptCallback) {
    beforeScriptCallback();
    // Promise for images
    const preloadImages = new Promise(resolve => {
        imagesLoaded('img', {background: true}, resolve);
    })

    const Heading = new Promise(resolve => {
        new FontFaceObserver("Ultra").load(null, timeout).then(()=> resolve())
    });

    const Paragraph = new Promise(resolve => {
        new FontFaceObserver("Lexend").load(null, timeout).then(()=> resolve())
    });

    Promise.all([preloadImages, Heading, Paragraph]).then(() => {
        afterScriptCallback();
    })
}

export {
    initScript
}
