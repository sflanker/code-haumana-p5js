export default function startSketchLoader(sketchFile, sketchSelector, additionalFiles) {
  let sketchSelectionHandler = undefined;
  let count = 0;

  function loadSketches() {
    import(`${sketchFile}?reload=${count++}`).then(({ sketches }) => {
      sketchSelector.innerHTML = "";
      if (sketchSelectionHandler) {
        sketchSelector.removeEventListener("change", sketchSelectionHandler);
      }

      let sketchList = Object.keys(sketches);
      for (let key of sketchList) {
        let option = document.createElement("option");
        option.value = key;
        option.innerText = key;
        sketchSelector.append(option);
      }

      if (window.location.search) {
        try {
          let query = Object.fromEntries(
            window.location.search
              .substr(1)
              .split("&")
              .map(v => v.split("="))
          );

          if (query["sketch"]) {
            let ix = Number(query["sketch"]) - 1;
            if (ix > 0 && ix < sketchList.length) {
              sketchSelector.value = sketchList[ix];
            }
          }
        } catch {}
      }

      if (window.currentSketch) {
        window.currentSketch.remove();
        window.currentSketch = undefined;
      }

      console.log(sketchSelector.value);
      window.currentSketch = new p5(sketches[sketchSelector.value]);

      sketchSelector.addEventListener(
        "change",
        (sketchSelectionHandler = () => {
          if (window.currentSketch && window.currentSketch.remove) {
            window.currentSketch.remove();
            window.currentSketch = undefined;
          }

          let ix = sketchList.indexOf(sketchSelector.value);
          var newurl =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            `?sketch=${ix + 1}`;
          window.history.pushState({ path: newurl }, "", newurl);

          if (window.currentSketch) {
            window.currentSketch.remove();
            window.currentSketch = undefined;
          }

          window.currentSketch = new p5(sketches[sketchSelector.value]);
        })
      );
    });
  }

  function initialize() {
    loadSketches();
    
    // Special case for files in the root.
    let watchPath =
        sketchFile.lastIndexOf('/') === 0 ?
          '/root' + sketchFile :
          sketchFile;
    const sourceWatcher = new EventSource(`/watch?path=${watchPath}`);

    sourceWatcher.addEventListener("message", ({ data }) => {
      console.log(`Reloading sketch: ${data}`);
      loadSketches();
    });
    
    if (additionalFiles) {
      for (let additionalFile of additionalFiles) {
        // Special case for files in the root.
        let additionalPath =
            additionalFile.lastIndexOf('/') === 0 ?
              '/root' + additionalFile :
              additionalFile;
        const additionalWatcher = new EventSource(`/watch?path=${additionalPath}`);
        additionalWatcher.addEventListener("message", ({ data }) => {
          console.log(`Reloading sketch: (${additionalFile}) ${data}`);
          loadSketches();
        });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("readyStateChange", e => {
      if (document.readyState !== "loading") {
        initialize();
      }
    });
  } else {
    initialize();
  }
}

/* globals p5 */
