import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState(''); // To store the user input (prompt)
  const [audioUrl, setAudioUrl] = useState(''); // To store the audio URL
  const [story, setStory] = useState(''); // To show a story or error message

  // Function to handle generating text and audio
  const generateAudioAndText = async () => {
    setStory("📝 Generating story...");

    try {
      // Make the request to the Vercel serverless function
      const response = await axios.post(
        'https://storybuilderai-backend.vercel.app/api/storytext/', // Your Vercel function URL
        { prompt: prompt } // Send the prompt to generate text
      );

      // If the audio URL is returned
      if (response.data.audio_url) {
        setAudioUrl(response.data.audio_url); // Set the audio URL for playback
        setStory("🎶 Story generated and audio created!"); // Show success message
      } else {
        setStory("❌ Failed to generate audio.");
      }
    } catch (error) {
      console.error("Error generating text or audio:", error);
      setStory("🚨 Error generating text or audio: " + error.message);
    }
  };

  return (
    <div className="App">
      <h1>AI Story Generator with Audio</h1>

      {/* Text input for the user to provide a prompt */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your story prompt..."
        rows="4"
        cols="50"
      />

      {/* Button to trigger the generation of text and audio */}
      <button onClick={generateAudioAndText}>Generate Story</button>

      {/* Display the generated story (optional) */}
      {story && <p>{story}</p>}

      {/* Display the audio player if an audio URL is available */}
      {audioUrl && (
        <div>
          <h2>Listen to the Story:</h2>
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

export default App;
