import torch
from TTS.api import TTS
import librosa
import soundfile as sf
import numpy as np
from pydub import AudioSegment
import noisereduce as nr
import os
import logging
from silero_vad import get_speech_timestamps
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import XttsAudioConfig, XttsArgs
from TTS.config.shared_configs import BaseDatasetConfig

# Allow PyTorch 2.6+ to load trusted classes
torch.serialization.add_safe_globals([
    XttsConfig,
    XttsAudioConfig,
    BaseDatasetConfig,
    XttsArgs
])

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(_name_)

class VoiceCloner:
    def _init_(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {self.device}")

        try:
            self.model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", progress_bar=True).to(self.device)
            logger.info("XTTS v2 model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading XTTS v2 model: {str(e)}")
            raise

    def preprocess_audio(self, input_wav):
        audio, sr = librosa.load(input_wav, sr=None)
        vad_model, vad_utils = torch.hub.load('snakers4/silero-vad', 'silero_vad')
        get_speech_timestamps, *_ = vad_utils
        vad_timestamps = get_speech_timestamps(torch.tensor(audio, dtype=torch.float32), vad_model, sampling_rate=sr)
        speech_audio = np.concatenate([audio[t['start']:t['end']] for t in vad_timestamps])
        speech_audio = librosa.util.normalize(speech_audio)
        processed_path = f"processed_{os.path.basename(input_wav)}"
        sf.write(processed_path, speech_audio, sr)
        return processed_path

    def pitch_shift(self, input_wav, semitones):
        if semitones == 0:
            return input_wav

        audio = AudioSegment.from_wav(input_wav)
        shifted = audio._spawn(audio.raw_data, overrides={
            "frame_rate": int(audio.frame_rate * (2 ** (semitones / 12.0)))
        }).set_frame_rate(audio.frame_rate)

        shifted_path = f"pitch_shifted_{os.path.basename(input_wav)}"
        shifted.export(shifted_path, format="wav")
        return shifted_path

    def apply_reverb(self, input_wav, intensity=0):
        if intensity <= 0:
            return input_wav
        
        audio = AudioSegment.from_wav(input_wav)
        reverb = audio.overlay(audio, gain_during_overlay=-10 + (5 * intensity))
        reverb_path = f"reverb_{os.path.basename(input_wav)}"
        reverb.export(reverb_path, format="wav")
        return reverb_path

    def add_dynamic_volume(self, input_wav, emotion):
        audio = AudioSegment.from_wav(input_wav)
        segments = []
        for i, chunk in enumerate(audio[::200]):  # 200ms chunks
            gain = 0
            if emotion == "excited":
                gain = np.sin(i / 3) * 2  # Slight fluctuation
            elif emotion == "sad":
                gain = np.cos(i / 5) * -2  # Quieter fluctuations
            segments.append(chunk + gain)

        dynamic_audio = sum(segments)
        dynamic_path = f"dynamic_{os.path.basename(input_wav)}"
        dynamic_audio.export(dynamic_path, format="wav")
        return dynamic_path

    def add_pauses(self, text, emotion):
        if emotion == "hesitant":
            words = text.split()
            spaced_text = ""
            for word in words:
                spaced_text += word + (", " if np.random.rand() < 0.3 else " ")
            return spaced_text.strip()
        return text

    def clone_voice(self, text, speaker_wav, output_wav, language="hi", speed=1.0, emotion=None):
        try:
            processed_speaker = self.preprocess_audio(speaker_wav)

            emotion_pitch = {
                "neutral": 0,
                "excited": 4,
                "sad": -3,
                "angry": 2,
                "hesitant": 0
            }

            emotion_speed = {
                "neutral": 1.0,
                "excited": 1.3,
                "sad": 0.8,
                "angry": 1.1,
                "hesitant": 0.9
            }

            emotion_reverb = {
                "neutral": 0,
                "excited": 2,
                "sad": 1,
                "angry": 1,
                "hesitant": 0
            }

            # Apply emotion-based changes
            if emotion:
                text = self.add_pauses(text, emotion)
                speed *= emotion_speed.get(emotion, 1.0)

            temp_output = "raw_tts_output.wav"
            self.model.tts_to_file(
                text=text,
                speaker_wav=processed_speaker,
                language=language,
                file_path=temp_output,
                speed=speed
            )

            # Apply pitch shift, reverb and volume dynamics based on emotion
            pitch_shifted = self.pitch_shift(temp_output, emotion_pitch.get(emotion, 0))
            reverb_applied = self.apply_reverb(pitch_shifted, emotion_reverb.get(emotion, 0))
            dynamic_volume_applied = self.add_dynamic_volume(reverb_applied, emotion)

            os.rename(dynamic_volume_applied, output_wav)

            for tmp_file in [temp_output, pitch_shifted, reverb_applied]:
                if os.path.exists(tmp_file):
                    os.remove(tmp_file)

            if processed_speaker != speaker_wav:
                os.remove(processed_speaker)

            logger.info(f"Voice cloning completed with emotion '{emotion}': {output_wav}")
            return True

        except Exception as e:
            logger.error(f"Error in voice cloning: {str(e)}")
            return False


def main():
    cloner = VoiceCloner()

    result = cloner.clone_voice(
        text="आज मैं बहुत थक गया हूँ और घर जाना चाहता हूँ।",
        speaker_wav="trial.wav",
        output_wav="emotional_output.wav",
        language="hi",
        speed=1.0,
        emotion="hesitant"  # Options: neutral, excited, sad, angry, hesitant
    )

    if result:
        print("Voice cloning completed successfully with emotion!")
    else:
        print("Voice cloning failed.")


if _name_ == "_main_":
    main()