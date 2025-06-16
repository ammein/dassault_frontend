import {
    WebGLRenderer,
    PerspectiveCamera,
    OrthographicCamera,
    TextureLoader,
    DoubleSide,
    Scene,
    PlaneGeometry,
    Mesh,
    Vector2,
    Color,
    DataTexture,
    RGBAFormat,
    UnsignedByteType,
    ClampToEdgeWrapping,
} from 'three';

import { GlslPipeline } from "glsl-pipeline";
/** @type string */
import fragment from '../glsl/images.frag'
/** @type string */


// noinspection JSUnresolvedReference
/**
 * GLSL Image Burn Class
 * @class
 * @constructor
 * @public
 */
export class GLSLImageBurn {
    /**
     * Camera for ThreeJS
     * @property {PerspectiveCamera | OrthographicCamera} camera
     */
    camera;
    /**
     * GLSL Pipeline Initialize
     * @param {HTMLCanvasElement} canvas - Canvas Element
     */
    constructor(canvas) {
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({
            canvas: canvas,
            powerPreference: "high-performance",
            antialias: true,
            alpha: true,
        });
        this.container = this.renderer.domElement;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.render = this.render.bind(this)

        this.initCamera()
    }

    /**
     * Initialize Camera
     */
    initCamera() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera = new OrthographicCamera(
            -this.width / 2,
            this.width / 2,
            this.height / 2,
            -this.height / 2,
            0.1,
            100
        );

        this.camera.position.z = 5;
    }

    /**
     * Generate Color Texture
     * @param {import('three').ColorManagement} clr
     * @return {import('three').DataTexture}
     */
    colorTexture(clr) {
        const color = new Color(clr); // Red
        const size = 4; // 4x4 solid texture
        const data = new Uint8Array(size * size * 4);
        for (let i = 0; i < size * size; i++) {
            data[i * 4 + 0] = Math.floor(color.r * 255);
            data[i * 4 + 1] = Math.floor(color.g * 255);
            data[i * 4 + 2] = Math.floor(color.b * 255);
            data[i * 4 + 3] = 255;
        }
        const texture = new DataTexture(data, size, size, RGBAFormat, UnsignedByteType);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = new Image();
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            context.getImageData(0, 0, image.width, image.height);
        };
        image.src = canvas.toDataURL('image/png');
        texture.image = image;
        texture.wrapS = ClampToEdgeWrapping;
        texture.wrapT = ClampToEdgeWrapping;

        return texture;
    }

    /**
     * Add images to the store
     * @param {HTMLImageElement[]} images
     */
    addImages(images){
        this.images = images;
        const loader = new TextureLoader();

        let that = this;

        let imagePromises = that.images.map(image => loader.loadAsync(image.src))

        return Promise.all(imagePromises).then((textures) => {
            textures.forEach(texture => {
                texture.needsUpdate = true;
            })

            that.textures = textures;

            let uniforms = {
                rangeFirst: {
                    value: 0.06
                },
                rangeSecond: {
                    value: 0.02
                },
                progress: {
                    value: 0.,
                },
                tex0: {
                    value: textures[0]
                },
                tex0Resolution: {
                    value: new Vector2(that.images[0].width, that.images[0].height)
                },
                tex1: {
                    value: textures[1]
                },
                tex1Resolution: {
                    value: new Vector2(that.images[1].width, that.images[1].height)
                }
            }

            that.glsl = new GlslPipeline(that.renderer, uniforms, {
                extensions: {
                    derivatives: "#extension GL_OES_standard_derivatives : enable"
                },
                side: DoubleSide,
            });

            that.glsl.load(fragment)

            that.geometry = new PlaneGeometry(1, 1, 1, 1);

            that.material = that.glsl.material;

            that.plane = new Mesh(that.geometry, that.material);

            // Scale mesh to match canvas size
            that.plane.scale.set(that.width, that.height, 1);

            that.scene.add(that.plane);
            that.scene.userData.element = that.container;
            that.scene.userData.glsl = glsl;

            that.setupResize()
            that.resize()
            that.renderer.setAnimationLoop(that.render)

            return that.scene
        }).catch(error => console.log(error))
    }

    /**
     * Clear all images stored
     */
    clearImages(){
        this.images = []
    }

    setupResize(){
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize(){
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.glsl.setSize(this.width, this.height);
        this.camera.left = -this.width / 2;
        this.camera.right = this.width / 2;
        this.camera.top = this.height / 2;
        this.camera.bottom = -this.height / 2;
        this.camera.updateProjectionMatrix();

        if (this.plane) {
            // Rebuild geometry on resize
            this.plane.geometry.dispose();
            this.plane.geometry = new PlaneGeometry(this.width, this.height, 1, 1);
        }
    }

    updateScene(scene) {
        this.scene = scene;
    }

    render(time) {
        this.glsl.renderScene(this.scene, this.camera);
    }

}
