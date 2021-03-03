function learnToRead(p) {
  let puzzleImages;
  let answerPosition;
  let instruction;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);

    p.background(50);

    // resetPuzzle();
  };

  p.draw = function() {
    p.background("white");

    // For now we will reset the puzzle on every call to draw so that we can
    // more easily test things.
    resetPuzzle();

    p.noLoop();

    // End of Draw function
  };

  p.doubleClicked = function() {
    // Double click the screen to reset the puzzle.
    p.redraw();
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

    var randomcolor = Math.floor(p.random(0, 8));
    randomcolor = allColorsHI[randomcolor];
    // Kumu Paul said there were 8 objects,
    // but there were only seven 🤦‍♂️
    var randomobj = allObjectsHI[Math.floor(p.random(0, 7))];

    console.log("we chose color: " + randomcolor + " and object: " + randomobj);

    // DEBUG DISPLAY CODE
    p.background("white");
    p.fill("red");
    p.textAlign(p.LEFT, p.TOP);

    p.text(randomcolor, 10, 10);
    p.text(randomobj, 10, 30);
    // END DEBUG DISPLAY CODE

    // ********************
    // STEP 2. Get the list of images that match the color and the object
    // ********************
    let colorImageNumbers = imagesByColor[randomcolor];
    let objectImageNumbers = imagesByObject[randomobj];

    // DEBUG DISPLAY CODE
    p.text("[" + colorImageNumbers.join(", ") + "]", 10, 50);
    p.text("[" + objectImageNumbers.join(", ") + "]", 10, 70);

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
      console.log(colorImageNumbers[ix]);
      ix = ix + 1;
    }
    // ********************
    // STEP 4. find eight other images
    // ********************
    
    // ********************
    // STEP 5. shuffle the images
    // ********************

    // ********************
    // STEP 6. remember the position of the answer (we will need it later, outside of this function)
    // ********************
  }
}

let imagesByColor = {
  //Jasyah is doing from here...
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
