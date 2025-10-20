export default function isReverb(model) {
  const stereoReverbs = [
    "DynamicHall", "DynamicPlate", "DynamicRoom",
    "dynamicAmbiance", "Shimmer", "HotSprings",
    "Glitz", "Ganymede", "SearchLights",
    "Plateaux", "DoubleTank"
  ];
  return stereoReverbs.some(name => model.includes(name));
}