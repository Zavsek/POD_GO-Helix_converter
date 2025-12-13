export default function isDelay(model:string):[boolean, boolean]{
    //legacy delays convert differently
    const legacyDelays = [
        "PingPong", "Dynamic", "StereoDelay", "Dig","DigDelayWithMod", "Reverse",
        "LowRes", "TubeEcho", "TapeEcho", "SweepEcho", "EchoPlater", "AnalogDelayStereo",
        "AnalogDelayStereoMod", "AutoVol", "Multihead", "PhazeEko"
    ];
    const containsDelay = legacyDelays.some(name => model.includes(name));
    if(!containsDelay) return [false, false];
    //these  delays do not remove stereo from name
    const retainStereo = [
        "Dynamic" ,"StereoDelay", "TapeEcho", "TubeEcho", "SweepEcho", "EchoPlater", 
        "AnalogDelay", "AnalogDelayStereoMod", "AutoVol", "Multihead"
    ];
    const retainsStereo = retainStereo.some(name => model.includes(name));
    return[containsDelay, retainsStereo];
}