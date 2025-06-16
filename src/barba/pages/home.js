import {gsap} from 'gsap'
import {initScript} from "../global/init.js";
import {BlurScrollEffect} from "../global/blurScroll.js";
import {GLSLImageBurn} from "../../utils/images.js";
import {Vector2, Color, MeshBasicMaterial, AmbientLight, VideoTexture} from "three";

// import studio from '@theatre/studio'
import { getProject, types } from '@theatre/core'

import Chess from '../../3d/Bishop.glb'
import {Model, ThreeDimensionRender} from "../../utils/index.js";
import * as THREE from "three";

let threeDFiles = []


/**
 * Theatre.js
 */
// studio.initialize()

function MainPage(data) {
    /** @type {HTMLElement[]} */
    const pinSections = gsap.utils.toArray('section.pin-sections')
    const ImageGLSL = new GLSLImageBurn(document.querySelector('canvas#glsl'))

    // // Create a project for the animation
    // const project = getProject('THREE.js x Theatre.js')
    //
    // // Create a sheet
    // const sheet = project.sheet('Introduction Chess')
    //
    // let renderer = new ThreeDimensionRender({
    //     helper: true
    // })


//     // Soft global light
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);
//
// // Directional light (like the sun)
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(5, 10, 7.5);
//     scene.add(directionalLight);

    // const ambientLight = new AmbientLight(0xffffff, 0.1);
    //
    // const ambientLightSheet = sheet.object('Ambient Light', {
    //     position: types.compound({
    //         x: types.number(ambientLight.position.x, { range: [-10, 10] }),
    //         y: types.number(ambientLight.position.y, { range: [-10, 10] }),
    //         z: types.number(ambientLight.position.z, { range: [-10, 10] })
    //     }),
    //     rotation: types.compound({
    //         x: types.number(ambientLight.rotation.x, { range: [-2, 2] }),
    //         y: types.number(ambientLight.rotation.y, { range: [-2, 2] }),
    //         z: types.number(ambientLight.rotation.z, { range: [-2, 2] })
    //     }),
    //     intensity: types.number(ambientLight.intensity, { range: [0, 10] }),
    // })
    //
    // ambientLightSheet.onValuesChange((values) => {
    //     const { xRot, yRot, zRot } = values.rotation
    //     const { xPos, yPos, zPos } = values.position
    //
    //     ambientLight.position.x = xPos;
    //     ambientLight.position.y = yPos;
    //     ambientLight.position.z = zPos;
    //
    //     ambientLight.rotation.set(xRot * Math.PI, yRot * Math.PI, zRot * Math.PI)
    //
    //     ambientLight.intensity = values.intensity;
    // })
    //
    // renderer.addScene(ambientLight)
    //
    // let ChessModel = new Model({
    //     file: Chess,
    //     scene: renderer.getScene(),
    //     placeOnLoad: true,
    // }).then(model => {
    //     const chessSheet = sheet.object('Chess', {
    //         position: types.compound({
    //             x: types.number(model.position.x, { range: [-10, 10] }),
    //             y: types.number(model.position.y, { range: [-10, 10] }),
    //             z: types.number(model.position.z, { range: [-10, 10] })
    //         }),
    //         rotation: types.compound({
    //             x: types.number(model.rotation.x, { range: [-2, 2] }),
    //             y: types.number(model.rotation.y, { range: [-2, 2] }),
    //             z: types.number(model.rotation.z, { range: [-2, 2] })
    //         }),
    //         scale: types.compound({
    //             x: types.number(model.scale.x, { range: [0, 100] }),
    //             y: types.number(model.scale.y, { range: [0, 100] }),
    //             z: types.number(model.scale.z, { range: [0, 100] })
    //         }),
    //     })
    //
    //     chessSheet.onValuesChange((values) => {
    //         const { xRot, yRot, zRot } = values.rotation
    //         const { xPos, yPos, zPos } = values.position
    //         const { xScale, yScale, zScale } = values.scale
    //
    //         model.position.set(xPos, yPos, zPos )
    //         model.rotation.set(xRot * Math.PI, yRot * Math.PI, zRot * Math.PI)
    //         model.scale.set( xScale,  yScale,  zScale)
    //     })
    // })

    ImageGLSL.addImages(gsap.utils.toArray('section.pin-sections > img.image')).then((scene) => {
        let imagesTextures = [];
        let imageIndex = 0;
        let fallbackTexture = ImageGLSL.colorTexture('#0D0407');

        pinSections.forEach((section, i) => {
            const image = section.querySelector('img.image')
            const video = section.querySelector('video')
            const content = section.querySelector('.content')
            const text = content && content.querySelectorAll('.text')

            if(image) {
                imagesTextures.push(ImageGLSL.textures[imageIndex])
                imageIndex++;
            } else if(video){
                video.onloadeddata = function () {
                    video.play();
                };
                const texture = new VideoTexture( video );
                texture.needsUpdate = true;
                // video.play().then(() => {
                //
                // })
                imagesTextures.push(texture)
            } else {
                imagesTextures.push(fallbackTexture)
            }

            // 📜 Pin + Text animation
            const tl = gsap.timeline({
                id: i + 1,
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: `+=200%`,
                    scrub: true,
                    pin: true,
                    id: `section-${section.id}`,
                    onEnter: (self) => {
                        threeD(self.trigger, scene)
                        const previousImage = imagesTextures[i - 1]
                        const checkPreviousImage = previousImage ? previousImage : fallbackTexture
                        const currentImage = imagesTextures[i]

                        // 🧠 Always set textures even if fallback
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
                    onEnterBack: (self) => {
                        threeD(self.trigger, scene)
                        const previousImage = imagesTextures[i + 1]
                        const checkPreviousImage = !previousImage ? fallbackTexture : previousImage
                        const currentIm = imagesTextures[i]

                        // 🧠 Always set textures even if fallback
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

function threeD(section, scene) {
    if(section.id === "marcel-duchamp") {

    }
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
