export default function setMonoStereo(model : string) : boolean | null {
  if (model.toLowerCase().includes("stereo")) return true;
  if (model.toLowerCase().includes("mono")) return false;
  return null;
}
