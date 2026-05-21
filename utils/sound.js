let boboAudio = null

function getBobo() {
  if (!boboAudio) {
    boboAudio = uni.createInnerAudioContext()
    boboAudio.src = '/static/bobo.wav'
  }
  return boboAudio
}

export function playBobo() {
  const a = getBobo()
  a.stop()
  a.seek(0)
  a.play()
}
