export default (componentName) => {
  return `export { default as ${componentName} } from "./${componentName}.svelte"\n`;
};
