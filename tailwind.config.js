const daisyUI = require('daisyui');

module.exports = {
  content: [],
  theme: {
    extend: {
      // Extend your existing theme settings...
    },
    daisyUI: {
      styled: true, // Enable styled forms and inputs
      themes: [], // You can add themes from Daisy UI
    },
  },
  plugins: [
    daisyUI,
    // Other plugins...
  ],
};
