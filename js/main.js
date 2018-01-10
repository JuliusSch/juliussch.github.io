window.onload = function() {
	console.log("ready");
	canvas = document.getElementById("posterCanvas");
	c = canvas.getContext("2d");
	radSpan = document.getElementById("radspan");
	stampScaleSpan = document.getElementById("imgscalespan");
	decRad = document.getElementById("decrad");
	incRad = document.getElementById("incrad");
	colour = '#aabbcc';
	colourPicker = document.getElementById("colourpicker");
	colourPicker.value = colour;
	cursorImage = document.getElementById("cursorimage");
	selectPaint = document.getElementById('selectpaint');
	selectStamp = document.getElementById('selectstamp');
	downloadbtn = document.getElementById('downloadbutton');
	downloadbtn.addEventListener('click', downloadImage);
	selectStamp.addEventListener('click', switchToStamp);
	selectPaint.addEventListener('click', switchToPaint);
	selectPaint.checked = true;
	decRad.addEventListener('click', function(e) {
		setRadius(radius - 5);
	});
	incRad.addEventListener('click', function(e) {
		setRadius(radius + 5);
	});
	document.getElementById('incscale').addEventListener('click', function(e) {
		if (stampScale < 4) stampScale += 0.05;
		stampScaleSpan.innerHTML = Math.round(stampScale * 100);
	});
	document.getElementById('decscale').addEventListener('click', function(e) {
		if (stampScale > 0.2) stampScale -= 0.05;
		stampScaleSpan.innerHTML = Math.round(stampScale * 100);
	});
	colourPicker.addEventListener('input', function(e) {
		console.log('colour change');
		colour = colourpicker.value;
		switchToPaint();
	}, false);
	drawImages = document.getElementsByClassName('drawnimage');
	for (var i = 0; i < drawImages.length; i++) {
		drawImages[i].addEventListener('click', setDrawImage);
	}
	imageToDraw = drawImages[0];
	c.lineWidth = radius;
	canvas.addEventListener('mousemove', drawPoint);
	canvas.addEventListener('mousedown', mouseDown);
	canvas.addEventListener('mouseup', mouseUp);
	canvas.addEventListener('mouseleave', mouseLeave);
	document.addEventListener('mousemove', mouseMove);
	var imageToLoad = new Image();
	if (localStorage.getItem('img')) {
		console.log('saved image found');
		imageToLoad.onload = function() {
			c.drawImage(imageToLoad, 0, 0);
		}
		imageToLoad.src = localStorage.getItem('img');
	}
}

var c, radius = 10, radSpan, decRad, incRad, colourPicker, colour, drawImages, imageToDraw,
cursorImage, selectPaint, selectStamp, stampScale = 1, lastScroll = 0, canvas, stampScaleSpan
downloadbtn;

dragging = false;

function drawPoint(e) {
	if (dragging && selectPaint.checked) {
		c.strokeStyle = colour;
		c.fillStyle = colour;
		c.lineTo(e.offsetX, e.offsetY);
		c.stroke();
		c.beginPath();
		c.arc(e.offsetX, e.offsetY, radius / 2, 0, Math.PI * 2);
		c.fill();
		c.beginPath();
		c.moveTo(e.offsetX, e.offsetY);
	}
}

function setDrawImage(e) {
	imageToDraw = e.target;
	document.body.style.cursor = "url('assets/drawimg12.png'), auto";
	cursorImage.childNodes[0].src = imageToDraw.src;
	switchToStamp();
}

function mouseLeave(e) {
	c.beginPath();
}

function mouseDown(e) {
	dragging = true;
	drawPoint(e);
}

function mouseUp(e) {
	dragging = false;
	c.beginPath();
	if (selectStamp.checked) {
		var x = e.offsetX - ((imageToDraw.naturalWidth / 2) * stampScale);
		var y = e.offsetY - ((imageToDraw.naturalHeight / 2) * stampScale);
		c.drawImage(imageToDraw, x, y, imageToDraw.naturalWidth * stampScale, imageToDraw.naturalHeight * stampScale);
	}
	saveImage();
}

function saveImage() {
	var imgDataURL = canvas.toDataURL();
	localStorage.setItem('img', imgDataURL);
}

function mouseMove(e) {
	var x = e.pageX - (imageToDraw.naturalWidth / 2);
	var y = e.pageY - (imageToDraw.naturalHeight / 2);
	cursorImage.style.transform = 'scale(' + stampScale + ')';
	cursorImage.style.left = x + 'px';
	cursorImage.style.top = y + 'px';
}

var minRad = 1, maxRad = 80, defaultRad = 10;

function setRadius(newRad) {
	if (newRad < minRad) {
		return;
	}
	if (newRad > maxRad) {
		return;
	}
	if (newRad % 5 == 1 && newRad != 1) {
		newRad -= 1;
	}
	radius = newRad;
	c.lineWidth = radius;
	radSpan.innerHTML = radius;
	switchToPaint();
}

function switchToStamp() {
	selectPaint.checked = false;
	selectStamp.checked = true;
	cursorImage.style.opacity = 0.5;
}

function switchToPaint() {
	selectStamp.checked = false;
	selectPaint.checked = true;
	cursorImage.style.opacity = 0;
}

function downloadImage(e) {
	if (canvas.msToBlob) { //for IE
                var blob = canvas.msToBlob();
                window.navigator.msSaveBlob(blob, 'myPoster.png');
            } //for good browsers
	downloadbtn.href = canvas.toDataURL();
	downloadbtn.download = 'myPainting.png';
}