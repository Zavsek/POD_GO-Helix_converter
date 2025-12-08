import { useState } from 'react';
import { handleSelectFile, handleConvert, handleSaveFile } from '../utils/fileUtils'; 
import { PodGo } from '../interfaces/PodGoData';
import { DspBlock } from '../interfaces/DspBlock';
import { mainWindowResize, modelWindowResize } from '../lib/tauriWindow';

export const useFileHandler = () => {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [transformedFile, setTransformedFile]= useState<PodGo | null>(null);
  const [models, setModels] = useState<{ block: DspBlock, dsp: 'dsp0' | 'dsp1' }[] | null>(null);
    const[showModelBuilder, setShowModelBuilder] = useState<boolean>( false)



  const onSelectFile = async () => {
    setTransformedFile(null);
    setModels(null);
    handleSelectFile(setFilePath, setFileContent);
  };

  const onShowModelBuilder = () =>{
    if(showModelBuilder){
      setShowModelBuilder(false);
      mainWindowResize();
    }
    else{
      setShowModelBuilder(true);
      modelWindowResize();
    }
  }

  const onConvert = (convertToHlxLogic: (data: any) => any) => {
    handleConvert(filePath, fileContent, convertToHlxLogic, setTransformedFile, setModels);
  };


  const onSave = () =>{
    handleSaveFile(transformedFile);
  }
  return {
    filePath,
    fileContent,
    transformedFile,
    models,
    showModelBuilder,
    onShowModelBuilder,
    onSelectFile,
    onConvert,
    onSave
  };
};


