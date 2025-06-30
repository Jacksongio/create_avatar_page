"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"


export default function AvatarCustomizer() {
  const [attributes, setAttributes] = useState({
    Temperature: 50,
    FREQUENCY_PENALTY: 50,
    MAX_TOKENS: 50,
    PRES_PENALTY: 50
  })

  const sliders: { key: keyof typeof attributes; label: string }[] = [
    { key: 'Temperature', label: 'Practical <> Playful' },
    { key: 'FREQUENCY_PENALTY', label: 'Predictable <———|———> Diverse' },
    { key: 'MAX_TOKENS', label: 'Brevity <> Expressive' },
    { key: 'PRES_PENALTY', label: 'Clarity <> Complexity' },
  ];
  
  const [avatarName, setAvatarName] = useState("")
  const [customization, setCustomization] = useState("")
  const [avatarGenerated, setAvatarGenerated] = useState(false)

  const handleAttributeChange = (name: string, value: number[]) => {
    setAttributes((prev) => ({
      ...prev,
      [name]: value[0],
    }))
  }

  const handleCustomizationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomization(e.target.value)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarName(e.target.value)
  }

  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const generateAvatar = async () => {
    setAvatarGenerated(true);
    setAvatarUrl(''); // clear previous image so user sees progress

    try {
      const res = await fetch('/api/generate-character-avatar', { method: 'POST' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.details || errorData.error || 'Failed to generate avatar');
      }

      const { b64_json } = await res.json();
      if (b64_json) {
        setAvatarUrl(`data:image/png;base64,${b64_json}`);
      } else {
        throw new Error('No image data returned from server.');
      }
    } catch (error) {
      console.error('Error generating avatar:', error);
      alert(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  // handles saving the attributes to the server
  const handleSubmit = async () => {
    const payload = {
      Temperature: attributes.Temperature,
      FREQUENCY_PENALTY: attributes.FREQUENCY_PENALTY,
      MAX_TOKENS: attributes.MAX_TOKENS,
      PRES_PENALTY: attributes.PRES_PENALTY,
    };

    try {
      const res = await fetch('/api/save-params', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save parameters');

      // also save the character description so CLI can use it
      const descPayload = {
        description: `${avatarName || 'Unnamed avatar'}: ${customization}`.trim(),
      };
      const descRes = await fetch('/api/description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(descPayload),
      });
      if (!descRes.ok) throw new Error('Failed to store description');

      alert('Character attributes and description saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save parameters');
    }
  };

  return (
    <div className="min-h-screen bg-[#171522] text-white p-8">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-4 text-center">Choose Your Avatar</h1>
        <h2 className="text-2xl text-[#a09cb5] mb-12 text-center">Create Your Personalized Avatar</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Avatar Display */}
          <div className="flex-1 max-w-4xl">
            <div className="aspect-square relative overflow-hidden rounded-2xl">
              {avatarGenerated ? (
                <>
                  {avatarUrl ? (
                    <>
                      <img 
                        src={avatarUrl} 
                        alt="Avatar Preview" 
                        className="w-full h-full object-cover"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-[#2e2a3d] flex flex-col items-center justify-center">
                      <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <span className="text-8xl">👤</span>
                      </div>
                    </div>
                  )}
                  
                </>
              ) : (
                <div className="w-full h-full bg-[#2e2a3d] flex flex-col items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-[#3e3a4d] rounded-full flex items-center justify-center mb-6">
                      <span className="text-4xl text-[#8e8ba7]">👤</span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#8e8ba7]">Avatar Preview</h3>
                    <p className="text-[#6e6a7d] text-sm max-w-xs">
                      Set your avatar name, adjust attributes, and add customization details to generate your
                      personalized avatar
                    </p>
                  </div>
                </div>
              )}
              
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="flex flex-col space-y-8">
            {/* Avatar Name section */}
            <Card className="bg-[#1e1b2e] border-[#2e2a3d] text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6">Avatar Name</h3>
                <Input
                  placeholder="Enter your avatar's name"
                  className="bg-[#2e2a3d] border-[#3e3a4d] text-white text-lg h-14 px-4 py-6"
                  value={avatarName}
                  onChange={handleNameChange}
                />
              </CardContent>
            </Card>

            {/* Attributes section */}
            <Card className="bg-[#1e1b2e] border-[#2e2a3d] text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-8">Attributes</h3>

                <div className="space-y-8">
                  {sliders.map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor={key} className="capitalize text-[#a09cb5] text-lg">
                          {label}
                        </Label>
                        <span className="text-lg text-[#a09cb5] font-mono font-bold">{attributes[key]}</span>
                      </div>
                      <div className="pt-2">
                        <Slider
                          id={key}
                          min={0}
                          max={100}
                          step={1}
                          value={[attributes[key]]}
                          onValueChange={(val) => handleAttributeChange(key, val)}
                          className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-black-400 [&>div]:h-3"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customize Avatar section */}
            <Card className="bg-[#1e1b2e] border-[#2e2a3d] text-white">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Customize Avatar Characteristics</h3>
                <Textarea
                  placeholder="Describe how you want your avatar acts (e.g., 'A workoholic who always puts work before play, a lazybones who never puts work before play, etc.')"
                  className="bg-[#2e2a3d] border-[#3e3a4d] text-white resize-none h-32 mb-4"
                  value={customization}
                  onChange={handleCustomizationChange}
                />
                <div className="space-y-4">
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 text-lg"
                    onClick={generateAvatar}
                  >
                    {avatarGenerated ? "Swap Character Model" : "Generate Avatar"}
                  </Button>
                  <Button
                    type="button"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg"
                    disabled={!avatarGenerated}
                    onClick={handleSubmit}
                  >
                    Save Character Description 
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
