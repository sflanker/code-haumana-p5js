Welcome to Code Haumana
=======================

In this project each of you will have your own project file (i.e. `/haumana/your-name.js`) where you can create a p5.js sketch.

To run your sketch click "🕶 Show" in the header, select the "Next to the Code" option, and then click the link to your page. Updates to your code will automatically be loaded into your page*. To avoid having to constantly navigate back to your page disable the "Refresh App on Changes" option on the editor settings menu (click the project title in the top left hand corner of the page). Alternately, you can click the "Change URL" button at the top of the display and enter the path to your page (i.e. `/haumana/your-name.html`).

Please only edit _your own_ project files! Be respectful of your fellow students.

P5.js
-----

P5.js is a Javascript library for drawing graphics in a web browser. It includes numerous functions for drawing 2d and 3d graphics, creating interactive controls, and getting user input. You can also use any standard browser Javascript capabilities alongside p5.js. For examples of the kinds of things you can do with p5.js take a look at the [OpenProcessing.org Gallery](https://openprocessing.org/browse/#).

For help using the functions in the p5.js library see the [p5.js Reference](https://p5js.org/reference/).

This Project
------------

### ← README.md

That's this file, where you can learn about this project.

### ← haumana/

This folder contains all of the students' individual files.

### ← root/index.html

This page contains links to each student's sketch.

### ← root/examples.html + root/examples.js

A set of examples that demonstrate different computer programming concepts.

### ← style.css

This css file contains global styles for this project.

### ← templates/_template.html

This is the template HTML file for each student's page. It should be duplicated for each student and updated with their name and the name of their javascript file.

### ← templates/_template.js

This is the template JS file for each student's sketch. It should be duplicated for each student.

### ← lib/

This folder contains some shared javascript files used for displaying sketches on the student pages.

### ← assets

Static files like images or music. Feel free to add files here to use them in your sketch. Just make sure they are 100% appropriate for school.

Auto-Refresh
------------

Glitch has built in "Refresh App on Changes" functionality. However, there are some drawbacks of glitch's implementation:

 * By default it sends you back to the default page
 * You have to use the Change URL button each session to set your page
 * By default it also restarts the backend, which is slow

This project uses a `watch.json` file to disable backend restarts when static content changes. Additionally instead of relying on Glitch's built in "Refresh App on Changes" functionality, each HTML page uses a custom [Server-Sent Event](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) source that monitors the corresponding javascript file for changes.

___

Made with [Glitch](https://glitch.com/)
-------------------

`ヾ(⌐■_■)ノ♪`

