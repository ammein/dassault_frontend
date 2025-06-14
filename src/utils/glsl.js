import {WebGLRenderer} from "three";
import {GlslPipeline} from "glsl-pipeline";

/**
 * @callback animateCallback
 * @param {import('three').WebGLRenderer} renderer
 * @param {import('glsl-pipeline').GlslPipeline} glsl
 */


class MultipleElements {
    /**
     * Destroy status
     * @type {boolean}
     */
    isDestroy = false;

    /**
     *
     * @param {HTMLCanvasElement} canvas
     * @param {{[p: string]: any} | undefined} options
     */
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        let optionsMerge = Object.assign({}, {
            canvas: canvas,
            preserveDrawingBuffer: true,
            ...options
        })

        if (canvas.getContext('2d') || canvas.getContext('webgl2') || canvas.getContext('webgl')) {
            let newCanvas = document.createElement("canvas");
            newCanvas.id = canvas.id;
            newCanvas.classList.add(...canvas.classList)
            canvas.replaceWith(newCanvas)

            optionsMerge['canvas'] = newCanvas;
            this.canvas = newCanvas;
        }
        this.renderer = new WebGLRenderer(optionsMerge)
        /**
         *
         * @type {Object.<string, import('glsl-pipeline').GlslPipeline >}
         */
        this.glslInstances = {}
        this.renderer.autoClear = false;
        this.renderer.setClearColor(0xffffff, 1);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    /**
     * Create new GLSLPipeline
     * @param {import('three').Uniform | undefined} uniforms
     * @param {import('three').WebGLRenderer.Options | undefined} options
     * @param {string} fragment
     * @param {string} vertex
     */
    glsl(uniforms, options = {}, fragment, vertex) {
        /**
         *
         * @type {import('glsl-pipeline').GlslPipeline || null}
         */
        let instance = null
        switch (true) {
            case uniforms && options && Object.keys(uniforms).length > 0 && Object.keys(options).length > 0:
                instance = new GlslPipeline(this.renderer, uniforms, options);
                break;

            case uniforms && Object.keys(uniforms).length > 0:
                instance = new GlslPipeline(this.renderer, uniforms);
                break;

            case options && Object.keys(options).length > 0:
                instance = new GlslPipeline(this.renderer, {}, options);
                break;

            default:
                instance = new GlslPipeline(this.renderer);
        }

        instance.load(fragment, vertex);

        this.glslInstances[instance.id] = instance;

        return instance.id;
    }

    /**
     * Get ShaderMaterial ThreeJS
     * @param {string} id
     * @param {string || string[] || undefined} branch
     * @returns {import('three').Material || undefined}
     */
    getMaterial(id, branch) {
        if (this.glslInstances.length > 0) {
            let pipeline = this.glslInstances[id];

            if (pipeline && branch) {
                return pipeline.branchMaterial(branch);
            } else if (pipeline && !branch) {
                return pipeline.material;
            } else {
                return undefined;
            }
        }

        return undefined;
    }

    /**
     * Animate using your own requestAnimationFrame. Output callback with two value/
     * @param {string} id
     * @param {animateCallback} callback
     * @example
     * let glslStart = new MultipleElements(document.querySelector("canvas"));
     * let id = glslStart.glsl(uniforms, options, fragment, vertex);
     * const draw = () => {
     *     requestAnimationFrame(draw);
     *     glslStart.animate(id, function(renderer, glslPipeline) {
     *          scenes.forEach( function( scene ) {
     *
     *                    // so something moves
     *                    scene.children[ 0 ].rotation.y = Date.now() * 0.001;
     *
     *                    // get the element that is a place holder for where we want to
     *                    // draw the scene
     *                    var element = scene.userData.element;
     *
     *                    // get its position relative to the page's viewport
     *                    var rect = element.getBoundingClientRect();
     *
     *                    // check if it's offscreen. If so skip it
     *                    if ( rect.bottom < 0 || rect.top  > renderer.domElement.clientHeight ||
     *                         rect.right  < 0 || rect.left > renderer.domElement.clientWidth ) {
     *
     *                        return;  // it's off screen
     *
     *                    }
     *
     *                    // set the viewport
     *                    var width  = rect.right - rect.left;
     *                    var height = rect.bottom - rect.top;
     *                    var left   = rect.left;
     *                    var top    = rect.top;
     *
     *                    renderer.setViewport( left, top, width, height );
     *                    renderer.setScissor( left, top, width, height );
     *
     *                    var camera = scene.userData.camera;
     *
     *                    //camera.aspect = width / height; // not changing in this example
     *                    //camera.updateProjectionMatrix();
     *
     *                    //scene.userData.controls.update();
     *
     *                    renderer.render( scene, camera );
     *
     *                } );
     *     })
     * }
     */
    animate(id, callback) {
        this.updateSize();

        // Background
        this.renderer.setClearColor(0xffffff, 0); // Background Color
        this.renderer.setScissorTest(false);
        this.renderer.clear();

        // Scissor Area (square/rectangle area)
        this.renderer.setClearColor(0xffffff, 0); // Scissor Color
        this.renderer.setScissorTest(true);

        callback(this.renderer, this.glslInstances[id]);
    }

    /**
     * Update the renderer & each glslInstances size
     */
    updateSize() {
        let width = this.canvas.offsetWidth;
        let height = this.canvas.offsetHeight;
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.renderer.setSize(width, height, false);
            for (let i = 0; i < Object.keys(this.glslInstances).length; ++i) {
                let id = Object.keys(this.glslInstances)[i];
                this.glslInstances[id].setSize(width, height);
            }
        }
    }

    /**
     * Destroy all renderer & glslInstances
     */
    destroy() {
        for (let i = 0; i < Object.keys(this.glslInstances).length; ++i) {
            let id = Object.keys(this.glslInstances)[i];
            this.glslInstances[id].dispose();
            this.renderer.dispose();
            delete this.glslInstances[id];
            this.renderer = null;
        }

        let newCanvas = document.createElement("canvas");
        newCanvas.id = this.canvas.id;
        newCanvas.classList.add(...this.canvas.classList);
        document.body.querySelector('canvas#' + this.canvas.id).replaceWith(newCanvas)

        this.isDestroy = true;
    }
}

export {
    MultipleElements
}
