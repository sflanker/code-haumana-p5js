export function shaderStudio(p) {
  let shaderNames = [
    'gradient',
    'ripple',
    'voxel',
  ];
  
  let loadedShaders = { };
  
  let shaderSelect;
  let activeShader;
  let activeShaderUniformBinder;
  let activeShaderGeometry;
  
  let camera;
  
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    camera = p.createCamera();
    
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
        if (activeShaderUniformBinder) {
          activeShaderUniformBinder(p, activeShader, camera);
        }
        if (activeShader.isLightShader()) {
          p.pointLight(255, 255, 255, p.mouseX - p.width / 2, p.mouseY - p.height / 2, 150);
        }
      }

      p.orbitControl(4, 2, 0.1);
      
      // p.rect(-(p.width / 2), -(p.height / 2), p.width, p.height);
      //p.fill('red');
      if (activeShaderGeometry) {
        activeShaderGeometry(p);
      } else {
        p.plane(200, 200, 10, 10);
      }
      //p.sphere(100);
      //p.box(100);
      //p.torus(100, 40);
    } catch (err) {
      console.error(err);
      activeShader = null;
      p.resetShader();
    }
  };
  
  function loadShader(name) {
    if (loadedShaders[name]) {
      var shaderDetail = loadedShaders[name];
      activeShader = shaderDetail.shader;
      activeShaderUniformBinder = shaderDetail.setUnforms;
      activeShaderGeometry = shaderDetail.drawGeometry;
    } else {
      console.log(`Loading Shader "${name}"`);
      p.loadShader(
        `kumu-paul/shaders/${name}.vert`,
        `kumu-paul/shaders/${name}.frag`,
        async shdr => {
          console.log(`Shader "${name}" Loaded.`);
          const { setUniforms, drawGeometry } =
                await import(`/haumana/kumu-paul/shaders/${name}.setup.js?nonce=${Math.random()}`).then(mdl => {
                  console.log(`loaded ${name}.setup.js`);
                  return mdl;
                }).catch(_ => {
                  console.log(`${name}.setup.js not found`);
                  return {};
                });
          loadedShaders[name] = { shader: shdr, setUnforms: setUniforms, drawGeometry: drawGeometry };
          if (name === shaderSelect.value()) {
            activeShader = shdr;
            activeShaderUniformBinder = setUniforms;
            activeShaderGeometry = drawGeometry;
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
      `/haumana/kumu-paul/shaders/${name}.frag`,
      `/haumana/kumu-paul/shaders/${name}.setup.js`,
    ];
    for (const path of paths) {
      try {
        const watcher = new EventSource(
          `/watch?path=${path}`
        );
        watcher.addEventListener("message", ({ data }) => {
          console.log(`Reloading modified shader: (${name}) ${data}`);
          delete loadedShaders[name];
          loadShader(name);
        });
      } catch {
        console.log(`Shader file ${path} not found`);
      }
    }
  }
}