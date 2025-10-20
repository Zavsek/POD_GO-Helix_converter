import React, { useState } from "react"

function App() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState("")

  const handleConvert = () => {
    if (!file) {
      setStatus("⚠️ Izberi .podgo datoteko!")
      return
    }

    setStatus("⏳ Pretvarjam...")
    setTimeout(() => {
      setStatus("✅ Pretvorjeno! (simulirano)")
    }, 1500)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <div className="bg-slate-700/60 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-lg border border-slate-600">
        <h1 className="text-3xl font-bold mb-6"> POD Go → Helix Converter</h1>

        <input
          type="file"
          accept=".podgo"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-200 bg-slate-800 border border-slate-600 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 transition mb-4"
        />

        <button
          onClick={handleConvert}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200"
        >
          Pretvori v .hlx
        </button>

        <p className="mt-4 text-green-400">{status}</p>
      </div>

      <footer className="mt-10 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} POD to Helix Converter by Filip Zavšek
      </footer>
    </div>
  )
}

export default App
