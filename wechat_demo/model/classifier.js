"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tfl = require("@tensorflow/tfjs-layers");
var tf = require("@tensorflow/tfjs-core");
var util_1 = require("./util");
var PREPROCESS_DIVISOR = 255 / 2;
var INPUT_WIDTH = 256;
var INPUT_HEIGHT = 256;
var NUM_KEYPOINTS = 21;
var Classifier = /** @class */ (function () {
    function Classifier(page) {
        this.page = page;
    }
    Classifier.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var start, _a, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // this.mobileNet = new MobileNet();
                        this.page.setData({ result: 'loading model...' });
                        start = Date.now();
                        // await this.mobileNet.load();
                        _a = this;
                        return [4 /*yield*/, tfl.loadLayersModel('http://192.168.0.18:8000/tfjs_models/hand_landmark.web_model/model.json')];
                    case 1:
                        // await this.mobileNet.load();
                        _a.model = _b.sent();
                        result = "model loaded: " + (Date.now() - start) + "ms\n";
                        this.page.setData({ result: result });
                        return [2 /*return*/];
                }
            });
        });
    };
    Classifier.prototype.detect = function (ab, size) {
        return __awaiter(this, void 0, void 0, function () {
            var data, scale_x, scale_y, result, kpts, conf;
            var _this = this;
            return __generator(this, function (_a) {
                data = new Uint8Array(ab);
                scale_x = size.width / INPUT_WIDTH;
                scale_y = size.height / INPUT_HEIGHT;
                result = '';
                tf.tidy(function () {
                    var temp = tf.browser.fromPixels(__assign({ data: data }, size), 4);
                    var pixels = temp.slice([0, 0, 0], [-1, -1, 3]).resizeBilinear([INPUT_WIDTH, INPUT_HEIGHT]);
                    var start = Date.now();
                    var preprocessedInput = tf.div(tf.sub(pixels.asType('float32'), PREPROCESS_DIVISOR), PREPROCESS_DIVISOR).expandDims(0);
                    var tensor = _this.model.predict(preprocessedInput);
                    result += "prediction: " + (Date.now() - start) + "ms\n";
                    kpts = Array.from(tensor[0].dataSync());
                    conf = Array.from(tensor[1].dataSync());
                    result += conf + "\n";
                    result += tf.getBackend() + "\n";
                    return result;
                });
                this.page.setData({ result: result });
                if (conf[0] >= 0.5) {
                    return [2 /*return*/, kpts];
                }
                return [2 /*return*/, []];
            });
        });
    };
    Classifier.prototype.drawHandPose = function (ctx, kpts, size) {
        if (ctx == null || kpts == null || kpts.length != NUM_KEYPOINTS * 2) {
            ctx.draw();
            return;
        }
        var scale_x = size.width / INPUT_WIDTH;
        var scale_y = size.height / INPUT_HEIGHT;
        // Points
        for (var i = 0; i < NUM_KEYPOINTS; i++) {
            util_1.drawPoint(ctx, kpts[2 * i + 1] * scale_y, kpts[2 * i] * scale_x, 3, 'red');
        }
        // Segments
        // P0->P1
        util_1.drawSegment(ctx, kpts, 0, 1, scale_x, scale_y, 2, 'blue');
        // P1->P2
        util_1.drawSegment(ctx, kpts, 1, 2, scale_x, scale_y, 2, 'blue');
        // P2->P3
        util_1.drawSegment(ctx, kpts, 2, 3, scale_x, scale_y, 2, 'blue');
        // P3->P4
        util_1.drawSegment(ctx, kpts, 3, 4, scale_x, scale_y, 2, 'blue');
        // P2->P5
        util_1.drawSegment(ctx, kpts, 2, 5, scale_x, scale_y, 2, 'blue');
        // P5->P6
        util_1.drawSegment(ctx, kpts, 5, 6, scale_x, scale_y, 2, 'blue');
        // P6->P7
        util_1.drawSegment(ctx, kpts, 6, 7, scale_x, scale_y, 2, 'blue');
        // P7->P8
        util_1.drawSegment(ctx, kpts, 7, 8, scale_x, scale_y, 2, 'blue');
        // P5->P9
        util_1.drawSegment(ctx, kpts, 5, 9, scale_x, scale_y, 2, 'blue');
        // P9->P10
        util_1.drawSegment(ctx, kpts, 9, 10, scale_x, scale_y, 2, 'blue');
        // P10->P11
        util_1.drawSegment(ctx, kpts, 10, 11, scale_x, scale_y, 2, 'blue');
        // P11->P12
        util_1.drawSegment(ctx, kpts, 11, 12, scale_x, scale_y, 2, 'blue');
        // P9->P13
        util_1.drawSegment(ctx, kpts, 9, 13, scale_x, scale_y, 2, 'blue');
        // P13->P14
        util_1.drawSegment(ctx, kpts, 13, 14, scale_x, scale_y, 2, 'blue');
        // P14->P15
        util_1.drawSegment(ctx, kpts, 14, 15, scale_x, scale_y, 2, 'blue');
        // P15->P16
        util_1.drawSegment(ctx, kpts, 15, 16, scale_x, scale_y, 2, 'blue');
        // P13->P17
        util_1.drawSegment(ctx, kpts, 13, 17, scale_x, scale_y, 2, 'blue');
        // P17->P18
        util_1.drawSegment(ctx, kpts, 17, 18, scale_x, scale_y, 2, 'blue');
        // P18->P19
        util_1.drawSegment(ctx, kpts, 18, 19, scale_x, scale_y, 2, 'blue');
        // P19->P20
        util_1.drawSegment(ctx, kpts, 19, 20, scale_x, scale_y, 2, 'blue');
        // P17->P0
        util_1.drawSegment(ctx, kpts, 17, 0, scale_x, scale_y, 2, 'blue');
        ctx.draw();
    };
    Classifier.prototype.dispose = function () {
        this.model.dispose();
    };
    return Classifier;
}());
exports.Classifier = Classifier;
//# sourceMappingURL=classifier.js.map