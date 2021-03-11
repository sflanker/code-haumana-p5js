function learnToRead(p) {
  let puzzleImageNumbers;
  let puzzleImages;
  let answerNumber;
  let instruction;

  // These variables are declared here for debugging
  let randomcolor;
  let randomobj;
  let colorImageNumbers;
  let objectImageNumbers;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);

    p.background(50);

    resetPuzzle();
  };

  p.draw = function() {
    p.background("white");
    
    let column = 1;
    let row = 0;
    //draws grid of images
    for (let ix = 0; ix < 9; ix++) {
      row = row + 1;

      // check if we reached the bottom of the grid
      if (ix == 3) {
        column = column + 1;
        row = 1;
      } else {
        if (ix == 6) {
          column = column + 1;
          row = 1;
        } else {
          //skip
        }
      }
      
      p.image(puzzleImages[ix], column * 110, row * 110, 100, 100); //edit this code eventually me - Jasyah
    }

    //p.noLoop();

    // End of Draw function
  };

  p.doubleClicked = function() {
    // Double click the screen to reset the puzzle.
    resetPuzzle();
  };

  // Each puzzle consists of a grid of 9 images and a clue which is a
  // color & object combination that matches only one of the 9 images.
  // The player must then click on the correct image that matches the
  // specified clue.
  function resetPuzzle() {
    // ********************
    // STEP 1. pick a random color and a random object
    // We want randomcolor to have a value like "uliuli"
    // ********************

    randomcolor = Math.floor(p.random(0, 8));
    randomcolor = allColorsHI[randomcolor];
    // Kumu Paul said there were 8 objects,
    // but there were only seven 🤦‍♂️
    randomobj = allObjectsHI[Math.floor(p.random(0, 7))];

    console.log("we chose color: " + randomcolor + " and object: " + randomobj);

    // ********************
    // STEP 2. Get the list of images that match the color and the object
    // ********************
    colorImageNumbers = imagesByColor[randomcolor];
    objectImageNumbers = imagesByObject[randomobj];


    // DEBUG DISPLAY CODE (Moved to console)
    console.log("[" + colorImageNumbers.join(", ") + "]", 10, 50);
    console.log("[" + objectImageNumbers.join(", ") + "]", 10, 70);
    // END DEBUG DISPLAY CODE
    
    // ********************
    // STEP 3. find the image that matches both (color and object)
    // ********************
    // For example if colorImageNumbers contains [0, 1,  2,  3]
    //           And objectImageNumbers contains [2, 6, 10, 14]
    // Both of these lists contarin the number 2
    // But these lists could be any of the lists below. So how can we find the
    // number that happens to be in both of them.

    var ix = 0;
    while (ix < colorImageNumbers.length) {
      // For each of those values, check each value in objectImageNumbers
      // and see if they are equal (==)
      var ix2 = 0;
      while (ix2 < objectImageNumbers.length) {
        if (colorImageNumbers[ix] == objectImageNumbers[ix2]) {
          // Now we can see the value contained in both colorImageNumbers and objectImageNumbers
          console.log(
            "is " +
              colorImageNumbers[ix] +
              " == " +
              objectImageNumbers[ix2] +
              " ?"
          );
          answerNumber = colorImageNumbers[ix];
        }
        ix2 = ix2 + 1;
      }

      ix = ix + 1;
    }
    // ********************
    // STEP 4. find eight other images
    // ********************

    // create a variable to store our list of wrong answers, initialize it to an empty array (note: an empty array looks like this: [] )

    puzzleImageNumbers = [];

    // Pick a random number from 0 to maximum
    // check if the number is equal to our "clue image number" (see "answerNumber" variable up top)
    //  if they are equal, skip it
    // other add it to an array (to do this, use the myArrayVariable.push(value) function)
    // repeat these steps while the length of our array is less than 8

    while (puzzleImageNumbers.length < 8) {
      var ix3 = Math.floor(p.random(0, allImageNames.length));
      if (ix3 == answerNumber) {
        //skip
      } else {
        puzzleImageNumbers.push(ix3);
      }
    }

    // ********************
    // STEP 5. add the right answer and shuffle the images
    // ********************

    puzzleImageNumbers.push(answerNumber);

    // ********************
    // STEP 6. shuffle and render!!!
    // ********************

    // TODO

    // ********************
    // STEP 7. Call loadImage for the image path: "assets/image-file-name.png" of each image number in puzzleImageNumbers, and store it in puzzleImages
    // ********************

    puzzleImages = [];

    for (let ix4 = 0; ix4 < 9; ix4++) {
      console.log('option: ' + puzzleImageNumbers[ix4]);
      puzzleImages.push(
        p.loadImage("/assets/" + allImageNames[puzzleImageNumbers[ix4]])
      );
    }
  }
}

