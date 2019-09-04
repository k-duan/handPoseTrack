const tf = require('@tensorflow/tfjs');

// Optional Load the binding:
// Use '@tensorflow/tfjs-node-gpu' if running with GPU.
const tfnode = require('@tensorflow/tfjs-node');
const {createCanvas, Image} = require('canvas');
const fs = require("fs");

function drawPoints(canvas, keypoints, output_path) {
  tf.util.assert(keypoints.length == 42)
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  for(var i in keypoints) {
    if (i%2 == 0) {
      // console.log(i)
      // console.log(keypoints[i])
      ctx.moveTo(keypoints[i], keypoints[i+1]);
      ctx.arc(keypoints[i], keypoints[i+1], 5, 0, Math.PI*2, true);
    }
  }

  // ctx.moveTo(50, 50)
  // ctx.arc(50, 50, 5, 0, Math.PI*2, true);
  ctx.fillStyle='red';
  ctx.fill();

  // Write output as png
  var buf = canvas.toBuffer();
  fs.writeFileSync(output_path, buf);
}

async function loadImage(imageUrl) {
  const image = new Image();
  const promise = new Promise((resolve, reject) => {
    image.crossOrigin = '';
    image.onload = () => {
      resolve(image);
    };
  });

  image.src = imageUrl;
  return promise;
}

async function trackHandPose() {
  // Load hand pose model
  const MODEL_PATH = 'tfjs_models/hand_landmark.web_model/model.json';
  console.log(MODEL_PATH)
  const model = await tf.loadLayersModel(tfnode.io.fileSystem(MODEL_PATH))
  // model.summary();

  const width = 256;
  const height = 256;
  
  image = await loadImage('test.png');
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const input = tf.browser.fromPixels(canvas);
  const output = model.predict(input.expandDims(0));
  
  // Visualize
  const kpts = Array.from(await output[0].data());
  const conf = Array.from(await output[1].data());
  console.log(kpts)
  console.log(conf)
  drawPoints(canvas, kpts, './result.png')
}

trackHandPose();
