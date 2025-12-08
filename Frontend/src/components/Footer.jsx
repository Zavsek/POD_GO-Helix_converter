import React from 'react'
import image from '../images/default-yellow.png';
import { openUrl } from '@tauri-apps/plugin-opener';

export const openAnUrl = async (url) => {
  try {
    await openUrl(url);
  } catch (err) {
    console.error("Napaka pri odpiranju URL:", err);
  }
};

const Footer = () => {
  return (
    <footer className="text-center absolute bottom-2 w-full py-4 text-sm font-primary text-gray-400/70 ">
        {new Date().getFullYear()} POD GO to Helix Converter by Filip Zavšek
        <div 
          className="mt-2 cursor-pointer" 
          onClick={() => openAnUrl("https://buymeacoffee.com/zavsek")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              openUrl("https://buymeacoffee.com/zavsek");
            }
          }}
        >
          <img className="mx-auto h-8" src={image} alt="Buy Me a Coffee" />
        </div>
      </footer>
  )
}

export default Footer