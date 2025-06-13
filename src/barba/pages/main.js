import {gsap} from 'gsap'
import {initScript} from "../global/init.js";

function MainPage () {
    const pinSections = gsap.utils.toArray('section.pin-sections')

    pinSections.forEach((section, i) => {
        const content = section.querySelector('.content')
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

        content && gsap.set(content, { opacity: 0 })

        tl.to(content, {
            autoAlpha: 1,
            duration: 0.2
        }, "<")
    })
}

let homepage = {
    namespace: 'home',
    beforeEnter(data){
        initScript(data, {
            content: data.next.container,
            smoothWheel: true,
            syncTouch: true,
            overscroll: false,
        })
    },
    afterEnter(data){
        MainPage()
    }
}

export {
    homepage
}
