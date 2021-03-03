#ifdef GL_ES
precision mediump float;
#endif
  
// Position in world space
varying vec3 vPosition;
// Position in texture space
varying vec2 vTexCoord;

void main() {
  // Color based on texture coordinate position
  vec2 st = vTexCoord.xy; 

  // Go from red to green on one diagonal and white to black on the other.
  gl_FragColor = vec4(st.y, st.x, (st.x + st.y) / 2., 1.); // R,G,B,A
}