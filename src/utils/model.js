import {Scene} from 'three';

import { GLTFLoader } from 'three-addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three-addons/loaders/DRACOLoader.js'

class Model{
    /**
     * @constructor
     * @param {{ name: string, file: string, scene: import('three').Scene }} obj
     */
    constructor (obj){
        this.file = obj.file;
        this.scene = obj.scene;

        // Add placeOnLoad into class object
        this.placeOnLoad = obj.placeOnLoad;

        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('./draco/');

        this.loader.setDRACOLoader(this.dracoLoader);

        return this.init().then(model => {
            // Add model when `placeOnLoad` is true
            if(this.placeOnLoad){
                this.add();
            }

            return model
        });
    }

    init() {
        return new Promise((resolve, reject) => {
            this.loader.load(
                this.file,
                (gltf) => {
                    // Model loaded successfully
                    this.model = gltf.scene; // Access the loaded scene
                    this.model.position.set(0., 0., 0.)
                    this.model.scale.set(1., 1., 1.)

                    console.log(this.model);

                    this.scene.add( this.model.children[0] ); // Add the loaded model to your scene
                    // Handle materials and other properties

                    resolve(this.model);
                },
                undefined,
                (error) => {
                    reject(error);
                }
            );
        });
    }


    add(){
        this.scene.add(this.model);
    }

    remove(){
        // Add remove method here
        this.scene.remove(this.model);
    }
}

export { Model };
