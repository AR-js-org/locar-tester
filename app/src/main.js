import * as THREE from 'three';
import * as LocAR from 'locar';

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.001, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const logger = {
    sendData: async function(endpoint, data) {
        return await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }
};

const locar = new LocAR.LocationBased(scene, camera, {}, logger);

window.addEventListener("resize", e => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const cam = new LocAR.WebcamRenderer(renderer);

let firstLocation = true;

const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

locar.on("gpsupdate", (pos, distMoved) => {
    if(firstLocation) {
        alert(`Got the initial location: longitude ${pos.coords.longitude}, latitude ${pos.coords.latitude}`);

        const boxProps = [{
            latDis: 0.001,
            lonDis: 0,
            colour: 0xff0000,
            colourAsText: "red"
        }, {
            latDis: -0.001,
            lonDis: 0,
            colour: 0xffff00,
            colourAsText: "yellow"
        }, {
            latDis: 0,
            lonDis: -0.001,
            colour: 0x00ffff,
            colourAsText: "cyan"
        }, {
            latDis: 0,
            lonDis: 0.001,
            colour: 0x00ff00,
            colourAsText: "green"
        }];

        const geom = new THREE.BoxGeometry(20,20,20);

        for(const boxProp of boxProps) {
            const mesh = new THREE.Mesh(
                geom, 
                new THREE.MeshBasicMaterial({color: boxProp.colourAsText})
            );
        
            console.log(`adding at ${pos.coords.longitude + boxProp.lonDis},${pos.coords.latitude + boxProp.latDis}`);    
            locar.add(
                mesh, 
                pos.coords.longitude + boxProp.lonDis, 
                pos.coords.latitude + boxProp.latDis,
                0,
                { colour : boxProp.colourAsText }
            );
        }
        
        firstLocation = false;
    }
});

locar.startGps();

renderer.setAnimationLoop(animate);

function animate() {
    cam.update();
    deviceOrientationControls.update();
    renderer.render(scene, camera);
}

