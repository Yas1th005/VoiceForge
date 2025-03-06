import torch
from TTS.api import TTS
import librosa
import soundfile as sf
import numpy as np
from pydub import AudioSegment
from pydub.silence import split_on_silence
import noisereduce as nr
import os
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import XttsAudioConfig, XttsArgs
from TTS.config.shared_configs import BaseDatasetConfig
import logging



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
            self.model = TTS("tts_models/multilingual/multi-dataset/xtts_v2", 
                           progress_bar=True).to(self.device)
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise

    def preprocess_audio(self, input_wav, min_silence_len=500, silence_thresh=-40):
        try:
            logger.info(f"Processing audio file: {input_wav}")
            
            # Load and normalize audio
            audio, sr = librosa.load(input_wav, sr=None)
            normalized_audio = librosa.util.normalize(audio)
            
            # Apply noise reduction
            reduced_noise = nr.reduce_noise(y=normalized_audio, sr=sr)
            
            # Save temporary file using soundfile
            temp_path = "temp_processed.wav"
            sf.write(temp_path, reduced_noise, sr)
            
            # Process with pydub
            audio_segment = AudioSegment.from_wav(temp_path)
            
            # Remove silence
            chunks = split_on_silence(
                audio_segment,
                min_silence_len=min_silence_len,
                silence_thresh=silence_thresh,
                keep_silence=100
            )
            
            # Combine processed chunks
            processed_audio = sum(chunks)
            
            # Export final processed audio
            processed_path = f"processed_{os.path.basename(input_wav)}"
            processed_audio.export(processed_path, format="wav")
            
            # Cleanup
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
            logger.info(f"Audio preprocessing completed: {processed_path}")
            return processed_path
            
        except Exception as e:
            logger.error(f"Error in audio preprocessing: {str(e)}")
            if os.path.exists(temp_path):
                os.remove(temp_path)
            raise

    def clone_voice(self, text, speaker_wav, output_wav, language="en", speed=1.0):
        """Enhanced voice cloning with speed control"""
        try:
            # Preprocess reference audio
            processed_speaker = self.preprocess_audio(speaker_wav)
            
            # Generate speech with cloned voice
            self.model.tts_to_file(
                text=text,
                speaker_wav=processed_speaker,
                language="hi",
                file_path=output_wav,
                speed=speed,
                emotion="happy",
                

                
            )
            
            if processed_speaker != speaker_wav:
                os.remove(processed_speaker)
                
            return True
            
        except Exception as e:
            print(f"Error in voice cloning: {str(e)}")
            return False

def main():
    cloner = VoiceCloner()
    
    # Example usage
    result = cloner.clone_voice(
        text="यहाँ पर पूरी तरह हिंदी में एक लंबी और विस्तृत स्क्रिप्ट दी गई है, जिसमें सकारात्मक मानसिकता, आत्म-विश्वास, मानसिक स्वास्थ्य और नशे के दुष्प्रभावों पर विस्तार से चर्चा की गई है।",
        speaker_wav="trial.wav",
        output_wav="enhanced_output_div.wav",
        speed=1.2 ,
        emotion="sad"# Adjust speed if needed (0.5-1.5)
    )
    
    if result:
        print("Voice cloning completed successfully!")
    else:
        print("Voice cloning failed.")

if _name_ == "_main_":
    main()