const tf = require('@tensorflow/tfjs');

// Optional Load the binding:
// Use '@tensorflow/tfjs-node-gpu' if running with GPU.
const tfnode = require('@tensorflow/tfjs-node');
const {createCanvas, Image} = require('canvas');
const fs = require("fs");
const num_keypoints = 21
const input_image_path = '../test.png'
const output_image_path = '../output.png'

function drawPoints(canvas, keypoints, output_path) {
  tf.util.assert(keypoints.length == 2*num_keypoints)
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  for(i = 0; i < num_keypoints; i++) {
    ctx.moveTo(keypoints[2*i], keypoints[2*i+1]);
    ctx.arc(keypoints[2*i], keypoints[2*i+1], 5, 0, Math.PI*2, true);
    ctx.fillText(i.toString(), keypoints[2*i]-5, keypoints[2*i+1]-5)
  }

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
  const MODEL_PATH = '../tfjs_models/hand_landmark.web_model/model.json';
  console.log(MODEL_PATH)
  const model = await tf.loadLayersModel(tfnode.io.fileSystem(MODEL_PATH))
  // model.summary();

  const width = 256;
  const height = 256;
  
  image = await loadImage(input_image_path);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const input = tf.browser.fromPixels(canvas).div(tf.scalar(127.5)).sub(tf.scalar(1.0));

  var start = new Date()
  const output = model.predict(input.expandDims(0));
  var execution_time = new Date() - start
  
  // Visualize
  const kpts = Array.from(await output[0].data());
  const conf = Array.from(await output[1].data());
  console.log("input image=%s, output image=%s, execution time=%fms, confidence=%f", input_image_path, output_image_path, execution_time, conf[0])
  drawPoints(canvas, kpts, output_image_path)
}

trackHandPose();
