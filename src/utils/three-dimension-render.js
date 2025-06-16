import * as THREE  from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

class ThreeDimensionRender {
    constructor({ helper }) {
        this.animateID = null;
        this.scene = new THREE.Scene()

        this.threeDRenderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.threeDRenderer.outputEncoding = THREE.sRGBEncoding;
        this.threeDRenderer.physicallyCorrectLights = true;

        document.body.prepend( this.threeDRenderer.domElement );

        /*------------------------------
            Scene & Camera
        ------------------------------*/
        this.threeDCamera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.threeDCamera.position.z = 5;
        this.threeDCamera.position.y = 1;
        this.threeDCamera.lookAt(new THREE.Vector3(0, 0, 0));


        /*------------------------------
        OrbitControls
        ------------------------------*/
        this.controls = new OrbitControls( this.threeDCamera, this.threeDRenderer.domElement );
        this.controls.screenSpacePanning = true;

        if(helper) {
            // Grid Helper that provide Grid Plane View in X,Y axis as pe GIF above
            const gridHelper = new THREE.GridHelper( 10, 10 );
            this.scene.add( gridHelper );

            // Axis Helper that provides line helper on X,Y,Z axis.
            const axesHelper = new THREE.AxesHelper( 5 );
            this.scene.add( axesHelper );
        }

        this.setupResize()
        this.resize()
        this.animate()
    }

    getScene() {
        return this.scene;
    }

    addScene(obj) {
        this.scene.add(obj);
    }

    setupResize(){
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        this.threeDRenderer.setSize( window.innerWidth, window.innerHeight );
    }

    animate() {
        this.animateID = requestAnimationFrame(this.animate.bind(this));
        this.controls.update(); // optional, if using OrbitControls
        this.threeDRenderer.render(this.scene, this.threeDCamera);
    }
}

export {
    ThreeDimensionRender
}
