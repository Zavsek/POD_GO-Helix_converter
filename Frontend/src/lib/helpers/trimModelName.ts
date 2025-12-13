export default function trimModelName(modelName: string, skipTrimForModel: boolean) {
  if (!modelName) return modelName;
  if(skipTrimForModel) return modelName;
  return modelName.replace(/\s*(Mono|Stereo)$/i, "");
}