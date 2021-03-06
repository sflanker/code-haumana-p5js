#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795

// =====================================
// Built in p5js uniforms and attributes
// =====================================

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;    // Vertex position
attribute vec2 aTexCoord;    // Vertex texture coordinate
attribute vec3 aNormal;      // Vertex normal
attribute vec4 aVertexColor; // Vertex color

// =====================================

varying vec3 vPosition;
varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec4 vVertexColor;
varying vec3 vViewPosition;

uniform float time;

void main() {
  // Ripple the z component of all vertex coordinates
  vec3 pos = vec3(aPosition.x, aPosition.y, aPosition.z + sin((aPosition.x - time / 3000. + aPosition.y / 4.) * PI * 6.) * 8.);
  
  // Store the vertex position for use in the fragment shader
  vPosition = pos;
  vTexCoord = aTexCoord;
  vNormal = aNormal;
  vVertexColor = aVertexColor;

  vec4 viewPosition = uModelViewMatrix * vec4(pos, 1.0);
  vViewPosition = viewPosition.xyz;
  
  // Set the vertex position without any change besides the view transformations
  gl_Position = uProjectionMatrix * viewPosition;
}