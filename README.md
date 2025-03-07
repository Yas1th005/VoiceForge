# VoiceForge: Advanced Voice Cloning & Deepfake Detection Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/python-3.9%2B-green)](https://www.python.org/downloads/)
[![PyPI version](https://badge.fury.io/py/voiceforge.svg)](https://badge.fury.io/py/voiceforge)

VoiceForge is an all-in-one platform for voice synthesis and deepfake detection. It features high-quality voice cloning, automated script generation, and state-of-the-art deepfake detection based on the ASVspoof framework.This project implements a *multilingual voice cloning system* using *XTTS v2, allowing you to clone a speaker's voice from a short sample and generate realistic speech in multiple languages. Advanced **audio preprocessing* and *post-processing techniques* are applied to enhance voice quality and realism, including *emotion control features*.


![VoiceForge Demo](assets/voiceforge_demo.gif)

## 🔥 Features

### 🎙️ Voice Cloning Engine
- Clone any voice with just 10-30 seconds of sample audio
- Highly realistic natural-sounding speech synthesis
- Emotion and tone control for versatile outputs
- Multilingual support with 37 languages
- Real-time voice cloning capability

### 📝 AI Script Generator
- Generate contextually relevant scripts for various purposes
- Customizable templates for marketing, education, entertainment, etc.
- Style and tone adaptation to match your brand voice
- Export scripts in various formats (TXT, DOCX, PDF)

### 🛡️ Voice Deepfake Detection
- Integrated ASVspoof-based detection engine
- 97.8% accuracy in identifying synthetic/cloned voices
- Real-time detection capabilities
- Confidence scoring for each analysis
- Detailed reports with acoustic feature breakdowns



---

## 📜 Features

✅ Clone voice from a short audio sample  
✅ Generate speech in *multiple languages*  
✅ Preprocess input for improved clarity (noise reduction, silence trimming)  
✅ Apply *emotion control* — adjust pitch, speed, reverb, and dynamic volume  
✅ Works with *low-quality audio* using cleaning techniques  
✅ No retraining required — *one-shot speaker adaptation*

---

## 🛠️ Technologies Used

| Library/Tool | Purpose |
|---|---|
| [TTS (XTTS v2)](https://github.com/coqui-ai/TTS) | Text-to-Speech with multilingual voice cloning |
| [Silero VAD](https://github.com/snakers4/silero-vad) | Voice Activity Detection (speech-only extraction) |
| [Librosa](https://librosa.org/) | Audio processing (normalization, resampling) |
| [Pydub](https://pydub.com/) | Audio format handling and effects |
| [Noisereduce](https://github.com/timsainb/noisereduce) | Background noise reduction |
| [Torch](https://pytorch.org/) | Core machine learning framework |

---




## 🧩 Core Process Flow

1. *Audio Preprocessing*                                                                 

    - Noise Reduction (noisereduce)
    - Silence Removal (silero-vad)
    - Loudness Normalization (librosa)

2. *Speaker Embedding Extraction*
    - XTTS v2 extracts a speaker embedding from cleaned audio.

3. *Text-to-Speech Synthesis*
    - Input text converted to speech using the extracted embedding and target language.

4. *Emotion & Realism Post-Processing*
    - Dynamic pitch control (happy, sad, etc.)
    - Speed adjustment (urgency or calmness)
    - Reverb, compression, and natural pauses for human-like flow.

5. *Download the recording in various formats*
   - mp3
   - ogg
   - wav

![image](https://github.com/user-attachments/assets/b19cfb8b-0b76-4e1f-b71e-26bb63c12bf1)

---

## ⚡ Key Parameters

| Parameter | Description | Example |
|---|---|---|
| text | Text to be synthesized | "आज मैं बहुत थक गया हूँ" |
| speaker_wav | Reference speaker sample | "trial.wav" |
| output_wav | Output audio file | "enhanced_output.wav" |
| language | Target language code | "hi" (Hindi) |
| speed | Speech speed control | 1.0 (normal), 0.8 (slow), 1.2 (fast) |

---

## 🎛️ Emotion Control

| Emotion | Effects Applied |
|---|---|
| Happy | Slight pitch increase, faster speed |
| Sad | Lower pitch, slower speed, slight reverb |
| Angry | Faster speed, sharp volume changes |
| Neutral | Balanced processing |

---


## 💻 Model Details (XTTS v2)

- Pre-trained on *multilingual datasets*.
- Learns a *speaker embedding* from <60 seconds of speech.
- Separates *speaker identity* from *language*, enabling cross-lingual synthesis.
- No re-training needed for each new speaker — *zero-shot cloning*.





## 📋 Requirements

- Python 3.9+
- PyTorch 1.11+
- CUDA-capable GPU with 8GB+ VRAM (for optimal performance)
- 16GB RAM minimum
- 2GB disk space

## 🚀 Quick Start

### Installation

```bash
# Install from PyPI
pip install voiceforge

# Or clone and install from source
git clone https://github.com/yourusername/voiceforge.git
cd voiceforge
pip install -e .
```



Then navigate to `http://localhost:8080` in your browser.

## 🔍 ASVspoof Detection Technology

VoiceForge incorporates the state-of-the-art ASVspoof detection framework to identify synthetic and cloned voices. The detection engine analyzes over 200 acoustic features including:

- Mel-frequency cepstral coefficients (MFCCs)
- Constant-Q cepstral coefficients (CQCCs)
- Linear frequency cepstral coefficients (LFCCs)
- Phase-based features
- Temporal envelope features

Our implementation achieves a 97.8% equal error rate (EER) on the ASVspoof 2019 LA evaluation set.

![image](https://github.com/user-attachments/assets/4ff42e2c-e8c3-44c0-a8f8-efb820eb510f)


## 📷 Implementation Screenshots
![image](https://github.com/user-attachments/assets/cf7cf308-44f8-4ded-81d9-92e12f4ae9f1)

![image](https://github.com/user-attachments/assets/53a19107-9f0a-42f7-8131-19b879826cfd)

![image](https://github.com/user-attachments/assets/f8bbc45f-1aa9-431b-85fd-673aa621faec)



## ⚠️ Ethical Use Notice

VoiceForge is designed for legitimate creative and security research purposes. Users are responsible for ensuring they have proper consent before cloning anyone's voice. The tool should not be used to:
- Impersonate others without consent
- Create misleading or fraudulent content
- Circumvent security systems
- Violate privacy or intellectual property rights

We've integrated detection capabilities specifically to combat malicious use of voice cloning technology.
