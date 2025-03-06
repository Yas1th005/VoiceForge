import React, { useState, useRef } from 'react';
import axios from 'axios';
import BoxReveal from './BoxReveal';

interface AudioState {
  audioFile?: File;
  audioUrl?: string;
}

interface OutputState {
  isLoading: boolean;
  audioUrl?: string;
  error?: string;
}

interface VoiceSample {
  name: string;
  description: string;
}

interface TTSOptions {
  output_format: string;
  emotion?: string;
  language?: string;
}

const Voice: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioState>({});
  const [outputState, setOutputState] = useState<OutputState>({
    isLoading: false,
  });
  const [message, setMessage] = useState<string>(
    "Every journey begins with a single step. The path ahead may be uncertain, but standing still guarantees nothing."
  );
  const [voiceName, setVoiceName] = useState<string>("My Voice Clone");
  
  // TTS Options
  const [ttsOptions, setTtsOptions] = useState<TTSOptions>({
    output_format: 'mp3',
    emotion: '',
    language: ''
  });
  
  // Sample voice profiles
  const sampleVoices: VoiceSample[] = [
    { name: "Professional Narrator", description: "Clear, authoritative tone ideal for documentaries" },
    { name: "Friendly Assistant", description: "Warm, approachable voice for virtual assistants" },
    { name: "Dramatic Reader", description: "Expressive voice with emotional range for storytelling" }
  ];
  
  // Available options for dropdowns
  const outputFormats = ['mp3', 'wav', 'ogg'];
  const emotions = ['', 'male_happy', 'male_sad', 'male_angry', 'male_fearful', 'female_happy', 'female_sad', 'female_angry', 'female_fearful'];
  const languages = ['', 'english', 'hindi', 'spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'chinese', 'korean'];
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if the file is an audio file (MP4 or MP3)
      if (file.type.startsWith('audio/') || file.type === 'video/mp4') {
        const audioUrl = URL.createObjectURL(file);
        setAudioState({
          audioFile: file,
          audioUrl,
        });
      } else {
        alert("Please upload an MP4 or MP3 audio file");
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };
  
  // Handle TTS option changes
  const handleTtsOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTtsOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Clear selected file
  const clearSelectedFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (audioState.audioUrl) {
      URL.revokeObjectURL(audioState.audioUrl);
    }
    
    setAudioState({});
  };
  
  // Submit file to backend
  const submitFile = async () => {
    if (!audioState.audioFile) {
      alert("Please upload an audio file first");
      return;
    }
    
    setOutputState({ isLoading: true });
    
    const formData = new FormData();
    formData.append('sample_file', audioState.audioFile);
    formData.append('voice_name', voiceName);
    formData.append('message', message);
    
    // Add all TTS options to the form data
    Object.entries(ttsOptions).forEach(([key, value]) => {
      // Only append if value is not empty
      if (value) {
        formData.append(key, value);
      }
    });
    
    try {
      // Use full URL to bypass proxy issues
      const response = await axios.post('http://localhost:5000/api/clone-and-generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const audioUrl = `http://localhost:5000${response.data.audio_url}`;
      setOutputState({
        isLoading: false,
        audioUrl,
      });
    } catch (error) {
      console.error("Error submitting voice clone request:", error);
      setOutputState({
        isLoading: false,
        error: "Failed to process voice clone request. Please try again.",
      });
    }
  };
  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="w-[80vw] mx-auto rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">

          <div className="uppercase tracking-wide font-monument text-4xl text-white font-semibold mb-1 w-fit">
          <BoxReveal color="#fe7cff">
            Voice Cloning Lab
          </BoxReveal>
          </div>

          <div className='w-fit'>
          <BoxReveal color="#fe7cff" duration={0.8}>
          <h1 className="text-lg font-medium mb-2 text-[#fe7cff] font-poppins">
            Create Your Digital Voice Twin
          </h1>
          <p className="text-gray-400 mb-6 font-poppins">
            Upload a voice sample and transform any text into speech that sounds just like you
          </p>
          </BoxReveal>
          </div>
          



          <section className="w-[80vw]">
            <div className="container mx-auto flex flex-col p-6">
              {/* <h2 className="py-4 text-3xl font-poppins text-[#fe7cff] font-bold text-center">Clone your voice</h2> */}
              <div className="divide-y dark:divide-gray-300">
                <BoxReveal color="#fe7cff">
                <div className="grid justify-center grid-cols-4 p-8 mx-auto space-y-8 lg:space-y-0 relative">
                  <div className="flex items-center justify-center lg:col-span-1 col-span-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-16 h-16">
                      <path d="M472,16H168a24,24,0,0,0-24,24V344a24,24,0,0,0,24,24H472a24,24,0,0,0,24-24V40A24,24,0,0,0,472,16Zm-8,320H176V48H464Z"></path>
                      <path d="M112,400V80H80V408a24,24,0,0,0,24,24H432V400Z"></path>
                      <path d="M48,464V144H16V472a24,24,0,0,0,24,24H368V464Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center max-w-3xl text-center col-span-full lg:col-span-3 lg:text-left">
                    <span className="text-sm tracking-wider uppercase text-[#fe7cff] font-poppins mb-1">Step 1</span>
                    <span className="text-xl font-medium md:text-2xl font-poppins">Upload Voice Sample</span>
                    {/* <span className="mt-4 dark:text-gray-300">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam facilis, voluptates error alias dolorem praesentium sit soluta iure incidunt labore explicabo eaque, quia architecto veritatis dolores, enim cons equatur nihil ipsum.</span> */}
                    <div className="mb-6 mt-5">
                      <label htmlFor="voiceName" className="block text-sm font-medium text-gray-300 mb-1 font-poppins">
                        Enter the Voice Clone Name
                      </label>
                      <input
                        type="text"
                        id="voiceName"
                        value={voiceName}
                        onChange={(e) => setVoiceName(e.target.value)}
                        className="w-[200px] px-3 py-2 border border-white bg-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
                        style={{  }}
                      />
                    </div>

                    <div className="mb-6 bg-black rounded-lg">
                      {/* <h2 className="text-lg font-medium text-white mb-2">Step 1: Upload Voice Sample</h2> */}
                      <p className="text-white font-poppins text-base mb-4">
                        Best results come from clear audio samples of 30-60 seconds with minimal background noise.
                      </p>
                      <div className="flex items-center justify-center mb-4 absolute top-[133px] left-[600px]">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="audio/*, video/mp4"
                          onChange={handleFileChange}
                          className="hidden"
                          id="audio-upload"
                        />
                        <label
                          htmlFor="audio-upload"
                          className="px-4 py-2 text-black font-medium rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                          style={{ backgroundColor: '#fe7cff' }}
                        >
                          Select MP4/MP3 File
                        </label>
                        
                        {audioState.audioFile && (
                          <button
                            onClick={clearSelectedFile}
                            className="ml-2 px-3 py-2 text-white border border-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      
                      {audioState.audioFile && (
                        <div className="mt-5">
                          <p className="text-sm mb-1 font-poppins">
                            Selected file: <span className="font-medium">{audioState.audioFile.name}</span> ({(audioState.audioFile.size / 1024).toFixed(2)} KB)
                          </p>
                          {audioState.audioUrl && (
                            <div>
                              <p className="text-sm text-white mb-4">Preview:</p>
                              <audio
                                controls
                                src={audioState.audioUrl}
                                className="w-full"
                                style={{
                                  backgroundColor: 'transparent', // Ensure transparency
                                  border: '2px solid white', // White border
                                  borderRadius: '10px',
                                  accentColor: '#fe7cff', // Theme color for progress bar
                                  filter: 'invert(1) brightness(2)', // Inverts colors to make it dark-themed
                                  mixBlendMode: 'difference' // Tries to blend it better with the dark theme
                                }}
                              />
                            </div>

                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                </BoxReveal>
                <BoxReveal color="#fe7cff" duration={0.8}>
                <div className="grid justify-center grid-cols-4 p-8 mx-auto space-y-8 lg:space-y-0">
                  <div className="flex items-center justify-center lg:col-span-1 col-span-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-16 h-16">
                      <path d="M285.177,179l15.513-3.914-7.827-31.028-15.514,3.913a176.937,176.937,0,0,0-129.3,133.557l-3.407,15.633,31.266,6.814,3.406-15.634A145.559,145.559,0,0,1,285.177,179Z"></path>
                      <path d="M363.624,147.871C343.733,72.077,274.643,16,192.7,16,95.266,16,16,95.266,16,192.7c0,82.617,57,152.163,133.735,171.4A176.769,176.769,0,0,0,320.7,496c97.431,0,176.7-79.266,176.7-176.695C497.392,238.071,441.64,167.336,363.624,147.871ZM48,192.7C48,112.91,112.91,48,192.7,48s144.7,64.91,144.7,144.7-64.911,144.7-144.7,144.7S48,272.481,48,192.7ZM320.7,464c-60.931,0-115.21-38.854-135.843-94.792,2.6.115,5.214.184,7.843.184a176.862,176.862,0,0,0,32.7-3.047l97.625,97.625C322.247,463.983,321.473,464,320.7,464Zm41.528-6.083L260.26,355.954a176.9,176.9,0,0,0,43.662-26.072L408.37,434.33A144.385,144.385,0,0,1,362.223,457.917Zm69.3-45.692L326.851,307.557a177.082,177.082,0,0,0,27.911-44.5L457.67,365.964A144.661,144.661,0,0,1,431.519,412.225Zm33.594-84.073-99.42-99.42a176.785,176.785,0,0,0,3.7-36.036c0-3.285-.1-6.547-.276-9.787a145.054,145.054,0,0,1,96.276,136.4C465.392,322.276,465.291,325.224,465.113,328.152Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center max-w-3xl text-center col-span-full lg:col-span-3 lg:text-left">
                  <span className="text-sm tracking-wider uppercase text-[#fe7cff] font-poppins mb-1">Step 2</span>
                  <span className="text-xl font-medium md:text-2xl font-poppins">Enter Text for TTS</span>
                    {/* <span className="mt-4 dark:text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam facilis, voluptates error alias dolorem praesentium sit soluta iure incidunt labore explicabo eaque, quia architecto veritatis dolores, enim cons equatur nihil ipsum.</span> */}
                    <div className="mb-6 mt-3">
                      {/* <h2 className="text-lg font-medium text-white mb-2">Step 2: Enter Text for TTS</h2> */}
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message to Convert
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 font-poppins py-2 bg-black border border-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
                      />
                    </div>

                    <div className="mb-6">
                    <h3 className="text-sm font-medium text-white mb-2">Try these sample phrases:</h3>
                    <div className="grid grid-cols-3 gap-2 w-[100%]">
                      {[
                        "Welcome to my personal AI assistant. How can I help you today?",
                        "This is a demonstration of advanced voice cloning technology.",
                        "The quick brown fox jumps over the lazy dog."
                      ].map((sample, index) => (
                        <button
                          key={index}
                          onClick={() => setMessage(sample)}
                          className="text-left text-sm py-2 px-3 hover:bg-gray-700 rounded border border-white text-gray-300"
                        >
                          {sample}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* TTS Options Section */}
                  <div className="mb-6 mt-3">
                    <h3 className="text-sm font-medium text-white mb-2 font-poppins">TTS Options:</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {/* Output Format Selector */}
                      <div>
                        <label htmlFor="output_format" className="block text-xs font-medium text-gray-300 mb-1 font-poppins">
                          Output Format
                        </label>
                        <select
                          id="output_format"
                          name="output_format"
                          value={ttsOptions.output_format}
                          onChange={handleTtsOptionChange}
                          className="w-full px-3 py-2 bg-black border border-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
                        >
                          {outputFormats.map(format => (
                            <option key={format} value={format}>
                              {format.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Emotion Selector */}
                      <div>
                        <label htmlFor="emotion" className="block text-xs font-medium text-gray-300 mb-1 font-poppins">
                          Emotion
                        </label>
                        <select
                          id="emotion"
                          name="emotion"
                          value={ttsOptions.emotion}
                          onChange={handleTtsOptionChange}
                          className="w-full px-3 py-2 bg-black border border-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
                        >
                          <option value="">None</option>
                          {emotions.filter(e => e !== '').map(emotion => (
                            <option key={emotion} value={emotion}>
                              {emotion.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Language Selector */}
                      <div>
                        <label htmlFor="language" className="block text-xs font-medium text-gray-300 mb-1 font-poppins">
                          Language
                        </label>
                        <select
                          id="language"
                          name="language"
                          value={ttsOptions.language}
                          onChange={handleTtsOptionChange}
                          className="w-full px-3 py-2 bg-black border border-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
                        >
                          <option value="">Auto Detect</option>
                          {languages.filter(l => l !== '').map(language => (
                            <option key={language} value={language}>
                              {language.charAt(0).toUpperCase() + language.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
                </BoxReveal>
                <BoxReveal color="#fe7cff" duration={1}>
                <div className="grid justify-center grid-cols-4 p-8 mx-auto space-y-8 lg:space-y-0">
                  <div className="flex items-center justify-center lg:col-span-1 col-span-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-16 h-16">
                      <path d="M412.284,294.37l-12.5,15.642c-8.354,10.454-50.027,64.208-50.027,95.883,0,36.451,28.049,66.105,62.526,66.105s62.527-29.654,62.527-66.105c0-31.675-41.673-85.429-50.028-95.883Zm0,145.63c-16.832,0-30.526-15.3-30.526-34.105,0-11.662,15.485-37.883,30.531-59.2,15.043,21.3,30.522,47.509,30.522,59.2C442.811,424.7,429.116,440,412.284,440Z"></path>
                      <path d="M122.669,51.492,96.133,124.4,30.092,97.205,17.908,126.8l67.271,27.7L26.9,314.606a48.056,48.056,0,0,0,28.689,61.523l184.719,67.232a48,48,0,0,0,61.523-28.688L397.6,151.56Zm149.1,352.236a16,16,0,0,1-20.508,9.563L66.537,346.059a16,16,0,0,1-9.563-20.507L73.553,280H316.8ZM85.2,248l29.594-81.311,36.333,14.961a32.644,32.644,0,1,0,11.236-29.98l-36.615-15.077,16.046-44.085,214.79,78.177L328,249.219V248Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center max-w-3xl text-center col-span-full lg:col-span-3 lg:text-left">
                    <span className="text-sm tracking-wider uppercase text-[#fe7cff] font-poppins mb-1">Step 3</span>
                    <span className="text-xl font-medium md:text-2xl font-poppins">Generate Voice</span>
                    {/* <span className="mt-4 dark:bg-gray-100 dark:text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam facilis, voluptates error alias dolorem praesentium sit soluta iure incidunt labore explicabo eaque, quia architecto veritatis dolores, enim cons equatur nihil ipsum.</span> */}
                    {!outputState.audioUrl ? <>
                      <div className="mb-6">
                      <button
                        onClick={submitFile}
                        disabled={!audioState.audioFile || outputState.isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        style={{ 
                          backgroundColor: !audioState.audioFile || outputState.isLoading ? '#666' : '#fe7cff',
                        }}
                      >
                        {outputState.isLoading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : "Generate Voice Clone TTS"}
                      </button>
                    </div>
                    </>
                      :
                      <>
                          {outputState.audioUrl && (
                      <div className="p-4">
                        <h2 className="text-lg font-medium text-white text-center font-poppins mb-2">Generated TTS Audio</h2>
                        <div className="bg-black p-3 rounded-md mb-3">
                          <audio controls src={outputState.audioUrl} className="w-full"
                          style={{
                            backgroundColor: 'transparent', // Ensure transparency
                            border: '2px solid white', // White border
                            borderRadius: '10px',
                            accentColor: '#fe7cff', // Theme color for progress bar
                            filter: 'invert(1) brightness(2)', // Inverts colors to make it dark-themed
                            mixBlendMode: 'difference' // Tries to blend it better with the dark theme
                          }}
                          />
                        </div>
                        <a 
                          href={outputState.audioUrl} 
                          download={`tts-output.${ttsOptions.output_format}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900"
                          style={{ backgroundColor: '#fe7cff' }}
                        >
                          Download Audio
                        </a>
                      </div>
                    )}
                      </>}
                    

                    
                  </div>
                </div>
                </BoxReveal>
                
              </div>
            </div>
          </section>
          
          {outputState.error && (
            <div className="p-4 bg-red-900 text-red-200 rounded-lg border border-red-800">
              {outputState.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Voice;