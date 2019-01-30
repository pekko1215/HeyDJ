const video = document.getElementById('dummyCamera');
const canvas = document.getElementById('output');
const dummyCanvas = document.createElement('canvas');
const ctx = dummyCanvas.getContext("2d");
const displayCtx = canvas.getContext("2d");
const range = document.getElementById('range');
const dotSize = document.getElementById('dotSize');

const $onColor = document.getElementById('onColor')
const $offColor = document.getElementById('offColor')


var dotHeight = 5;
var dotWidth = 5;
var frameSkipper = 2;

var onColor = 0xcc0000;
var offColor = 0x220000;

const options = {
	audio:false,
	video:{
		facingMode:'environment'
	}
};

(async ()=>{
	try {
		var stream = await navigator.mediaDevices.getUserMedia(options);
	}catch(e){
		console.error(e)
	}
	video.srcObject = stream;
})();
const {width,height} = canvas;
dummyCanvas.width = width;
dummyCanvas.height = height;

(function draw(){
	if(frameSkipper != 0){
		frameSkipper--;
		return requestAnimationFrame(draw);
	}
	frameSkipper = 2;
	const rangeValue = Number(range.value);
	dotWidth = dotHeight = (Number(dotSize.value) || 5);
	onColor = parseInt($onColor.value.slice(1),16) || 0xcc0000;
	offColor = parseInt($offColor.value.slice(1),16) || 0x220000;

	ctx.clearRect(0,0,width,height);
	ctx.drawImage(video,0,0,width,height);
	const imageData = ctx.getImageData(0, 0, width, height);
	for(var x = 0;x < width/dotWidth; x++){
		for(y = 0;y < height/dotHeight; y++){
			var indexies = getBoxIndexies(x,y,dotWidth,dotHeight,width,height);
			var target = indexies[0] * 4;
			var ave = imageData.data[target] + imageData.data[target+1] + imageData.data[target+2];
			ave /= 3;
			var cl = ave < rangeValue ? offColor : onColor;
			indexies.forEach((idx,i)=>{
				var target = idx * 4;
				imageData.data[target+0] = (cl & 0xFF0000) >> 16;
				imageData.data[target+1] = (cl & 0x00FF00) >> 8;
				imageData.data[target+2] = (cl & 0x0000FF) >> 0;
			})
			getRoundIndexies(x,y,dotWidth,dotHeight,width,height).forEach((idx,i)=>{
				var target = idx * 4;
				imageData.data[target+0] = (offColor & 0xFF0000) >> 16;
				imageData.data[target+1] = (offColor & 0x00FF00) >> 8;
				imageData.data[target+2] = (offColor & 0x0000FF) >> 0;
			})
		}
	}
	ctx.putImageData(imageData, 0, 0);
	displayCtx.drawImage(dummyCanvas, 0, 0);
	delete imageData;
	requestAnimationFrame(draw)
})();

function getBoxIndexies(x,y,dw,dh,width,height){
	var dots = [];
	var xIdx = x * dw;
	var yIdx = y * dh;
	for(var x = xIdx;x < xIdx + dw;x++){
		for(var y = yIdx;y < yIdx + dh;y ++){
			if(x >= width || y >= height) continue;
			dots.push(y * width + x);
		}
	}
	return dots;
}

function getRoundIndexies(x,y,dw,dh,width,height){
	var dots = [];
	var xIdx = x * dw;
	var yIdx = y * dh;
	for(var x = xIdx;x < xIdx + dw;x++){
		for(var y = yIdx;y < yIdx + dh;y ++){
			if(x >= width || y >= height) continue;
			if(x == xIdx || y == yIdx || x == xIdx + dw - 1 || y == yIdx + dh - 1){
				dots.push(y * width + x);
			}
		}
	}
	return dots;
}