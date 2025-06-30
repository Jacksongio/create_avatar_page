import { useState } from 'react';


export default function AvatarGenerator() {
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    setLoading(true);
    try {
      // Request avatar generation from our API route
      const response = await fetch('/api/generate-avatar-stream', {
        method: 'POST',
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data = await response.json();
      const base64 = data.data?.[0]?.b64_json as string | undefined;
      if (!base64) throw new Error('No image returned');

      // Persist concise description (optional, non-blocking)
      fetch('/api/description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: description }),
      }).catch(() => {});

      setAvatarUrl(`data:image/png;base64,${base64}`);
      setGender('N/A');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert('Failed to generate avatar: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-avatar-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: description }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data = await response.json();
      const base64 = data.data?.[0]?.b64_json as string | undefined;
      if (!base64) throw new Error('No image returned');

      // Persist concise description (optional)
      fetch('/api/description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: description }),
      }).catch(() => {});

      setAvatarUrl(`data:image/png;base64,${base64}`);
      setGender('N/A');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert('Failed to generate avatar: ' + errorMessage);
    } finally {
      setLoading(false);
    }

    try {
      const response = await fetch('/api/generate-avatar-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: description }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Request failed: ${response.status}`);
      }

      // Stream the base64 chunks coming from the server
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let base64Chunks: string[] = [];
      let buffered = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        buffered += text;
        let newlineIndex;
        while ((newlineIndex = buffered.indexOf("\n")) !== -1) {
          const line = buffered.slice(0, newlineIndex).trim();
          buffered = buffered.slice(newlineIndex + 1);
          if (!line) continue;
          if (!line) continue;
          try {
            const parsed = JSON.parse(line);
            const chunkB64 = parsed.data?.[0]?.b64_json;
            if (chunkB64) {
              base64Chunks.push(chunkB64);
            }
          } catch (err) {
            // Ignore malformed chunks
            console.warn('Failed to parse chunk', err);
          }
        }
      }

      const base64Image = base64Chunks.join('');
      if (!base64Image) throw new Error('No image data received');

      // Persist concise description (optional, backend route expected)
      fetch('/api/description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: description }),
      }).catch(() => {/* ignore */});

      setAvatarUrl(`data:image/png;base64,${base64Image}`);
      setGender('N/A');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert('Failed to generate avatar: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Generate Avatar</h2>
      
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your avatar..."
        className="w-full p-3 mb-4 border rounded"
        rows={4}
      />
      
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Avatar'}
      </button>

      {avatarUrl && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Generated Avatar</h3>
          <p className="text-gray-600 mb-4">Gender: {gender}</p>
          <img
            src={avatarUrl}
            alt="Generated Avatar"
            className="w-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

