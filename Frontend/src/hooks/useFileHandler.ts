import { useState } from 'react';
import { handleSelectFile, handleConvert } from '../utils/fileUtils'; 

export const useFileHandler = () => {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);


  const onSelectFile = () => {
    handleSelectFile(setFilePath, setFileContent);
  };


  const onConvert = (convertToHlxLogic: (data: any) => any) => {
    handleConvert(filePath, fileContent, convertToHlxLogic);
  };

  return {
    filePath,
    fileContent,
    onSelectFile,
    onConvert,
  };
};
