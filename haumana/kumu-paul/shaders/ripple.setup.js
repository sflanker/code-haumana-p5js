export function setUniforms(p, shader) {
  // Set unforms
  shader.setUniform("time", p.millis());
}