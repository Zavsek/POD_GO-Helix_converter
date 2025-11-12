import { invoke } from '@tauri-apps/api/core'

export function minimize() {
  invoke('minimize_window')
}

export function close() {
  invoke('close_window')
}
