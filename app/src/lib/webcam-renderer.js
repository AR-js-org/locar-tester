import * as THREE from "three";

/** Class to render the webcam. */
class WebcamRenderer {
  /**
   * Create a WebcamRenderer.
   * @param {THREE.WebGLRenderer} renderer - the Three.js renderer.
   * @param {string} videoElementSelector - selector to obtain the HTML video 
   * element to render the webcam feed. If a falsy value (e.g. null or 
   * undefined), a video element will be created.
   * @options {Object} - options to use for initialising the camera. Currently
   * width and height properties are understood.
   */
  constructor(renderer, videoElementSelector, options) {
    this.renderer = renderer;
    this.renderer.autoClear = false;
    this.sceneWebcam = new THREE.Scene();
    let video;
    if (!videoElementSelector) {
      video = document.createElement("video");
      video.setAttribute("autoplay", true);
      video.setAttribute("playsinline", true);
      video.style.display = "none";
      document.body.appendChild(video);
    } else {
      video = document.querySelector(videoElementSelector);
    }
    this.geom = new THREE.PlaneGeometry();
    this.texture = new THREE.VideoTexture(video);
    this.material = new THREE.MeshBasicMaterial({ map: this.texture });
    const mesh = new THREE.Mesh(this.geom, this.material);
    this.sceneWebcam.add(mesh);
    this.cameraWebcam = new THREE.OrthographicCamera(
      -0.5,
      0.5,
      0.5,
      -0.5,
      0,
      10
    );
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: {
          width: options?.width || 1280,
          height: options?.height || 720,
          facingMode: "environment",
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          console.log(`using the webcam successfully...`);
          video.srcObject = stream;
          video.play();
        })
        .catch((e) => {
          setTimeout(() => {
            alert(
              "Webcam Error\nName: " + e.name + "\nMessage: " + e.message
            );
          }, 1000);
        });
    } else {
      setTimeout(() => {
        alert("sorry - media devices API not supported");
      }, 1000);
    }
  }

  /**
   * Update the webcam.
   * Should be called from your Three.js rendering (animation) function.
   */
  update() {
    this.renderer.clear();
    this.renderer.render(this.sceneWebcam, this.cameraWebcam);
    this.renderer.clearDepth();
  }

  /**
   * Free up the memory associated with the webcam.
   * Should be called when your application closes.
   */
  dispose() {
    this.material.dispose();
    this.texture.dispose();
    this.geom.dispose();
  }
}

export { WebcamRenderer };
