export default (metaData) => {
  return `export class ${metaData.componentName} extends ${
    metaData.filled ? 'IconFilled' : 'Icon'
  } {}\n`;
};
