const pitft = require("pitft")
const chroma = require("chroma-js")

const fb = pitft("/dev/fb1") // Returns a framebuffer in direct mode.  See the clock.js example for double buffering mode

// Clear the screen buffer
fb.clear();
var xMax = fb.size().width;
var yMax = fb.size().height;

const scale = chroma.scale(['green', 'red']).domain([ 0, -80 ]);

module.exports = {
  display: function(network){
    let rgb = scale(network.signal).rgb();
    fb.font("fantasy", 24, true); // Use the "fantasy" font with size 24, and font weight bold, if available
    fb.clear();
    fb.color(rgb[0], rgb[1], rgb[2]);
    fb.rect(0, 0, xMax, yMax, true); // Draw a filled rectangle
    fb.color(0, 0, 0);
    fb.text(xMax/2, yMax/2-24, network.ssid, true, 0);
    fb.text(xMax/2, yMax/2, network.signal, true, 0);
  }
}
