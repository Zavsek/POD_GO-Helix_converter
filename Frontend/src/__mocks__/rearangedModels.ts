import { mockPodGoFile } from "./mockPodGo";

const inputState = JSON.parse(JSON.stringify(mockPodGoFile));
export  const rearangedModelsMock = [
        { 
            id: 'dsp0-block0',
            block: inputState.data.tone.dsp0.block0,
            dsp: 'dsp1',       
            index: 0           
        },
        {
            id: 'dsp0-block1',
            block: inputState.data.tone.dsp0.block1,
            dsp: 'dsp0',
            index: 0
        }
    ];


