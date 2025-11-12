import React, { useState } from "react";
import { convertToHlxLogic } from "./lib/converter.js";
import TitleBar from "./components/TitleBar.jsx";
import Footer from "./components/Footer.jsx";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { open, save } from "@tauri-apps/plugin-dialog";

function App() {
  const [filePath, setFilePath] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  const handleSelectFile = async () => {
    try {
      const izbranaDatoteka = await open({
        multiple: false,
        filters: [{ name: "POD GO Files", extensions: ["pgp"] }],
      });

      if (!izbranaDatoteka) return;

      setFilePath(izbranaDatoteka);
      
      if (izbranaDatoteka.startsWith('/mock/')) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pgp';
        input.onchange = (e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
            setFileContent(event.target.result);
            toast.success(`Selected File: ${file.name}`);
          };
          reader.readAsText(file);
        };
        input.click();
      } else {

        setFileContent(await readTextFile(izbranaDatoteka));
        toast.success(`File Selected Succesfully`);
      }
    } catch (err) {
      toast.error("Error in selecting file");
      console.error(err);
    }
  };

  const handleConvert = async () => {
    if (!filePath && !fileContent) {
      toast.error("No File Selected!");
      return;
    }

    try {
      let contentToConvert = fileContent;
      
      if (!contentToConvert && filePath) {
        contentToConvert = await readTextFile(filePath);
      }

      if (!contentToConvert) {
        toast.error("No Content To Convert!");
        return;
      }

      const podGoData = JSON.parse(contentToConvert);
      const convertedData = convertToHlxLogic(podGoData);



      const savePath = await save({
        defaultPath: "output.hlx",
        filters: [{ name: "Helix Files", extensions: ["hlx"] }],
      });

      if (!savePath) return; 

      await writeTextFile({ path: savePath, contents: JSON.stringify(convertedData, null, 2) });

      toast.success(`File Saved Succesfully: ${savePath}`);
    } catch (err) {
      toast.error(err.toString());
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-800 to-gray-900 text-white">
      <TitleBar />

      <header className="w-full bg-slate-700/80 backdrop-blur-md py-4 text-center text-3xl font-semibold rounded-b-xl font-primary  shadow-2xl">
        POD GO TO HELIX CONVERTER
      </header>

      <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <div className="bg-slate-700/10 backdrop-blur-md p-10 shadow-2xl w-full max-w-lg   min-h-[300px] flex flex-col justify-center gap-4">
          
        <input
          type="text"
          readOnly
          value={filePath || ""}
          placeholder="No File Selected"
          className="text-white p-2 rounded-lg border bg-[linear-gradient(110deg,#4f46e5,55%,#4f46e5)]  border-gray-500 w-full"
        />
          <button
            onClick={handleSelectFile}
            className="animate-bg-shine bg-[linear-gradient(110deg,#4f46e5,45%,#a5b4fc,55%,#4f46e5)] bg-[length:200%_100%] border-[1px] text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-500 cursor-pointer hover:scale-101"
          >
            Select .pgp File
          </button>
          <button
            onClick={handleConvert}
            className="animate-bg-shine bg-[linear-gradient(110deg,#4f46e5,45%,#a5b4fc,55%,#4f46e5)] bg-[length:200%_100%] border-[1px] text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-500 cursor-pointer hover:scale-101"
          >
            Convert to .hlx
          </button>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
