
import { handleRearangeModels } from './fileUtils'; 
import { mockPodGoFile } from '../__mocks__/mockPodGo';
import { rearangedModelsMock } from '../__mocks__/rearangedModels';
import{vi, Mock} from 'vitest'
import toast from 'react-hot-toast';


vi.mock('react-hot-toast', () => {
  const toastMock = {
    success: vi.fn(),
    error: vi.fn(),
  };
  return {
    default:toastMock,
    toast:toastMock
  }
});

describe('handleRearangeModels', () => {
  let mockSetTransformedFile: Mock;

  beforeEach(() => {
    mockSetTransformedFile = vi.fn(); 
    vi.clearAllMocks();
  });
  /*<summary>
  block 0 is moved to dsp1 this test assets the correct position of the moved block
  and if there is no effect to other blocks
  */
  it('Block must be moved from dsp0 to dsp1', async () => {
    const inputState = JSON.parse(JSON.stringify(mockPodGoFile));
    
    //insertion of test blocks
    inputState.data.tone.dsp0.block0 = { 
      "@model": "HD2_VolPanVolStereo", 
      "@position": 0, 
      "@path": 0 
    };

    inputState.data.tone.dsp0.block1 = { 
      "@model": "HD2_CompressorLAStudioCompStereo", 
      "@position": 1, 
      "@path": 0 
    };
    
    await handleRearangeModels(inputState, rearangedModelsMock as any, mockSetTransformedFile);
    const newState = mockSetTransformedFile.mock.calls[0][0];

    //1. asserts if block is moved 
    // here it returns the model with the Stereo suffix as which woulnd really hapen but because of the mock data it does
    expect(newState.data.tone.dsp1.block0).toBeDefined();
    expect(newState.data.tone.dsp1.block0['@model']).toBe('HD2_VolPanVolStereo');
    expect(newState.data.tone.dsp1.block0['@position']).toBe(0);

    // 2. asserts previous block is not present anymore
    expect(newState.data.tone.dsp0.block0).toBeUndefined(); 

    // 3. asserts other blocks have not been moved
    expect(newState.data.tone.dsp0.block1).toBeDefined();
    expect(newState.data.tone.dsp0.block1['@model']).toBe('HD2_CompressorLAStudioCompStereo');
  });
  /*<summary>h
  checks system blocks (inputA && outputA) to remain after method call
  */
  it('System blocks must remain the same', async () => {
    const inputState = JSON.parse(JSON.stringify(mockPodGoFile));
    //example system blocks taken from preset
    inputState.data.tone.dsp0.inputA = {
        "@input": 1,
          "@model": "HD2_AppDSPFlow1Input",
          "decay": 0.1,
          "noiseGate": true,"threshold": -60
    }
      inputState.data.tone.dsp0.outputA = {
         "@model": "HD2_AppDSPFlowOutput",
          "@output": 2,
          "gain": 0,
          "pan": 0.5
      }

    //------------------------------------------------------------  
    // calling and empty array
    const rearangedModelsMock: any[] = [];

    await handleRearangeModels(inputState, rearangedModelsMock, mockSetTransformedFile);
    const newState = mockSetTransformedFile.mock.calls[0][0];


    expect(newState.data.tone.dsp0.inputA).toBeDefined();
    expect(newState.data.tone.dsp0.outputA).toBeDefined();
  });
});