import React, { useState } from "react";
import axios from "axios";

const StoryGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    setLoading(true);
    setStory("");
    setAudioUrl("");

    try {
      // Requesting the story from Hugging Face API or other source
      const storyResponse = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer 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", // Replace with your Hugging Face API key
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: prompt }), // Your story prompt here
        }
      );
      const storyData = await storyResponse.json();
      
      // Handle story generation output
      if (storyData && storyData[0]?.generated_text) {
        const generatedStory = storyData[0].generated_text;
        setStory(generatedStory); // Set generated story
        await generateAudio(generatedStory); // Generate audio based on the story
      } else {
        setStory("Oops! Something went wrong.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setStory("🚨 Network error: " + error.message);
    }

    setLoading(false);
  };

  // Function to generate audio using Eleven Labs TTS
  const generateAudio = async (generatedStory) => {
    try {
      const audioResponse = await axios.post(
        "https://api.elevenlabs.io/v1/text-to-speech", // Endpoint for Eleven Labs API
        {
          text: generatedStory,
          voice: "en_us_male", // Choose the voice from Eleven Labs
        },
        {
          headers: {
            Authorization: `Bearer sk_c7442d70435a1ee4d13aa1f4f58945701b2b4d95ef4087c2`, // Replace with your Eleven Labs API key
            "Content-Type": "application/json",
          },
        }
      );

      if (audioResponse.data && audioResponse.data.audio_url) {
        setAudioUrl(audioResponse.data.audio_url); // Set the audio URL for playback
      } else {
        setStory("❌ Failed to generate audio.");
      }
    } catch (error) {
      console.error("Audio generation error:", error);
      setStory("🚨 Error generating audio: " + error.message);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-2">📝 Story Generator</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Start your story: Once upon a time..."
        className="w-full p-2 border rounded"
        rows={4}
      />
      <button
        onClick={generateStory}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Generate Story
      </button>

      {loading && <p className="mt-2">Generating story...</p>}

      {story && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <h3 className="font-semibold">Your Story:</h3>
          <p>{story}</p>
          {audioUrl && (
            <div>
              <h4 className="font-semibold">Listen to the story:</h4>
              <audio controls>
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoryGenerator;
