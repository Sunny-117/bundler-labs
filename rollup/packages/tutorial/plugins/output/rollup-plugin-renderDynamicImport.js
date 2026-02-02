export default function dynamicImportPolyfillPlugin() {
  return {
    name: 'dynamic-import-polyfill',
    renderDynamicImport() {
      return {
        left: 'dynamicImportPolyfill(',
        right: ', import.meta.url)'
      };
    }
  };
}

// dynamicImportPolyfill('./msg-ca034dda.js', import.meta.url).then(res => console.log(res.default));
function dynamicImportPolyfill(filename, url) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.type = "module";
    script.onload = () => {
      resolve(window.mod);
    };
    const absURL = new URL(filename, url).href;
    console.log(absURL);
    const blob = new Blob([
      `import * as mod from "${absURL}";`,
      ` window.mod = mod;`], { type: "text/javascript" });
    script.src = URL.createObjectURL(blob);
    document.head.appendChild(script);
  });
}
