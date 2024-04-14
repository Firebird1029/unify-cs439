import "@testing-library/jest-dom";

global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const { createCanvas } = require("canvas");

global.canvas = createCanvas(200, 200);
