export function shaderStudio(p) {
  let shaderNames = [
    'gradient',
    'ripple'
  ];
  
  let loadedShaders = { };
  
  let shaderSelect;
  let activeShader;
  
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    
    shaderSelect = p.createSelect();
    
    shaderSelect.position(10, 20);
    for (var s of shaderNames) {
      shaderSelect.option(s);
      
      watchForChanges(s);
    }
    
    shaderSelect.changed(() => {
      loadShader(shaderSelect.value());
    });
    
    loadShader(shaderNames[0]);
  };
  
  p.draw = function() {
    p.background('white');
    p.noStroke();
    
    try {
      if (activeShader) {
        p.shader(activeShader);
      }

      p.rect(-(p.width / 2), -(p.height / 2), p.width, p.height);
    } catch (err) {
      console.error(err);
      activeShader = null;
      p.resetShader();
    }
     
  };
  
  function loadShader(name) {
    if (loadedShaders[name]) {
       activeShader = loadedShaders[name];
    } else {
      console.log(`Loading Shader "${name}"`);
      p.loadShader(
        `kumu-paul/shaders/${name}.vert`,
        `kumu-paul/shaders/${name}.frag`,
        shdr => {
          console.log(`Shader "${name}" Loaded.`);
          loadedShaders[name] = shdr;
          if (name === shaderSelect.value()) {
            activeShader = shdr;
          }
        },
        err => {
          console.error(`Error loading shader: ${name}:`);
          console.error(err);
        }
      );
    }
  }
  
  function watchForChanges(name) {
    let paths = [
      `/haumana/kumu-paul/shaders/${name}.vert`,
      `/haumana/kumu-paul/shaders/${name}.frag`
    ];
    for (const path of paths) {
      const watcher = new EventSource(
        `/watch?path=${path}`
      );
      watcher.addEventListener("message", ({ data }) => {
        console.log(`Reloading modified shader: (${name}) ${data}`);
        delete loadedShaders[name];
        loadShader(name);
      });
    }
  }
}