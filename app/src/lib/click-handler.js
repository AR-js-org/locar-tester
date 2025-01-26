import * as THREE from 'three';

/** 
 * Class to handle object detection via mouse clicks/touch events 
 * and raycasting.
 */
class ClickHandler {

    /**
     * Create a ClickHandler.
     * @param {THREE.WebGLRenderer} - The Three.js renderer on which the click
     * events will be handled.
     */
    constructor(renderer) {
        this.raycaster = new THREE.Raycaster();
        this.normalisedMousePosition = new THREE.Vector2(null, null);
        renderer.domElement.addEventListener("click", e => {
            this.normalisedMousePosition.set (
                ((e.clientX / renderer.domElement.clientWidth) * 2) - 1,
                -((e.clientY / renderer.domElement.clientHeight) * 2) + 1
            );    
        });
    }


    /**
     * Cast a ray into the scene to detect objects.
     * @param {THREE.Camera} - The active Three.js camera, from which the ray
     * will be cast.
     * @param {THREE.Scene} - The active Three.js scene, which the ray will be
     * cast into.
     * @return {Array} - array of all intersected objects.
     */
    raycast(camera, scene) {
        if(this.normalisedMousePosition.x !== null && this.normalisedMousePosition.y !== null) {
            this.raycaster.setFromCamera(this.normalisedMousePosition, camera);
            const objects = this.raycaster.intersectObjects(scene.children, false);
            this.normalisedMousePosition.set(null, null);
            return objects;
        }    
        return [];
    }
}

export { ClickHandler };    
