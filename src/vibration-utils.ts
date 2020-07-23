let muteVibrations = false

export function vibrateRobotCollision() {
  vibrate(10)
}

function vibrate(ms: number): void {
  if(muteVibrations) return
  window.navigator.vibrate(ms);
}