let imagesByColor = {
  //Jasyah is...
  ʻulaʻula: [35, 36, 37, 38, 39, 40, 41],
  ʻālani: [21, 22, 23, 24, 25, 26, 27],
  //...to here^^^
  //Ili is doing Yellow and Green
  melemele: [49, 50, 51, 52, 53, 54, 55],
  ʻōmaʻoʻmaʻo: [14, 15, 16, 17, 18, 19, 20],
  uliuli: [7, 8, 9, 10, 11, 12, 13], //Jasyah did this
  poni: [28, 29, 30, 31, 32, 33, 34], //and this
  ʻeleʻele: [0, 1, 2, 3, 4, 5, 6],
  // Paul is doing white
  keʻokeʻo: [42, 43, 44, 45, 46, 47, 48]
  //oi oi OI, who changed my white hair image!?! it was Shiro before, the iconic form of cute!!!
  // Sorry Jasyah, some of the images didn't download properly from the slides so I had to find new ones. -Paul
};

// We need to fill these numbers in too. Each word is an object, so we need the numbers for the pictures that contain those objects. I did leki which is tape:
let imagesByObject = {
  lauoho: [3, 10, 17, 24, 31, 38, 45, 52],
  leki: [4, 11, 18, 25, 32, 39, 46, 53],
  // Pili
  "mea pāʻani": [5, 12, 19, 26, 33, 40, 47, 54],
  "hua ʻai": [6, 13, 20, 27, 34, 41, 48, 55],
  // Ili
  lauʻai: [6, 13, 20, 27, 34, 41, 48, 55],
  pua: [1, 8, 15, 22, 29, 36, 43, 50],
  iʻa: [0, 7, 14, 21, 28, 35, 42, 49]
};

let allImageNames = [
  //0-6, Jasyah made the colors easier to track!!!
  "black-fish.jpg",
  "black-flower.jpg",
  "black-fruit-blackberry.png",
  "black-hair.png",
  "black-tape.jpg",
  "black-toy-trampoline.png",
  "black-vegetable-corn.png",
  //7-13
  "blue-fish.jpg",
  "blue-flower.jpg",
  "blue-fruit-blueberry.png",
  "blue-hair.png",
  "blue-tape.png",
  "blue-toy-train.png",
  "blue-vegetable-pumpkin.jpg",
  //14-20
  "green-fish.jpg",
  "green-flower.jpg",
  "green-fruit-kiwi.png",
  "green-hair.png",
  "green-tape.png",
  "green-toy-table_tennis.png",
  "green-vegetable-squash.png",
  //21-27
  "orange-fish.jpg",
  "orange-flower.jpg",
  "orange-fruit-orange.png",
  "orange-hair.png",
  "orange-tape.png",
  "orange-toy-basketball.png",
  "orange-vegetable-carrot.png",
  //28-34
  "purple-fish.jpg",
  "purple-flower.png",
  "purple-fruit-grape.png",
  "purple-hair.png",
  "purple-tape.png",
  "purple-toy-roller_skate.png",
  "purple-vegetable-eggplant.png",
  //35-41
  "red-fish.png",
  "red-flower.jpg",
  "red-fruit-apple.png",
  "red-hair.png",
  "red-tape.png",
  "red-toy-waggon.png",
  "red-vegetable-tomato.png",
  //42-48
  "white-fish.jpg",
  "white-flower.jpg",
  "white-fruit-lychee.jpg",
  "white-hair.jpg",
  "white-tape.png",
  "white-toy-airplane.png",
  "white-vegetable-cauliflower.png",
  //49-55
  "yellow-fish.jpg",
  "yellow-flower-nanea.jpg",
  "yellow-fruit-banana.png",
  "yellow-hair.png",
  "yellow-tape.jpg",
  "yellow-toy-truck.png",
  "yellow-vegetable-pepper.png"
];

let allColorsHI = [
  "ʻulaʻula",
  "ʻālani",
  "melemele",
  "ʻōmaʻoʻmaʻo",
  "uliuli",
  "poni",
  "ʻeleʻele",
  "keʻokeʻo"
];

let allColorsEN = ["", "", "", "", "", "", "", ""];

let allObjectsHI = [
  "lauoho",
  "leki",
  "mea pāʻani",
  "hua ʻai",
  "lauʻai",
  "iʻa",
  "pua"
];

let allObjectsEN = ["", "", "", "", "", "", ""];

import makeImageListSketch from "./learn-hawaiian-image-list.js";

export var sketches = {
  "Aʻo Heluhelu": learnToRead,
  "Image List": makeImageListSketch(allImageNames, allColorsEN, allObjectsEN)
};
