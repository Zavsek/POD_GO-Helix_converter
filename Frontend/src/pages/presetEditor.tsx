import React from 'react'
import { useFileHandler } from '../hooks/dist/useFileHandler';
const PresetEditor = ()=> {
    const {transformedFile,onShowModelBuilder,  } = useFileHandler();
  return (
    <div>
      <button onClick={onShowModelBuilder}>back </button>
      </div>
  );
}

export default PresetEditor