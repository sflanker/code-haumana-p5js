export function setUniforms(p, shader, camera) {
  // Set unforms
  shader.setUniform("cameraPosition", [camera.eyeX, camera.eyeY, camera.eyeZ]);
}

export function drawGeometry(p) {
  p.sphere(100);
}