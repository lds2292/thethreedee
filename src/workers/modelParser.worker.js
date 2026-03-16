self.onmessage = async ({ data: { buffer, ext } }) => {
  try {
    if (ext === 'stl') {
      const view = new DataView(buffer)
      const isBinary = (() => {
        if (buffer.byteLength < 84) return false
        const triCount = view.getUint32(80, true)
        const expectedSize = 84 + triCount * 50
        if (Math.abs(buffer.byteLength - expectedSize) < 10) return true
        const text = new TextDecoder().decode(new Uint8Array(buffer, 0, Math.min(256, buffer.byteLength)))
        return !text.trim().startsWith('solid')
      })()

      if (isBinary) {
        const triCount = view.getUint32(80, true)
        const positions = new Float32Array(triCount * 9)
        const normals   = new Float32Array(triCount * 9)
        let offset = 84
        for (let i = 0; i < triCount; i++) {
          const nx = view.getFloat32(offset,     true)
          const ny = view.getFloat32(offset + 4, true)
          const nz = view.getFloat32(offset + 8, true)
          offset += 12
          for (let v = 0; v < 3; v++) {
            const base = i * 9 + v * 3
            positions[base]     = view.getFloat32(offset,     true)
            positions[base + 1] = view.getFloat32(offset + 4, true)
            positions[base + 2] = view.getFloat32(offset + 8, true)
            normals[base] = nx; normals[base + 1] = ny; normals[base + 2] = nz
            offset += 12
          }
          offset += 2
        }
        self.postMessage({ type: 'stl', positions, normals, triCount }, [positions.buffer, normals.buffer])
      } else {
        self.postMessage({ type: 'stl_ascii', buffer }, [buffer])
      }
    } else {
      const text = new TextDecoder().decode(new Uint8Array(buffer))
      self.postMessage({ type: 'obj_text', text })
    }
  } catch (e) {
    self.postMessage({ type: 'error', message: e.message })
  }
}