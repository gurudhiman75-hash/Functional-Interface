export interface WavAudioMetadata {
  audioFormat: number;
  channels: number;
  sampleRate: number;
  byteRate: number;
  blockAlign: number;
  bitsPerSample: number;
  dataBytes: number;
  durationMs: number;
}

function fourCc(buffer: Buffer, offset: number): string {
  return buffer.toString("ascii", offset, offset + 4);
}

export function readWavAudioMetadata(bytes: Uint8Array): WavAudioMetadata {
  const buffer = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (buffer.length < 44 || fourCc(buffer, 0) !== "RIFF" || fourCc(buffer, 8) !== "WAVE") {
    throw new Error("Audio is not a valid RIFF/WAVE file.");
  }

  let offset = 12;
  let format: Omit<WavAudioMetadata, "dataBytes" | "durationMs"> | undefined;
  let dataBytes: number | undefined;

  while (offset + 8 <= buffer.length) {
    const chunkId = fourCc(buffer, offset);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const payloadStart = offset + 8;
    const payloadEnd = payloadStart + chunkSize;
    if (payloadEnd > buffer.length) throw new Error(`WAV chunk ${chunkId} exceeds file bounds.`);

    if (chunkId === "fmt ") {
      if (chunkSize < 16) throw new Error("WAV fmt chunk is too short.");
      format = {
        audioFormat: buffer.readUInt16LE(payloadStart),
        channels: buffer.readUInt16LE(payloadStart + 2),
        sampleRate: buffer.readUInt32LE(payloadStart + 4),
        byteRate: buffer.readUInt32LE(payloadStart + 8),
        blockAlign: buffer.readUInt16LE(payloadStart + 12),
        bitsPerSample: buffer.readUInt16LE(payloadStart + 14),
      };
    } else if (chunkId === "data") {
      dataBytes = chunkSize;
    }

    offset = payloadEnd + (chunkSize % 2);
  }

  if (!format) throw new Error("WAV file has no fmt chunk.");
  if (dataBytes === undefined) throw new Error("WAV file has no data chunk.");
  if (format.channels <= 0 || format.sampleRate <= 0 || format.byteRate <= 0 || format.blockAlign <= 0) {
    throw new Error("WAV format metadata is invalid.");
  }
  const durationMs = Math.round((dataBytes / format.byteRate) * 1000);
  if (!Number.isFinite(durationMs) || durationMs <= 0) throw new Error("WAV duration is invalid.");
  return { ...format, dataBytes, durationMs };
}
