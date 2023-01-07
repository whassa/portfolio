const density = '  _.,-=+:;cba!?0123456789$W#@Ñ';

let img = [];
let text = '';
const video = document.getElementById('video') 
const len = density.length;
const canva = document.getElementById('canva');    
const asciiVideo = document.getElementById('ascii-video');

function renderImage(img) {
    text = '';
    for (let j = 0; j < video.height; j++) {
        for (let i = 0; i < video.width; i++) {
          const pixelIndex = (i + j * video.width) * 4;
          const r = img.data[pixelIndex + 0];
          const g = img.data[pixelIndex + 1];
          const b = img.data[pixelIndex + 2];
          const avg = (r + g + b) / 3;
          const charIndex = Math.floor(avg*len/255);
            
          const c = density.charAt(charIndex);
          if (c == " ") text += "&nbsp;";
          else text += c;
        }
        text += '<br/>';
    }
    asciiVideo.innerHTML = text;
}

(async () => {
    try {
      video.srcObject = await navigator.mediaDevices.getUserMedia({video: true});
      await new Promise(r => video.onloadedmetadata = r);
      canva.width = 100;
      canva.height = 60;
      const ctx = canva.getContext('2d');
      requestAnimationFrame(function loop() {
        ctx.drawImage(video, 0, 0, 100, 60);
        img = ctx.getImageData(0, 0, 100, 60);
        renderImage(img);
        requestAnimationFrame(loop);
      });
    } catch(e) {
      console.log(e);
    }
  })();

