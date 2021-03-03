#ifdef GL_ES
precision mediump float;
#endif

// BEGIN lighting.glsl
uniform mat4 uViewMatrix;

uniform bool uUseLighting;

uniform int uAmbientLightCount;
uniform vec3 uAmbientColor[5];

uniform int uDirectionalLightCount;
uniform vec3 uLightingDirection[5];
uniform vec3 uDirectionalDiffuseColors[5];
uniform vec3 uDirectionalSpecularColors[5];

uniform int uPointLightCount;
uniform vec3 uPointLightLocation[5];
uniform vec3 uPointLightDiffuseColors[5];	
uniform vec3 uPointLightSpecularColors[5];

uniform int uSpotLightCount;
uniform float uSpotLightAngle[5];
uniform float uSpotLightConc[5];
uniform vec3 uSpotLightDiffuseColors[5];
uniform vec3 uSpotLightSpecularColors[5];
uniform vec3 uSpotLightLocation[5];
uniform vec3 uSpotLightDirection[5];

uniform bool uSpecular;
uniform float uShininess;

uniform float uConstantAttenuation;
uniform float uLinearAttenuation;
uniform float uQuadraticAttenuation;

const float specularFactor = 2.0;
const float diffuseFactor = 0.73;

struct LightResult {
  float specular;
  float diffuse;
};

float _phongSpecular(
  vec3 lightDirection,
  vec3 viewDirection,
  vec3 surfaceNormal,
  float shininess) {

  vec3 R = reflect(lightDirection, surfaceNormal);
  return pow(max(0.0, dot(R, viewDirection)), shininess);
}

float _lambertDiffuse(vec3 lightDirection, vec3 surfaceNormal) {
  return max(0.0, dot(-lightDirection, surfaceNormal));
}

LightResult _light(vec3 viewDirection, vec3 normal, vec3 lightVector) {

  vec3 lightDir = normalize(lightVector);

  //compute our diffuse & specular terms
  LightResult lr;
  if (uSpecular)
    lr.specular = _phongSpecular(lightDir, viewDirection, normal, uShininess);
  lr.diffuse = _lambertDiffuse(lightDir, normal);
  return lr;
}

void totalLight(
  vec3 modelPosition,
  vec3 normal,
  out vec3 totalDiffuse,
  out vec3 totalSpecular
) {

  totalSpecular = vec3(0.0);

  if (!uUseLighting) {
    totalDiffuse = vec3(1.0);
    return;
  }

  totalDiffuse = vec3(0.0);

  vec3 viewDirection = normalize(-modelPosition);

  for (int j = 0; j < 5; j++) {
    if (j < uDirectionalLightCount) {
      vec3 lightVector = (uViewMatrix * vec4(uLightingDirection[j], 0.0)).xyz;
      vec3 lightColor = uDirectionalDiffuseColors[j];
      vec3 specularColor = uDirectionalSpecularColors[j];
      LightResult result = _light(viewDirection, normal, lightVector);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * lightColor * specularColor;
    }

    if (j < uPointLightCount) {
      vec3 lightPosition = (uViewMatrix * vec4(uPointLightLocation[j], 1.0)).xyz;
      vec3 lightVector = modelPosition - lightPosition;
    
      //calculate attenuation
      float lightDistance = length(lightVector);
      float lightFalloff = 1.0 / (uConstantAttenuation + lightDistance * uLinearAttenuation + (lightDistance * lightDistance) * uQuadraticAttenuation);
      vec3 lightColor = lightFalloff * uPointLightDiffuseColors[j];
      vec3 specularColor = lightFalloff * uPointLightSpecularColors[j];

      LightResult result = _light(viewDirection, normal, lightVector);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * lightColor * specularColor;
    }

    if(j < uSpotLightCount) {
      vec3 lightPosition = (uViewMatrix * vec4(uSpotLightLocation[j], 1.0)).xyz;
      vec3 lightVector = modelPosition - lightPosition;
    
      float lightDistance = length(lightVector);
      float lightFalloff = 1.0 / (uConstantAttenuation + lightDistance * uLinearAttenuation + (lightDistance * lightDistance) * uQuadraticAttenuation);

      vec3 lightDirection = (uViewMatrix * vec4(uSpotLightDirection[j], 0.0)).xyz;
      float spotDot = dot(normalize(lightVector), normalize(lightDirection));
      float spotFalloff;
      if(spotDot < uSpotLightAngle[j]) {
        spotFalloff = 0.0;
      }
      else {
        spotFalloff = pow(spotDot, uSpotLightConc[j]);
      }
      lightFalloff *= spotFalloff;

      vec3 lightColor = uSpotLightDiffuseColors[j];
      vec3 specularColor = uSpotLightSpecularColors[j];
     
      LightResult result = _light(viewDirection, normal, lightVector);
      
      totalDiffuse += result.diffuse * lightColor * lightFalloff;
      totalSpecular += result.specular * lightColor * specularColor * lightFalloff;
    }
  }

  totalDiffuse *= diffuseFactor;
  totalSpecular *= specularFactor;
}
// END OF lighting.glsl

  
// Position in world space
varying vec3 vPosition;
// Position in texture space
varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vViewPosition;

