const tf = require('@tensorflow/tfjs');

// Optional Load the binding:
// Use '@tensorflow/tfjs-node-gpu' if running with GPU.
const tfnode = require('@tensorflow/tfjs-node');

async function trackHandPose() {
  // Load hand pose model
  const MODEL_PATH = 'tfjs_models/hand_landmark.web_model/model.json';
  console.log(MODEL_PATH)
  const model = await tf.loadLayersModel(tfnode.io.fileSystem(MODEL_PATH))
  model.summary();
}

trackHandPose();
