import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SlideTexts from './components/slideTexts.jsx'
import prefetchImages from 'prefetch-image';

const slideLength = 39
var images = [];
const appWidth = screen.width;


for (var i = 1; i < slideLength; i++) {
    images.push("img/" + i +"/fond.png");
    images.push("img/" + i +"/p1.png");
    images.push("img/" + i +"/p2.png");
    images.push("img/" + i +"/p3.png");
}

prefetchImages(images, 6)
  .then(() => {
    console.log('all images loaded!');
    //start init your page logic...
  });


var slideNumber = 1;
var slideText;

{/* function for Arrows press key */}

window.addEventListener("keydown", function (event) {

	var x = event.which || event.keyCode;

  if (x == 39) {
    return clickNext(event);
  } if(x == 37){
	return clickPrev(event);
	}
	});



	{/* Slide elements */}

function Element(){

	let imagePathFond = "img/" + slideNumber + "/fond.png";
	let imagePathP3 = "img/" + slideNumber + "/p3.png";
	let imagePathP2 = "img/" + slideNumber + "/p2.png";
	let imagePathP1 = "img/" + slideNumber + "/p1.png";

slideText = SlideTexts[slideNumber];

	let slideImages =
	<div>
	<img  className= "fond" src= {imagePathFond}/>
	<img  className= "p3" src= {imagePathP3}/>
	<img  className= "p2" src= {imagePathP2}/>
	<img  className= "p1" src= {imagePathP1}/>
	</div>;

	let slideWoText =

		<div className="sliderContainer">
		{slideImages}
	</div>;

	let slideWText =

			<div className="sliderContainer">
			{slideImages}
			<p id="text">{slideText}</p>
		</div>;


	if(slideText == "none"){

	return slideWoText;


	}else{

	return slideWText;
	}
}

{/* Reset function */}

function ElementReset(){
return <div></div>;
}

{/* Next and Prev functions */}

function clickPrev(e) {
	if(slideNumber != 0){
	e.preventDefault();
	slideNumber = --slideNumber
	ReactDOM.render(<ElementReset/>, document.getElementById('app'))
	ReactDOM.render(<Element/>, document.getElementById('app'));
	}
}

function clickNext(e) {
if(slideNumber < (SlideTexts.length - 1)){
	e.preventDefault();
	slideNumber = ++slideNumber
	ReactDOM.render(<ElementReset/>, document.getElementById('app'))
	ReactDOM.render(<Element/>, document.getElementById('app'));
	}
}

document.getElementById("app").addEventListener("click", function clickNext(e) {
if(slideNumber < (SlideTexts.length - 1)){
	e.preventDefault();
	slideNumber = ++slideNumber
	ReactDOM.render(<ElementReset/>, document.getElementById('app'))
	ReactDOM.render(<Element/>, document.getElementById('app'));
	}
} );



ReactDOM.render(<Element/>, document.getElementById('app'));
