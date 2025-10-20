export default function trimModelName(modelName) {
  if (!modelName) return modelName;
  return modelName.replace(/\s*(Mono|Stereo)$/i, "");
}