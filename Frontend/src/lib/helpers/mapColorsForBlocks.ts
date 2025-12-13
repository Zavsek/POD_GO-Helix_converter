export default function mapColorsForBlocks (model: string) : string{
    if(model.includes("Amp") ||model.includes("Cab")) return "#E6093D"; //red
    if(model.includes("Mod")) return "#4F46E5"; //blue
    if(model.includes("Delay")) return "#07E315"; //yellow
    if(model.includes("EQ") || model.includes("Comp")) return "#A5B703"//yellow-green
    if(model.includes("Reverb")|| model.includes("verb")) return "#E15605"; //orange
    if(model.includes("Wah") || model.includes("Filter") || model.includes("Pitch")) return "#8E2DE2"; //purple
    if(model.includes("VolPan")) return "#2D4FE3"; //light-blue
    if(model.includes("ImpulseResponse")) return  "#D8496B"; //magenta
    return "#6B7280"; //gray for others
}