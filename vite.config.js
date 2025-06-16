import path from 'path';
import glsl from 'vite-plugin-glsl';
export default {
    // config options
    plugins: [glsl()],
    assetsInclude: [
        '**/*.gltf',
        '**/*.glb',
    ],
    resolve: {
        alias: {
            'three-addons': path.resolve(__dirname, "./node_modules/three/examples/jsm"),
        }
    }
}
