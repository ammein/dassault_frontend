import {gsap} from 'gsap'
import {initScript} from "../global/init.js";
import {MultipleElements} from "../../utils/glsl.js";
import {BlurScrollEffect} from "../global/blurScroll.js";

function MainPage (data) {
    const pinSections = gsap.utils.toArray('section.pin-sections')

    window.canvas_reuse = new MultipleElements(document.querySelector('canvas#glsl'))

    pinSections.forEach((section, i) => {
        const content = section.querySelector('.content')
        const text = content && content.querySelectorAll('.text')
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=200%",
                pin: true,
                scrub: true,
                id: i + 1,
                markers: {
                    indent: 150 * i
                }
            }
        })

        text && text.forEach((txt) => {
            new BlurScrollEffect(txt, function(chars) {
                tl.set(chars, {
                    filter: 'blur(10px) brightness(30%)',
                }, "<")
                tl.to(chars, {
                    ease: 'none', // Animation easing.
                    filter: 'blur(0px) brightness(100%)',
                    stagger: 0.05, // Delay between starting animations for each character.
                }, "<");
            })
        })
    })
}

let homepageViews = {
    namespace: 'home',
    afterEnter(data){
        try{
            MainPage(data)
        }catch(e){
            console.error(e)
        }
    }
}

let homepageTransition = {
    namespace: 'home',
    beforeOnce(data){
        const done = this.async();
        initScript(data, {
            content: data.next.container,
            smoothWheel: true,
            syncTouch: true,
            overscroll: false,
        }, undefined, function(){
            done();
        })
    }
}

export {
    homepageViews,
    homepageTransition,
}
