export default function trimModelName(modelName: string, skipTrimForModel: boolean) {
  if (!modelName) return modelName;
  if(skipTrimForModel) return modelName;
  //finds substring "Mono" or "Stereo" and removes them from the model name
  return modelName.replace(/\s*(Mono|Stereo)$/i, "");
}