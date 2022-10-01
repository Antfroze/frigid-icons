const RE_ICON_METADATA = /(.+?)(-fill)?\.svg$/;
const RE_CASE_TRANSFORM = /-[a-z]/g;

const upper = (char) => char.substring(1).toUpperCase();
export default function getMetadata(file) {
  const metadata = file.match(RE_ICON_METADATA);

  if (metadata == null || metadata.length > 3) {
    return null;
  }

  const filled = !!metadata[2];
  return {
    componentName:
      metadata[1].substring(0, 1).toUpperCase() +
      metadata[1].substring(1).replace(RE_CASE_TRANSFORM, upper) +
      (filled ? 'Fill' : ''),
    filled
  };
}
