function loadFileToConsole() {
  const input = Object.assign(document.createElement('input'), { type: 'file' });
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      window.fileContents = reader.result;
      console.log('File loaded! Access with `fileContents`');
    };
    reader.readAsText(file);
  };
  input.click();
}

export default loadFileToConsole;