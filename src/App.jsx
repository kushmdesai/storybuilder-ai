import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const headers = {
        'Content-Type': 'application/json'
      }
      let data = JSON.stringify({
        "input_text": "write a short story about prom in school"
      });
      const res = await axios.post('https://hackathon-practice2025.onrender.com/api/generate/', data, { headers: headers });
      setResponse(res.data.response);
    } catch (err) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
       <div>

<Card style={{ width: '100%' }}>
  <Card.Body>
    <Card.Title>Your Story</Card.Title>
    <Card.Text>
     <h1>Hackathon Project - AI Prompt</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Enter your prompt:
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here"
            required
          />
        </label>
        <button type="submit" disabled={loading}>Submit</button>
      </form>
    </Card.Text>
   
  </Card.Body>
</Card>
</div>
      

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {response && (
        <div>

          <Card style={{ width: '100%' }}>
            <Card.Body>
              <Card.Title>Your Story</Card.Title>
              <Card.Text>
                {response}
              </Card.Text>
             
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default App;
