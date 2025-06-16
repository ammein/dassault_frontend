import Lenis from "lenis";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

class LenisController {
    constructor(options) {
        this.init(options);
    }

    gsapScroll(){
        // Sync ScrollTrigger with Lenis' scroll updates.
        this.lenis.on('scroll', ScrollTrigger.update);

        let that = this;

        // Make sure scrollTrigger read this scroll container value
        ScrollTrigger.defaults({
            scroller: this.lenis.rootElement
        })

        // Ensure GSAP animations are in sync with Lenis' scroll frame updates.
        gsap.ticker.add(time => {
            that.lenis.raf(time * 1000); // Convert GSAP's time to milliseconds for Lenis.
        });

        // Turn off GSAP's default lag smoothing to avoid conflicts with Lenis.
        gsap.ticker.lagSmoothing(0);

        // Force scrolltrigger to recalculate start and end values
        ScrollTrigger.refresh()
    }

    normalScroll(time){
        this.lenis.raf(time);
        ScrollTrigger.update();
        requestAnimationFrame(this.normalScroll.bind(this));
    }

    get scroll() {
        return this.lenis.scroll;
    }

    get scrollTarget(){
        return this.lenis.targetScroll;
    }

    destroy() {
        if(this.lenis){
            this.lenis.destroy();
        }
    }

    init(options){
        this.options = options;
        this.lenis = new Lenis(this.options);
        // this.gsapScroll();
        requestAnimationFrame(this.normalScroll.bind(this));
    }
}

export {
    LenisController
}
