
import { convertToHlxLogic } from './converter';
import { mockPodGoFile } from '../__mocks__/mockPodGo';
import {vi} from 'vitest'

//mock helpers
vi.mock('./helpers/isReverb', () => ({
  __esModule: true,
  default: (model: string) => model.includes('Reverb'),
}));
vi.mock('./helpers/isDelay', () => ({
  __esModule: true,
  default: (model: string) => [model.includes('Delay'), false],
}));
vi.mock('./helpers/trimModelName', () => ({
  __esModule: true,
  default: (name: string) => name.replace(/\s*(Mono|Stereo)$/i, ''),
}));
vi.mock('./helpers/setMonoStereo', () => ({
  __esModule: true,
  default: () => false,
}));
vi.mock('./helpers/appendEnd', () => {
  const addSystemBlocks = (dsp: any) => {
    dsp.inputA = { "@model": "HD2_AppDSPFlow1Input" };
    dsp.outputA = { "@model": "HD2_AppDSPFlowOutput" };
  };
  return {
    appendDsp0: addSystemBlocks,
    appendDsp1: addSystemBlocks,
  };
});
describe('convertToHlxLogic', () => {
    
    
    /*<summary>
    checks validity of metadata
    */
  it('must set metadata  to hlx predfined', () => {
    // deep copy of mock file
    const input = JSON.parse(JSON.stringify(mockPodGoFile));
    
    const result = convertToHlxLogic(input);

    expect(result.data.meta.application).toBe("Helix Native");
    expect(result.data.device).toBe(2162944);
    expect(result.data.device_version).toBe(56623104)
  });

/*<summary>
checks if Mono and Stereo suffixes are actually removed
*/
it('must remove Mono & Stereo suffix', () =>{
  const input = JSON.parse(JSON.stringify(mockPodGoFile));
   input.data.tone.dsp0.block0 = { 
      "@model": "HD2_VolPanVolStereo", 
      "@position": 0, 
      "@path": 0 
    };
    //also tests if it removes Mono from anywhere in the name
     input.data.tone.dsp0.block1 = { 
      "@model": "HD2_CompressorLAStudioCompMono", 
      "@position": 1, 
      "@path": 0 
    };
    const result = convertToHlxLogic(input);
    expect(result.data.tone.dsp0['block0']).toBeDefined();
    expect(result.data.tone.dsp0['block0']['@model']).toBe('HD2_VolPanVol');

    expect(result.data.tone.dsp0['block1']).toBeDefined();
    expect(result.data.tone.dsp0['block1']['@model']).toBe('HD2_CompressorLAStudioComp');

});

  /*<summary>
  pgp model names contain "_STATIC_" this should be
  removed in coversion */
  it('must remove substring "_STATIC_" from model name', () => {
    const input = JSON.parse(JSON.stringify(mockPodGoFile));


    input.data.tone.dsp0.block0 = { 
        "@model": "HD2_Distortion_Minotaur_STATIC_", 
        "@position": 0,
        "@path": 0 
    };

    const result = convertToHlxLogic(input);

    expect(result.data.tone.dsp0['block0']).toBeDefined();
    expect(result.data.tone.dsp0['block0']['@model']).toBe("HD2_Distortion_Minotaur");
  });

  /*<summary>
  FXLoop is not a block in helix it should always be removed during conversion,
   */
  it('FXLoop must be removed during conversion', () => {
    const input = JSON.parse(JSON.stringify(mockPodGoFile));
    

    input.data.tone.dsp0.block0 = { "@model": "HD2_Distortion_Minotaur", "@position": 0 }; 
    input.data.tone.dsp0.block1 = { "@model": "HD2_FXLoopMono", "@position": 1 };     
    input.data.tone.dsp0.block2 = { "@model": "HD2_Delay_SimpleDelay", "@position": 2 }; 

    delete input.data.tone.dsp0.block3; 

    const result = convertToHlxLogic(input);


   expect(result.data.tone.dsp0['block0']['@model']).toBe("HD2_Distortion_Minotaur");
    expect(result.data.tone.dsp0['block0']['@position']).toBe(0); 

    expect(result.data.tone.dsp0['block1']).toBeUndefined();
    expect(result.data.tone.dsp0['block2']['@model']).toBe("HD2_Delay_SimpleDelay");
    expect(result.data.tone.dsp0['block2']['@position']).toBe(2); 
    

    expect(result.data.tone.dsp0['block2']).toBeDefined();
});

  /*<summary>
  Line6 is weird sometimes and for some reason CaliQ is called EQCaliQ in pod go
  this is not standard and just a random exception
  */

  //i dont understand why whis test doesn't work normally so this one should be rendered useless
  it('"HD2_EQCaliQ" must be renamed to "HD2_CaliQ" ', () => {
    const input = JSON.parse(JSON.stringify(mockPodGoFile));

    input.data.tone.dsp0.block0 = { 
        "@model": "HD2_EQ_STATIC_CaliQ",
        "@position": 0,
        "@stereo": true 
    };

    const result = convertToHlxLogic(input);

    expect(result.data.tone.dsp0['block0']).toBeDefined();
    expect(result.data.tone.dsp0['block0']['@model']).toBe("HD2_CaliQ");
    expect(result.data.tone.dsp0['block0']['@stereo']).toBe(true);
  });


  /*<summary>
  model without all valid fields should not pass this test
   */
  it('blocks with invalid @model should be removed', () => {
    const input = JSON.parse(JSON.stringify(mockPodGoFile));

    input.data.tone.dsp0.block0 = { "@model": "", "@position": 0 };

    input.data.tone.dsp0.block1 = { "@position": 1 } as any; 

    const result = convertToHlxLogic(input);


    expect(result.data.tone.dsp0['block0']).toBeUndefined();
    expect(result.data.tone.dsp0['block1']).toBeUndefined();
  });


  /*<summary>
  since one dsp can only contain max 8 block
  blocks indexed 0-7 should be in dsp0 
  and the rest should be transfered to dsp 1
  */
 it('resolving blocks between dsp0 and dsp1', () => {
     const input = JSON.parse(JSON.stringify(mockPodGoFile));
     
    // adding 10 blocks to dsp0
    for(let i = 0; i < 10; i++) {
        input.data.tone.dsp0[`block${i}`] = { 
            "@model": "TestModel", 
            "@position": i 
        };
    }
    const result = convertToHlxLogic(input);
    expect(result.data.tone.dsp0).toBeDefined();

    expect(result.data.tone.dsp1).toBeDefined();
   
    expect(result.data.tone.dsp0['block0']).toBeDefined();
    expect(result.data.tone.dsp0['block7']).toBeDefined();
    expect(result.data.tone.dsp0['block8']).toBeUndefined(); 

   
    expect(result.data.tone.dsp1!['block0']).toBeDefined(); 
    expect(result.data.tone.dsp1!['block1']).toBeDefined(); 
  });
  
  /*<summary>
  checks presence of system blocks in dsp0 and dsp 1
  */
 it('system blocks must be present in both dsps', () =>{
   const input = JSON.parse(JSON.stringify(mockPodGoFile));
   
   // Add enough blocks to trigger dsp1 creation
   for(let i = 0; i < 9; i++) {
     input.data.tone.dsp0[`block${i}`] = { 
       "@model": "TestModel", 
       "@position": i 
     };
   }
   
   const result = convertToHlxLogic(input);
   
   expect(result.data.tone.dsp0['inputA']).toBeDefined();
   expect(result.data.tone.dsp0['outputA']).toBeDefined();
   
   expect(result.data.tone.dsp1).toBeDefined();
   expect(result.data.tone.dsp1!['inputA']).toBeDefined();
   expect(result.data.tone.dsp1!['outputA']).toBeDefined();
  })
});