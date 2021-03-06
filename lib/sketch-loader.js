export default function startSketchLoader(
  sketchFile,
  sketchSelector,
  additionalFiles
) {
  let sketchSelectionHandler = undefined;
  let count = 0;
  let refreshEnabled = true;
  let refreshCallbacks = [];
  let sketchChangedCallbacks = [];

  function loadSketches() {
    import(`${sketchFile}?reload=${count++}`)
      .then(async ({ sketches }) => {
        sketchSelector.innerHTML = "";
        if (sketchSelectionHandler) {
          sketchSelector.removeEventListener("change", sketchSelectionHandler);
        }

        let awaitedSketches = {};
        let sketchList = Object.keys(sketches);
        for (let key of sketchList) {
          let option = document.createElement("option");
          option.value = key;
          option.innerText = key;
          sketchSelector.append(option);

          if (sketches[key].then) {
            // This sketch is a promise
            awaitedSketches[key] = await sketches[key];
          } else {
            awaitedSketches[key] = sketches[key];
          }
        }
        sketches = awaitedSketches;

        let query = parseQuery();
        if (query["sketch"]) {
          let ix = Number(query["sketch"]) - 1;
          if (ix > 0 && ix < sketchList.length) {
            sketchSelector.value = sketchList[ix];
          }
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

            for (var cb of sketchChangedCallbacks) {
              cb(sketchSelector.value);
            }
          })
        );
      })
      .catch(err => {
        console.error("Failed to load sketch!");
        console.error(err);
      });
  }

  function parseQuery() {
    let query = {};
    // Parse query string
    if (window.location.search) {
      try {
        query = Object.fromEntries(
          window.location.search
            .substr(1)
            .split("&")
            .map(v => v.split("="))
        );
      } catch {}
    }

    return query;
  }

  function initialize() {
    loadSketches();

    let query = parseQuery();

    let autoload = true;

    if (query["autoload"] !== undefined) {
      autoload =
        "true".startsWith(query["autoload"].toLowerCase()) ||
        "yes".startsWith(query["autoload"].toLowerCase()) ||
        !!parseInt(query["autoload"]);
    }

    if (autoload) {
      // Special case for files in the root.
      let watchPath =
        sketchFile.lastIndexOf("/") === 0 ? "/root" + sketchFile : sketchFile;
      const sourceWatcher = new EventSource(`/watch?path=${watchPath}`);

      sourceWatcher.addEventListener("message", ({ data }) => {
        if (refreshEnabled) {
          console.log(`Reloading sketch: ${data}`);
          loadSketches();
          for (var cb of refreshCallbacks) {
            cb();
          }
        }
      });

      if (additionalFiles) {
        for (let additionalFile of additionalFiles) {
          // Special case for files in the root.
          let additionalPath =
            additionalFile.lastIndexOf("/") === 0
              ? "/root" + additionalFile
              : additionalFile;
          const additionalWatcher = new EventSource(
            `/watch?path=${additionalPath}`
          );
          additionalWatcher.addEventListener("message", ({ data }) => {
            console.log(
              `Reloading sketch dependency: (${additionalFile}) ${data}`
            );
            loadSketches();
          });
        }
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

  return {
    on: function(event, callback) {
      switch (callback && event) {
        case "refresh":
          refreshCallbacks.push(callback);
          break;
        case "sketchChanged":
          sketchChangedCallbacks.push(callback);
          break;
      }
    },

    toggleRefresh: function(enable) {
      refreshEnabled = !!enable;
    }
  };
}

/* globals p5 */
