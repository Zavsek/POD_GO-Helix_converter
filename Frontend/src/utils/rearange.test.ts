
import { handleRearangeModels } from './fileUtils'; 
import { mockPodGoFile } from '../__mocks__/mockPodGo';
import { rearangedModelsMock } from '../__mocks__/rearangedModels';
import{vi, Mock} from 'vitest'
vi.mock('react-hot-toast', () => ({
  success: vi.fn(),
  error: vi.fn(),
}));

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
    
    await handleRearangeModels(inputState, rearangedModelsMock as any, mockSetTransformedFile);


    const newState = mockSetTransformedFile.mock.calls[0][0];

    //1. asserts if block is moved 
    expect(newState.data.tone.dsp1.block0).toBeDefined();
    expect(newState.data.tone.dsp1.block0['@model']).toBe('HD2_VolPanVol');
    expect(newState.data.tone.dsp1.block0['@position']).toBe(0);

    // 2. asserts previous block is not present anymore
    expect(newState.data.tone.dsp0.block0).toBeUndefined(); 

    // 3. asserts other blocks have not been moved
    expect(newState.data.tone.dsp0.block1).toBeDefined();
    expect(newState.data.tone.dsp0.block1['@model']).toBe('Helix_Delay_SimpleDelay');
  });
  /*<summary>
  checks system blocks (inputA && outputA) to remain after method call
  */
  it('System blocks must remain the same', async () => {
    const inputState = JSON.parse(JSON.stringify(mockPodGoFile));
    
    // calling and empty array
    const rearangedModelsMock: any[] = [];

    await handleRearangeModels(inputState, rearangedModelsMock, mockSetTransformedFile);
    const newState = mockSetTransformedFile.mock.calls[0][0];


    expect(newState.data.tone.dsp0.inputA).toBeDefined();
    expect(newState.data.tone.dsp0.outputA).toBeDefined();
  });
});