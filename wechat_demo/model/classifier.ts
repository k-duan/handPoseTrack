/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tfl from '@tensorflow/tfjs-layers';
import * as tf from '@tensorflow/tfjs-core';
import {drawPoint, drawSegment} from './util';

const PREPROCESS_DIVISOR = 255 / 2;
const INPUT_WIDTH = 256;
const INPUT_HEIGHT = 256;
const NUM_KEYPOINTS = 21;

export interface CameraSize {
  width: number;
  height: number;
}

export class Classifier {
  // private mobileNet: MobileNet;
  private model: tfl.LayersModel;

  constructor(private page: WechatMiniprogram.Page.Instance<any, any>) {}

  async load() {
    // this.mobileNet = new MobileNet();
    
    this.page.setData({result: 'loading model...'});
    const start = Date.now();
    // await this.mobileNet.load();
    this.model = await tfl.loadLayersModel('http://192.168.0.18:8000/tfjs_models/hand_landmark.web_model/model.json')
    const result = `model loaded: ${Date.now() - start}ms\n`;
    this.page.setData({result});
  }

  async detect(ab: ArrayBuffer, size: CameraSize) {
    const data = new Uint8Array(ab);
    const scale_x = size.width / INPUT_WIDTH
    const scale_y = size.height / INPUT_HEIGHT
    let result = '';
    var kpts
    var conf
    tf.tidy(() => {
      const temp = tf.browser.fromPixels({data, ...size}, 4);
      const pixels = temp.slice([0, 0, 0], [-1, -1, 3]).resizeBilinear([INPUT_WIDTH, INPUT_HEIGHT]);
      const start = Date.now();
      const preprocessedInput = tf.div(tf.sub(pixels.asType('float32'), PREPROCESS_DIVISOR), PREPROCESS_DIVISOR).expandDims(0);
      const tensor = this.model.predict(preprocessedInput) as tf.Tensor;
      result += `prediction: ${Date.now() - start}ms\n`;
      kpts = Array.from(tensor[0].dataSync());
      conf = Array.from(tensor[1].dataSync());
      result += `${conf}\n`;
      return result;
    });
    this.page.setData({result});
    if (conf[0] >= 0.5) {
      return kpts
    }
    return []
  }

  drawHandPose(ctx: CanvasContext, kpts: Array, size: CameraSize) {
    if (ctx == null || kpts == null || kpts.length != NUM_KEYPOINTS * 2) {
      ctx.draw()
      return
    }

    const scale_x = size.width / INPUT_WIDTH
    const scale_y = size.height / INPUT_HEIGHT

    // Points
    for (let i = 0; i < NUM_KEYPOINTS; i++) {
      drawPoint(ctx, kpts[2 * i + 1] * scale_y, kpts[2 * i] * scale_x, 3, 'red')
    }

    // Segments
    // P0->P1
    drawSegment(ctx, kpts, 0, 1, scale_x, scale_y, 2, 'blue')
    // P1->P2
    drawSegment(ctx, kpts, 1, 2, scale_x, scale_y, 2, 'blue')
    // P2->P3
    drawSegment(ctx, kpts, 2, 3, scale_x, scale_y, 2, 'blue')
    // P3->P4
    drawSegment(ctx, kpts, 3, 4, scale_x, scale_y, 2, 'blue')
    // P2->P5
    drawSegment(ctx, kpts, 2, 5, scale_x, scale_y, 2, 'blue')
    // P5->P6
    drawSegment(ctx, kpts, 5, 6, scale_x, scale_y, 2, 'blue')
    // P6->P7
    drawSegment(ctx, kpts, 6, 7, scale_x, scale_y, 2, 'blue')
    // P7->P8
    drawSegment(ctx, kpts, 7, 8, scale_x, scale_y, 2, 'blue')
    // P5->P9
    drawSegment(ctx, kpts, 5, 9, scale_x, scale_y, 2, 'blue')
    // P9->P10
    drawSegment(ctx, kpts, 9, 10, scale_x, scale_y, 2, 'blue')
    // P10->P11
    drawSegment(ctx, kpts, 10, 11, scale_x, scale_y, 2, 'blue')
    // P11->P12
    drawSegment(ctx, kpts, 11, 12, scale_x, scale_y, 2, 'blue')
    // P9->P13
    drawSegment(ctx, kpts, 9, 13, scale_x, scale_y, 2, 'blue')
    // P13->P14
    drawSegment(ctx, kpts, 13, 14, scale_x, scale_y, 2, 'blue')
    // P14->P15
    drawSegment(ctx, kpts, 14, 15, scale_x, scale_y, 2, 'blue')
    // P15->P16
    drawSegment(ctx, kpts, 15, 16, scale_x, scale_y, 2, 'blue')
    // P13->P17
    drawSegment(ctx, kpts, 13, 17, scale_x, scale_y, 2, 'blue')
    // P17->P18
    drawSegment(ctx, kpts, 17, 18, scale_x, scale_y, 2, 'blue')
    // P18->P19
    drawSegment(ctx, kpts, 18, 19, scale_x, scale_y, 2, 'blue')
    // P19->P20
    drawSegment(ctx, kpts, 19, 20, scale_x, scale_y, 2, 'blue')
    // P17->P0
    drawSegment(ctx, kpts, 17, 0, scale_x, scale_y, 2, 'blue')
    ctx.draw()
  }

  dispose() {
    this.model.dispose();
  }
}
