// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock matchMedia for component libraries that might use it
global.matchMedia = global.matchMedia || function () {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};

// Mock the TextDecoder, which is not available in JSDOM
global.TextDecoder = require('util').TextDecoder;