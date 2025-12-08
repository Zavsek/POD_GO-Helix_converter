import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window'

export function minimize() {
  invoke('minimize_window')
}

export function close() {
  invoke('close_window')
}

export const mainWindowResize= async() =>{
  const window = getCurrentWindow();
   await window.setSize(new LogicalSize(500, 650))
}

export const modelWindowResize= async() =>{
  const window = getCurrentWindow();
  await window.setSize(new LogicalSize(1300, 500))
}