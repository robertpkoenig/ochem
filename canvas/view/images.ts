import p5 from "p5";

let checkImage: p5.Image;
let xImage: p5.Image;

function loadImages(p5: p5) {
  checkImage = p5.loadImage("/assets/checkmark.png");
  xImage = p5.loadImage("/assets/xmark.png");
}

export { checkImage, xImage, loadImages };