// Position of the camera
uniform vec3 cameraPosition;

void main() {
  vec3 diffuse;
  vec3 specular;

  // Make the normal always mono dimensional depending on where on a tiny 3d cube it would appear
  // Calculate the direction of our ray from the camera to our current position in worlds space
  vec3 ray = normalize(vViewPosition - cameraPosition);
  vec3 quad = sign(vViewPosition);
  vec3 bmin = quad * floor(abs(vViewPosition) / 20.) * 20.;
  vec3 bmax = bmin + quad * 20.;
  
  if (bmax.x < bmin.x) {
    // swap
    float tmp = bmax.x;
    bmax.x = bmin.x;
    bmin.x = tmp;
  }
  if (bmax.y < bmin.y) {
    // swap
    float tmp = bmax.y;
    bmax.y = bmin.y;
    bmin.y = tmp;
  }
  if (bmax.z < bmin.z) {
    // swap
    float tmp = bmax.z;
    bmax.z = bmin.z;
    bmin.z = tmp;
  }
  
  
  // Of these values whichever is the smallest and on the surface of the cube, indicates the face
  // that the ray intersects first.
  // Note: If any component of ray is 0 that might be a problem
  float dminx = (bmin.x - cameraPosition.x) / ray.x; // -x
  float dmaxx = (bmax.x - cameraPosition.x) / ray.x; // +x
  float dminy = (bmin.y - cameraPosition.y) / ray.y; // -y
  float dmaxy = (bmax.y - cameraPosition.y) / ray.y; // +y
  float dminz = (bmin.z - cameraPosition.z) / ray.z; // -z
  float dmaxz = (bmax.z - cameraPosition.z) / ray.z; // +z
  
  float min = 99999999999.;
  vec3 norm = vec3(0., 0., 0.);
  vec3 hit;
  
  if (dminx > 0. && dminx < min) {
    hit = cameraPosition + ray * dminx;
    if (hit.y >= bmin.y && hit.y <= bmax.y && hit.z >= bmin.z && hit.z <= bmax.z) {
      min = dminx;
      norm = vec3(-1., 0., 0.);
    }
  }
  if (dmaxx > 0. && dmaxx < min) {
    hit = cameraPosition + ray * dmaxx;
    if (hit.y >= bmin.y && hit.y <= bmax.y && hit.z >= bmin.z && hit.z <= bmax.z) {
      min = dmaxx;
      norm = vec3(1., 0., 0.);
    }
  }
  if (dminy > 0. && dminy < min) {
    hit = cameraPosition + ray * dminy;
    if (hit.x >= bmin.x && hit.x <= bmax.x && hit.z >= bmin.z && hit.z <= bmax.z) {
      min = dminy;
      norm = vec3(0., -1., 0.);
    }
  }
  if (dmaxy > 0. && dmaxy < min) {
    hit = cameraPosition + ray * dmaxy;
    if (hit.x >= bmin.x && hit.x <= bmax.x && hit.z >= bmin.z && hit.z <= bmax.z) {
      min = dmaxy;
      norm = vec3(0., 1., 0.);
    }
  }
  if (dminz > 0. && dminz < min) {
    hit = cameraPosition + ray * dminz;
    if (hit.x >= bmin.x && hit.x <= bmax.x && hit.y >= bmin.y && hit.y <= bmax.y) {
      min = dminz;
      norm = vec3(0., 0., -1.);
    }
  }
  if (dmaxz > 0. && dmaxz < min) {
    hit = cameraPosition + ray * dmaxz;
    if (hit.x >= bmin.x && hit.x <= bmax.x && hit.y >= bmin.y && hit.y <= bmax.y) {
      min = dmaxz;
      norm = vec3(0., 0., 1.);
    }
  }
  
  // norm = vec3(norm.x * quad.x, norm.y * quad.y, norm.z * quad.z);
  
  if (length(norm) == 0.) {
    gl_FragColor = vec4(0., 0., 0., 0.);
  } else {
    totalLight(vViewPosition, normalize(norm), diffuse, specular);

    // Vertical stripes
    float val = floor((vViewPosition.y + 50.) / 10.) / 10.;
    gl_FragColor = vec4(val, 1. - val, 0., 1.); // R,G,B,A
    gl_FragColor.rgb = gl_FragColor.rgb * diffuse + specular;
  }
}