/*
This template visualises Drought Impact per square meter in European Union Countries
data is taken from https://www.eea.europa.eu/en/datahub/featured-data/statistical-data/datahubitem-view/c7c868d8-95dc-4f23-9dde-4cdc2738cc4d
*/

//header text
const HEADERTEXT = "EU Drought Data per Country";

//margin at bottom of canvas
const BOTTOMMARGIN = 52;

// optional parameter to get data from just one country
//let geoCode = "FR";
// parameter to get data from just one year
let year = 2022;

let textVisible = true

// This vector is used to display the countries drought areas on the screen. It can be filled in different functions - for ex. getAreasForYear - as well as manually. Objects within the vector should be of type {country : String, area: Number, centre : {x: Number, y: Number}}
let droughtsToDisplay = [];

let finalDrought = [];

let circleSpeed = -1;

let backAlpha = 255;

let centres = [];

//maximum area stored within spreadsheet data
let maximumDroughtArea = 0;

// variables for editing colour with sliders
let r = 255, g = 255, b = 255, a = 200;

let numberOfPoints = 5;


function setup() {
  //calculate the maximum area and store in maximumDroughtArea variable
  maximumDroughtArea = calculateMaximumArea();

  // create canvas of maximum width and height
  createCanvas(windowWidth * 0.9, windowHeight * 0.9);

  // set stroke to null
  noStroke();

  // set text align to centre
  textAlign(CENTER, CENTER);

  //generate droughts & centres for first time
  droughtsToDisplay = getAreasForYear(year);
  finalDrought = droughtsToDisplay;
  centres = recalculateCentres();

  // setup midi
  setupController();

  // assigning values to speedX and speeedY
  speedX = random(10);
  speedY = random(10);

}

function draw() {
  // set background to black
  background(0, backAlpha);

  // update droughtsToDisplay list to those of the currently displayed year
  // droughtsToDisplay = getAreasForYear(year);

  // set text size and text align for countries
  textSize(12);

  let index = 0;
  // loop through droughtsToDisplay and display circle with area & position given
  for (index in droughtsToDisplay) {


    if (droughtsToDisplay[index].area < finalDrought[index].area) {
      droughtsToDisplay[index].area = droughtsToDisplay[index].area + 100;
    }

    if (droughtsToDisplay[index].area > finalDrought[index].area) {
      droughtsToDisplay[index].area = droughtsToDisplay[index].area - 100;
    }

    // get info stored in the current index of the array
    const display = droughtsToDisplay[index];

    // get centre position
    const centre = centres[index];

    // set fill of circles to brown with alpha 100 - to allow overlap
    fill(r, g, b, a);
    noStroke(0);

    let diameter = (display.area / maximumDroughtArea) * windowHeight;
    // let diameter = (display.area / maximumDroughtArea) * windowHeight

    // draw circle at (x, y) with proportional area depending on maximumDroughtArea and windowHeight
    if (diameter > 0) {
      diameter += 20
      // circle (centre.x, centre.y, diameter);

      polygon(centre.x, centre.y, diameter / 2, numberOfPoints);


      // set fill to white for country name
      fill(255);

      // draw country name at centre of area
      if (textVisible)
        text(display.country, centre.x, centre.y);
    }

    centre.x += centre.vx
    centre.y += centre.vy

    if (centre.x > width || centre.x < 0) {
      centre.vx *= -1
    }


    if (centre.y > height || centre.y < 0) {

      centre.vy *= -1

    }



  }

  // draw title at end to prevent covering it
  textSize(36);
  fill(255);
  stroke(0);
  strokeWeight(2);

  text(HEADERTEXT, width / 2, BOTTOMMARGIN / 2);
  text(year, 75, height - BOTTOMMARGIN / 2)

}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}


/**
 * React to inputs from the control change sliders in the Midi controller
 * @param {Event} e 
 */
function allCC(e) {
  console.log('controller:', e.controller.number, 'value:', e.value);
  switch (e.controller.number) {
    case 32: {
      // knob 1
      year = floor(map(e.value, 0, 1, 2000, 2023));
      finalDrought = getAreasForYear(year);
      console.log(year);
      break;
    }
    case 33: {
      numberOfPoints = map(e.value, 0, 1, 50, 5);
      break;
    }
    case 34: {
      circleSpeed = map(e.value, 0, 1, 2, 70);
      for(let i = 0; i < centres.length; i++) {
        let vector=createVector(centres[i].vx, centres[i].vy);
        vector.normalize()
        vector.mult(circleSpeed)

        centres[i].vx = vector.x;
        centres[i].vy = vector.y;

        // Diana is the Queen of code!

      }
      break;
    }
    case 35: {
      backAlpha = map(e.value, 0, 1, 255, 5);
      break;
    }
    case 36: {
      // slider 1
      r = 255 * e.value;
      break;
    }
    case 37: {
      // slider 2
      g = 255 * e.value;
      break;
    }
    case 38: {
      // slider 3
      b = 255 * e.value;
      break;
    }
    case 39: {
      // slider 4
      a = 200 * e.value;
      break;
    }
  }
}

/**
 * React to inputs from the bottom buttons on the controller
 * @param {Event} e 
 */
function allNoteOn(e) {
  console.log('controller:', e.data[1], 'value:', e.value);
  switch (e.data[1]) {
    case 40: {
      if (e.value) {
        textVisible = !textVisible;
        // if value is 1 (button pressed)
        // if value is 0 (button released)
      }
    }
      break;
    case 41: {
      if (e.value) {

      } else {
      }
      break;
    }
    case 42: {
      if (e.value) {
      } else {
      }
      break;
    }
    case 43: {
      if (e.value) {
      } else {
      }
      break;
    }
  }
}
