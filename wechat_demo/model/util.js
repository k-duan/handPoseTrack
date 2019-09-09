"use strict";
/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
Object.defineProperty(exports, "__esModule", { value: true });
function drawPoint(ctx, y, x, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}
exports.drawPoint = drawPoint;
/**
 * Draws a line on a canvas, i.e. a joint
 */
function drawSegmentImpl(ctx, _a, _b, linewidth, color) {
    var ay = _a[0], ax = _a[1];
    var by = _b[0], bx = _b[1];
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineWidth = linewidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}
exports.drawSegmentImpl = drawSegmentImpl;
function drawSegment(ctx, keypoints, i, j, scale_x, scale_y, linewidth, color) {
    // Draw segment from Pi -> Pj
    drawSegmentImpl(ctx, [keypoints[2 * i + 1] * scale_y, keypoints[2 * i] * scale_x], [keypoints[2 * j + 1] * scale_y, keypoints[2 * j] * scale_x], linewidth, color);
}
exports.drawSegment = drawSegment;
function drawHandPose(page, num_keypoints, scale_x, scale_y) {
    if (page.ctx == null || page.kpts == null || page.kpts.length != 42) {
        page.ctx.draw();
        return;
    }
    var ctx = page.ctx;
    var kpts = page.kpts;
    // Points
    for (var i = 0; i < num_keypoints; i++) {
        drawPoint(ctx, kpts[2 * i + 1] * scale_y, kpts[2 * i] * scale_x, 3, 'red');
    }
    // Segments
    // P0->P1
    drawSegment(ctx, kpts, 0, 1, scale_x, scale_y, 2, 'blue');
    // P1->P2
    drawSegment(ctx, kpts, 1, 2, scale_x, scale_y, 2, 'blue');
    // P2->P3
    drawSegment(ctx, kpts, 2, 3, scale_x, scale_y, 2, 'blue');
    // P3->P4
    drawSegment(ctx, kpts, 3, 4, scale_x, scale_y, 2, 'blue');
    // P2->P5
    drawSegment(ctx, kpts, 2, 5, scale_x, scale_y, 2, 'blue');
    // P5->P6
    drawSegment(ctx, kpts, 5, 6, scale_x, scale_y, 2, 'blue');
    // P6->P7
    drawSegment(ctx, kpts, 6, 7, scale_x, scale_y, 2, 'blue');
    // P7->P8
    drawSegment(ctx, kpts, 7, 8, scale_x, scale_y, 2, 'blue');
    // P5->P9
    drawSegment(ctx, kpts, 5, 9, scale_x, scale_y, 2, 'blue');
    // P9->P10
    drawSegment(ctx, kpts, 9, 10, scale_x, scale_y, 2, 'blue');
    // P10->P11
    drawSegment(ctx, kpts, 10, 11, scale_x, scale_y, 2, 'blue');
    // P11->P12
    drawSegment(ctx, kpts, 11, 12, scale_x, scale_y, 2, 'blue');
    // P9->P13
    drawSegment(ctx, kpts, 9, 13, scale_x, scale_y, 2, 'blue');
    // P13->P14
    drawSegment(ctx, kpts, 13, 14, scale_x, scale_y, 2, 'blue');
    // P14->P15
    drawSegment(ctx, kpts, 14, 15, scale_x, scale_y, 2, 'blue');
    // P15->P16
    drawSegment(ctx, kpts, 15, 16, scale_x, scale_y, 2, 'blue');
    // P13->P17
    drawSegment(ctx, kpts, 13, 17, scale_x, scale_y, 2, 'blue');
    // P17->P18
    drawSegment(ctx, kpts, 17, 18, scale_x, scale_y, 2, 'blue');
    // P18->P19
    drawSegment(ctx, kpts, 18, 19, scale_x, scale_y, 2, 'blue');
    // P19->P20
    drawSegment(ctx, kpts, 19, 20, scale_x, scale_y, 2, 'blue');
    // P17->P0
    drawSegment(ctx, kpts, 17, 0, scale_x, scale_y, 2, 'blue');
    ctx.draw();
}
exports.drawHandPose = drawHandPose;
//# sourceMappingURL=util.js.map