import { useFileHandler } from "./hooks/useFileHandler";
import { convertToHlxLogic } from "./lib/converter.js";
import TitleBar from "./components/TitleBar.jsx";
import Footer from "./components/Footer.jsx";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import PresetEditor from "./pages/PresetEditor";
import Header from "./components/Header";
import HomeScreen from "./pages/HomeScreen";

function App() {
  const {
    filePath,
    transformedFile,
    models,
    showModelBuilder,
    onShowModelBuilder,
    onSelectFile,
    onConvert,
    onSave,
    onRearangeModels,
    setRearangedModels
  } = useFileHandler();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-800 to-gray-900 text-white">
      <TitleBar />

      {showModelBuilder === false && (
        <HomeScreen
          filePath={filePath}
          transformedFile={transformedFile}
          onShowModelBuilder={onShowModelBuilder}
          onConvert={onConvert}
          onSave={onSave}
          onSelectFile={onSelectFile}
        />
      )}

      {showModelBuilder && (
        <PresetEditor
          transformedFile={transformedFile}
          onShowModelBuilder={onShowModelBuilder}
          models={models}
          onRearangeModels={onRearangeModels}
          setRearangedModels = {setRearangedModels}
        />
      )}
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
