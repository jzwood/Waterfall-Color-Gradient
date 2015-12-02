window.onload = function(){

  document.getElementById('hex1').value = localStorage.getItem("hex1") || '4F3AB0';
  document.getElementById('hex2').value = localStorage.getItem("hex2") || 'D5683A';
  window.numberOfColors = 14;
  parseBuild();

  //does full build when enter pressed
  window.addEventListener("keypress", function(evt){
    if(evt.keyCode == 13){
      parseBuild();
    }
  });
  //adds copy to clipboard listener to bar at bottom of screen
  document.getElementById('clipboard').addEventListener('click', function(event) {
    if(this.textContent.indexOf("rgb") >= 0){
      var getRGB = this.textContent.replace('Copy ','').replace(' to your clipboard','');
      copy2Temp2Clip(getRGB);
    }
  });
}

//saves clipText to computer's clipboard
function copy2Temp2Clip(clipText){
  var rgb = document.getElementById('rgbTempField');
  rgb.value = clipText;
  rgb.select();
  document.execCommand('copy');
  rgb.value = '';
  setClickCopyText("Copied!");
}

//sets the invisible text field that stores the text that'll be saved to clipboard
function setClickCopyText(newText) {
  var clickText = document.getElementById('clipboard');
  clickText.innerHTML = newText;
}

//return hex color f % of the way from rgb1 to rgb2. f is elem of (0,1]
function rgb2Hex(x1,x2,f){
  var hex = parseInt(parseFloat(x1) + f*(parseFloat(x2)-parseFloat(x1))).toString(16).toUpperCase();
  return hex.length < 2 ? '0'+hex : hex;
}
//turns selected hex index into RGB int
function hex2RGB(hex,i1,i2){
  return parseInt(hex.slice(i1,i2),16).toString(10);
}

//returns complete list of rgbs of gradient
function getGradient(a,b,numSteps){
  var rL = hex2RGB(a,0,2), gL = hex2RGB(a,2,4), bL = hex2RGB(a,4,6);
  var rR = hex2RGB(b,0,2), gR = hex2RGB(b,2,4), bR = hex2RGB(b,4,6);
  var gradientScale = [],
  incr = 1/parseInt(numSteps);
  for(var step=0; step<=1; step+=incr){
    var rS = rgb2Hex(rL,rR,step.toPrecision(6));
    var gS = rgb2Hex(gL,gR,step.toPrecision(6));
    var bS = rgb2Hex(bL,bR,step.toPrecision(6));
    gradientScale.push('#'+rS+gS+bS);
  }
  return gradientScale;
}

//destroys all children elements of a node
function removeAllChildren(parentNode){
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild);
  }
}

function makeTable(scale){
  var spectrum = document.getElementById('spectrum'),
  spectrumHex = document.getElementById('spectrumHex');
  //tear down previous table
  removeAllChildren(spectrum);
  removeAllChildren(spectrumHex);
  //start making new table
  for(var hex in scale){
    //makes the colored columns of the spectrum
    var color = document.createElement('td');
    color.style.backgroundColor = scale[hex];
    color.className = 'colors';
    color.id = "c" + hex.toString();
    spectrum.appendChild(color);
    //makes the hex labels for the spectrum
    var colorHex = document.createElement('td');
    colorHex.className = 'hexText';
    colorHex.innerHTML = scale[hex];
    colorHex.id = "hc" + hex.toString();
    spectrumHex.appendChild(colorHex);
  }
  addListeners();
}

//when you click on colors you see the hex label
function addListeners(){
  var spec = document.getElementById('spectrum'),
  specHex = document.getElementById('spectrumHex');
  for(var swatch=0; swatch < spec.children.length; swatch++){
    spec.children[swatch].addEventListener("mouseover", function(evt){
      specHex.children['h'+this.id].style.color = "black";
      setClickCopyText("Copy "+this.style.backgroundColor + " to your clipboard");
    }, false);
    spec.children[swatch].addEventListener("click", function(evt){
      copy2Temp2Clip(this.style.backgroundColor);
    }, false);
    spec.children[swatch].addEventListener("mouseout", function(evt){
      specHex.children['h'+this.id].style.color = "white";
    }, false);
    specHex.children[swatch].addEventListener("mouseover", function(evt){
      this.style.color = "black";
    }, false);
    specHex.children[swatch].addEventListener("mouseout", function(evt){
      this.style.color = "white";
    }, false);
  }
}

function fastBuild(hex1,hex2){
  makeTable(getGradient(hex1,hex2,window.numberOfColors));
}

function parseBuild(){
  var hex1 = document.getElementById('hex1').value.trim().replace('#',''),
  hex2 = document.getElementById('hex2').value.trim().replace('#',''),
  num = window.numberOfColors;

  localStorage.setItem("hex1", hex1);
  localStorage.setItem("hex2", hex2);

  //anything
  hex1 = hex1.length !== 6 ? (hex1+'000000').slice(0,6) : hex1;
  hex2 = hex2.length !== 6 ? (hex2+'000000').slice(0,6) : hex2;

  document.getElementById('hex1').value = hex1;
  document.getElementById('hex2').value = hex2;

  var gradientList = getGradient(hex1,hex2,num);
  makeTable(gradientList);
}

//if you need the full array you can access from the console
function developer(step){
  var hex1 = document.getElementById('hex1').value.trim().replace('#',''),
      hex2 = document.getElementById('hex2').value.trim().replace('#','');
  hex1 = hex1.length !== 6 ? (hex1+'000000').slice(0,6) : hex1;
  hex2 = hex2.length !== 6 ? (hex2+'000000').slice(0,6) : hex2;
  console.log(getGradient(hex1,hex2,step));
}
