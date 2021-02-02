function guiConsole(elementOrId) {
  let element;
  if (elementOrId instanceof HTMLElement) {
    element = elementOrId;
  } else {
    element = document.getElementById(elementOrId);
  }
  
  if (!element) {
    throw new Error('element not found.');
  }
  
  element.classList.add('gui-console');
  
  function logInGui(msgOrObj, level, nativeLog) {
    let output = document.createElement('div');
    output.className = `${level}-message`;
    
    if (typeof msgOrObj === 'string') {
      output.classList.add('string-value');
      output.innerText = msgOrObj;
    } else if (msgOrObj instanceof Error) {
      output.classList.add('error-value');
      output.innerText = `${msgOrObj.type}: ${msgOrObj.message}\n${msgOrObj.stack}`;
    } else if (msgOrObj) {
      output.classList.add(`${typeof msgOrObj}-value`)
      try {
        output.innerText = JSON.stringify(msgOrObj);
      } catch {
        output.innerText = msgOrObj.toString();
      }
    } else if (msgOrObj === null) {
      output.classList.add('null-value');
      output.innerText = 'null';
    } else {
      output.classList.add('undefined-value');
      output.innerText = 'undefined';
    }
    
    // Scroll the next line into view so long as we are near the bottom of the output.
    let shouldScroll = (element.scrollTop + 10 >= element.scrollHeight - element.clientHeight);
    
    element.appendChild(output);
    
    if (shouldScroll) {
      output.scrollIntoView();
    }
    
    
    nativeLog.call(console, msgOrObj);
  }
  
  let { log, warn, error } = console;
  console.log = (msgOrObj) => logInGui(msgOrObj, 'log', log);
  console.warn = (msgOrObj) => logInGui(msgOrObj, 'warn', warn);
  console.error = (msgOrObj) => logInGui(msgOrObj, 'error', error);
  
  window.addEventListener('error', (event) => {
    logInGui(event.error, 'error', () => {});
  });
}

export { guiConsole };