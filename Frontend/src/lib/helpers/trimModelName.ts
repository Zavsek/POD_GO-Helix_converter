export default function trimModelName(modelName: string) {
  if (!modelName) return modelName;
  return modelName.replace(/\s*(Mono|Stereo)$/i, "");
}