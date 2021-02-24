function learnToRead(p) {
  let puzzleImages;
  let answerPosition;
  let instruction;
  
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);

    p.background(50);
    
    resetPuzzle();
  };

  p.draw = function() {
    p.background("white");
    
    // End of Draw function
  };
  
  function resetPuzzle() {
    // pick a random color and a random object
    
    // find the image that matches both
    
    // find eight other images
    
    // shuffle the images
    
    // remember the position of the answer
  }
}

let imagesByColor = {
  //Jasyah is doing from here...
  "ʻulaʻula": [],
  "ʻālani": [],
  //...to here^^^
  //Ili is doing Yellow and Green 
  "melemele": [50, 51, 52, 53, 54, 55 ],
  "ʻōmaʻoʻmaʻo": [14 , 15, 16, 17, 18, 19, 20 ],
  "uliuli": [],
  "poni": [],
  "ʻeleʻele": [0, 1, 2, 3, 4, 5, 6],
  // Paul is doing white
  "keʻokeʻo": [42, 43, 44, 45, 46, 47, 48],
};

// We need to fill these numbers in too. Each word is an object, so we need the numbers for the pictures that contain those objects. I did leki which is tape:
let imagesByObject = {
  "lauoho": [],
  "leki": [4, 11, 18, 25, 32, 39, 46, 53],
  "mea pāʻani": [],
  "hua ʻai": [],
  "lauʻai": [],
  "pua": [],
  "iʻa": [],
};

let allImageNames = [
  "black-fish.jpg",
  "black-flower.jpg",
  "black-fruit-blackberry.png",
  "black-hair.png",
  "black-tape.jpg",
  "black-toy-trampoline.png",
  "black-vegetable-corn.png",
  "blue-fish.jpg",
  "blue-flower.jpg",
  "blue-fruit-blueberry.png",
  "blue-hair.png",
  "blue-tape.png",
  "blue-toy-train.png",
  "blue-vegetable-pumpkin.jpg",
  "green-fish.jpg",
  "green-flower.jpg",
  "green-fruit-kiwi.png",
  "green-hair.png",
  "green-tape.png",
  "green-toy-table_tennis.png",
  "green-vegetable-squash.png",
  "orange-fish.jpg",
  "orange-flower.jpg",
  "orange-fruit-orange.png",
  "orange-hair.png",
  "orange-tape.png",
  "orange-toy-basketball.png",
  "orange-vegetable-carrot.png",
  "purple-fish.jpg",
  "purple-flower.png",
  "purple-fruit-grape.png",
  "purple-hair.png",
  "purple-tape.png",
  "purple-toy-roller_skate.png",
  "purple-vegetable-eggplant.png",
  "red-fish.png",
  "red-flower.jpg",
  "red-fruit-apple.png",
  "red-hair.png",
  "red-tape.png",
  "red-toy-waggon.png",
  "red-vegetable-tomato.png",
  "white-fish.jpg",
  "white-flower.jpg",
  "white-fruit-lychee.jpg",
  "white-hair.jpg",
  "white-tape.png",
  "white-toy-airplane.png",
  "white-vegetable-cauliflower.png",
  "yellow-fish.jpg",
  "yellow-flower-nanea.jpg",
  "yellow-fruit-banana.png",
  "yellow-hair.png",
  "yellow-tape.jpg",
  "yellow-toy-truck.png",
  "yellow-vegetable-pepper.png",
];

let allColorsHI = [
  "ʻulaʻula",
  "ʻālani",
  "melemele",
  "ʻōmaʻoʻmaʻo",
  "uliuli",
  "poni",
  "ʻeleʻele",
  "keʻokeʻo",
];

let allColorsEN = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

let allObjectsHI = [
  "lauoho",
  "leki",
  "mea pāʻani",
  "hua ʻai",
  "lauʻai",
  "iʻa",
  "pua",
];

let allObjectsEN = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

import makeImageListSketch from './learn-hawaiian-image-list.js';

export var sketches = {
  "Aʻo Heluhelu": learnToRead,
  "Image List": makeImageListSketch(allImageNames, allColorsEN, allObjectsEN)
};

