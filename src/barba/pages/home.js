import {gsap} from 'gsap'
import {initScript} from "../global/init.js";
import {BlurScrollEffect} from "../../utils/blurScroll.js";
import {GLSLImageBurn} from "../../utils/images.js";
import {Vector2, VideoTexture} from "three";


function MainPage(data) {
    /** @type {HTMLElement[]} */
    const pinSections = gsap.utils.toArray('section.pin-sections')
    const ImageGLSL = new GLSLImageBurn(document.querySelector('canvas#glsl'))

    /*
    Add Images by query every section that has images
     */
    ImageGLSL.addImages(gsap.utils.toArray('section.pin-sections > img.image')).then((scene) => {
        let imagesTextures = [];
        let imageIndex = 0;
        let fallbackTexture = ImageGLSL.colorTexture('#0D0407');

        /*
        Loop every section and pinned any animation involved such as text, images and videos
         */
        pinSections.forEach((section, i) => {
            const image = section.querySelector('img.image')
            const video = section.querySelector('video')
            const content = section.querySelector('.content')
            const text = content && content.querySelectorAll('.text')

            /*
            Push to imagesTextures in order to fetch by section index
             */
            if(image) {
                imagesTextures.push(ImageGLSL.textures[imageIndex])
                imageIndex++;
            } else if(video){
                video.onloadeddata = function () {
                    video.play();
                };
                const texture = new VideoTexture( video );
                texture.needsUpdate = true;
                imagesTextures.push(texture)
            } else {
                imagesTextures.push(fallbackTexture)
            }

            // Pin + Text animation
            const tl = gsap.timeline({
                id: i + 1,
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: `+=200%`,
                    scrub: true,
                    pin: true,
                    id: `section-${section.id}`,
                    /**
                     * When Scroll Down, fetch previous and current index image to run GLSL Animation
                     */
                    onEnter: (self) => {
                        const previousImage = imagesTextures[i - 1]
                        const checkPreviousImage = previousImage ? previousImage : fallbackTexture
                        const currentImage = imagesTextures[i]

                        // Always set textures even if fallback
                        ImageGLSL.glsl.material.uniforms.rangeFirst.value = gsap.utils.random(0.06, 0.09, 0.01)
                        ImageGLSL.glsl.material.uniforms.rangeSecond.value = gsap.utils.random(0.01, 0.02, 0.01)
                        ImageGLSL.glsl.material.uniforms.tex0.value = checkPreviousImage
                        ImageGLSL.glsl.material.uniforms.tex1.value = currentImage
                        ImageGLSL.glsl.material.uniforms.tex0Resolution.value = new Vector2(checkPreviousImage.image.width, checkPreviousImage.image.height)
                        ImageGLSL.glsl.material.uniforms.tex1Resolution.value = new Vector2(currentImage.image.width, currentImage.image.height)

                        if(previousImage) {
                            gsap.fromTo(ImageGLSL.glsl.material.uniforms.progress, {
                                value: 0.
                            },{
                                value: 1.,
                                duration: 2.
                            })
                        }
                    },
                    /**
                     * When Scroll Up, fetch future and current index image to run GLSL Animation
                     */
                    onEnterBack: (self) => {
                        const previousImage = imagesTextures[i + 1]
                        const checkPreviousImage = !previousImage ? fallbackTexture : previousImage
                        const currentIm = imagesTextures[i]

                        // Always set textures even if fallback
                        ImageGLSL.glsl.material.uniforms.rangeFirst.value = gsap.utils.random(0.06, 0.09, 0.01)
                        ImageGLSL.glsl.material.uniforms.rangeSecond.value = gsap.utils.random(0.01, 0.02, 0.01)
                        ImageGLSL.glsl.material.uniforms.tex0.value = checkPreviousImage
                        ImageGLSL.glsl.material.uniforms.tex1.value = currentIm
                        ImageGLSL.glsl.material.uniforms.tex0Resolution.value = new Vector2(checkPreviousImage.image.width, checkPreviousImage.image.height)
                        ImageGLSL.glsl.material.uniforms.tex1Resolution.value = new Vector2(currentIm.image.width, currentIm.image.height)

                        if(previousImage) {
                            gsap.fromTo(ImageGLSL.glsl.material.uniforms.progress, {
                                value: 0.
                            },{
                                value: 1.,
                                duration: 2.
                            })
                        }
                    }
                }
            })

            if (text) {
                /*
                Loop every text to run Split-Type to animate each characters using Blur and staggered the animation on each characters
                 */
                text.forEach((txt, index, arr) => {
                    new BlurScrollEffect(txt, (chars) => {
                        tl.set(chars, {
                            opacity: 0,
                            filter: 'blur(10px) brightness(30%)',
                        }, 0)
                            .to(chars, {
                                opacity: 1,
                                duration: 1
                            }, '<')
                            .to(chars, {
                                ease: 'none',
                                filter: 'blur(0px) brightness(100%)',
                                stagger: 0.05
                            }, '<+=1')
                            .to(chars, {
                                opacity: 0,
                                ease: 'none',
                                filter: 'blur(10px) brightness(30%)',
                                stagger: 0.05
                            }, arr[index - 1] ? '-=25%' : '+=3')
                    })
                })
            }
        })
    })
}

/*
    BarbaJS Hompage Views Custom Code
 */
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

/*
    BarbaJS Hompage Transition
 */
let homepageTransition = {
    name: 'home-transition',
    from: {

    },
    to: {
        namespace: ['home'],
    },
    once(data){
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
