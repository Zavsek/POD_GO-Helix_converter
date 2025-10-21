import React, { useState } from "react";
import { convertToHlxLogic } from "./lib/converter.js";
import TitleBar from "./components/TitleBar.jsx";
import {Toaster} from "react-hot-toast"
import toast from "react-hot-toast";
import Footer from "./components/Footer.jsx"

function App() {
  const [file, setFile] = useState(null);

  const handleConvert = () => {
    if (!file) {
      toast.error("Improper file uploaded")
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const podGoData = JSON.parse(e.target.result);
        const convertedData = convertToHlxLogic(podGoData);

        const blob = new Blob([JSON.stringify(convertedData, null, 2)], {
          type: "application/json",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "output.hlx";
        link.click();

      } catch (err) {
        toast.error(err);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-800 to-gray-900 text-white">
      <TitleBar />

      <header className="w-full bg-slate-700/80 backdrop-blur-md  py-4 text-center text-3xl font-semibold   rounded-b-2xl font-primary border-b-2 border-black shadow-2xl">
        POD GO To Helix Converter
      </header>


      <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <div className="bg-slate-700/60 backdrop-blur-md p-10  shadow-2xl w-full max-w-lg border-2 border-black min-h-[300px] flex flex-col justify-center">
          <input
            type="file"
            accept=".pgp"
            onChange={(e) => {
              const izbranaDatoteka = e.target.files[0];
              if (!izbranaDatoteka) return;

              if (!izbranaDatoteka.name.toLowerCase().endsWith(".pgp")) {
                toast.error("Dovoljene so samo .pgp datoteke!");
                setFile(null);
                return;
              }

              setFile(izbranaDatoteka);
            }}
            className="block w-full text-sm text-gray-200 bg-slate-800 border border-slate-600 rounded-lg cursor-pointer transition-all duration-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 mb-6 hover:scale-101 shadow-2xl"
          />

          <button
            onClick={handleConvert}
            className="animate-bg-shine bg-[linear-gradient(110deg,#4f46e5,45%,#a5b4fc,55%,#4f46e5)] bg-[length:200%_100%] border-[1px] text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-500 cursor-pointer hover:scale-105"
          >
            Convert to .hlx
          </button>
        </div>
      </main>

    <Footer />
    <Toaster/>
    </div>
  );
}

export default App;
