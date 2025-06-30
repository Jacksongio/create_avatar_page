"use client"

import type React from "react"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function AvatarCustomizer() {
  const [attributes, setAttributes] = useState({
    strength: 50,
    intelligence: 50,
    charisma: 50,
    creativity: 50,
    humor: 50,
  })

  const [avatarName, setAvatarName] = useState("")
  const [avatarGenerated, setAvatarGenerated] = useState(false)

  const handleAttributeChange = (name: string, value: number[]) => {
    setAttributes((prev) => ({
      ...prev,
      [name]: value[0],
    }))
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarName(e.target.value)
  }

  const generateAvatar = () => {
    setAvatarGenerated(true)
  }

  return (
    <div className="min-h-screen bg-[#171522] text-white p-6">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Avatar</h1>
        <h2 className="text-xl text-[#a09cb5] mb-8 text-center">Create Your Personalized Avatar</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Avatar Display */}
          <Card className="bg-[#1e1b2e] border-[#2e2a3d] text-white flex-1 max-w-2xl">
            <CardContent className="p-0 aspect-square relative overflow-hidden rounded-lg">
              {avatarGenerated ? (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 relative flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1024&width=1024')] bg-cover bg-center opacity-60"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full mb-4 mx-auto flex items-center justify-center backdrop-blur-sm">
                      <span className="text-4xl">👤</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{avatarName || "Your Avatar"}</h3>
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 max-w-xs">
                      <p className="text-sm opacity-90">
                        A unique avatar created with your attributes
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3">
                      <div className="grid grid-cols-5 gap-2 text-xs">
                        {Object.entries(attributes).map(([name, value]) => (
                          <div key={name} className="text-center">
                            <div className="capitalize font-semibold">{name.slice(0, 3)}</div>
                            <div className="text-yellow-300">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
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
            </CardContent>
          </Card>

          {/* Right side - Controls */}
          <div className="flex flex-col space-y-6">
            {/* Avatar Name section */}
            <Card className="bg-[#1e1b2e] border-[#2e2a3d] text-white">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Avatar Name</h3>
                <Input
                  placeholder="Enter your avatar's name"
                  className="bg-[#2e2a3d] border-[#3e3a4d] text-white"
                  value={avatarName}
                  onChange={handleNameChange}
                />
              </CardContent>
            </Card>

            {/* Attributes section */}
            <Card className="bg-[#1e1b2e] border-[#2e2a3d] text-white">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Attributes</h3>

                <div className="space-y-6">
                  {Object.entries(attributes).map(([name, value]) => (
                    <div key={name} className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor={name} className="capitalize text-[#a09cb5]">
                          {name}
                        </Label>
                        <span className="text-sm text-[#a09cb5] font-mono">{value}</span>
                      </div>
                      <Slider
                        id={name}
                        min={0}
                        max={100}
                        step={1}
                        value={[value]}
                        onValueChange={(val) => handleAttributeChange(name, val)}
                        className="[&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-400"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generate Avatar Button */}
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 text-lg"
              onClick={generateAvatar}
              disabled={!avatarName.trim()}
            >
              {avatarGenerated ? "Regenerate Avatar" : "Generate Avatar"}
            </Button>
            {!avatarName.trim() && (
              <p className="text-sm text-[#8e8ba7] mt-2 text-center">Please enter an avatar name to generate</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
