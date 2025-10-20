import React, { useState } from "react";
import { convertToHlxLogic } from "./lib/converter.js"; // tvoja funkcija za logiko pretvorbe

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleConvert = () => {
    if (!file) {
      setStatus("Izberi .pgp datoteko!");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        // parse JSON iz datoteke
        const podGoData = JSON.parse(e.target.result);

        // uporabi tvojo logiko pretvorbe
        const convertedData = convertToHlxLogic(podGoData);

        // ustvari blob za prenos
        const blob = new Blob([JSON.stringify(convertedData, null, 2)], {
          type: "application/json",
        });

        // ustvari link za download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "output.hlx";
        link.click();

        setStatus("✅ Pretvorjeno in pripravljeno za prenos!");
      } catch (err) {
        console.error(err);
        setStatus("❌ Napaka pri pretvorbi datoteke!");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-800 to-gray-900 text-white">
      {/* NASLOV */}
      <header className="w-full bg-slate-700/80 backdrop-blur-md shadow-md py-4 text-center text-3xl font-bold border-b border-slate-600 rounded-b-2xl">
        POD Go To Helix Converter
      </header>

      {/* VSEBINA */}
      <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <div className="bg-slate-700/60 backdrop-blur-md p-10 rounded-2xl shadow-lg w-full max-w-lg border border-slate-600 min-h-[300px] flex flex-col justify-center">
          <input
            type="file"
            accept=".pgp"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-200 bg-slate-800 border border-slate-600 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 transition mb-6"
          />

          <button
            onClick={handleConvert}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200"
          >
            Pretvori v .hlx
          </button>

          <p className="mt-4 text-green-400">{status}</p>
        </div>
      </main>

      {/* NOGA */}
      <footer className="text-center py-4 text-sm text-gray-400/70">
        {new Date().getFullYear()} POD to Helix Converter by Filip Zavšek
      </footer>
    </div>
  );
}

export default App;
