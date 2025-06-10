// components/JagratAIPage.jsx (or wherever your component is located)
"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"; // Assuming these paths are correct
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Mic, Menu } from "lucide-react";
import { motion } from "framer-motion";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function JagratAIPage() {
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState("startup");
  const [language, setLanguage] = useState("en");

  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setQuery(transcript);
  }, [transcript]);

  // Removed getSectionPrompt and getLangNote from client-side
  // as they are now used on the server

  const formatReply = (text) => {
    return text.split('**').map((segment, index) =>
      index % 2 === 1 ? (
        <strong key={index} className="font-semibold text-blue-700">
          {segment}
        </strong>
      ) : (
        segment
      )
    );
  };

  const handleAsk = async () => {
    if (!query.trim()) return; // Added .trim() for better validation
    setLoading(true);
    setReply(""); // Clear previous reply

    try {
      const res = await fetch("/api/ask", { // Call your new API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          section,
          language,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch response');
      }

      const data = await res.json();
      setReply(data.reply);

    } catch (error) {
      console.error("Error asking JagratAI:", error);
      setReply(`Sorry, something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
      resetTranscript();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reply);
    // Optionally, add a small visual feedback like a "Copied!" message
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-100 flex">
      {/* Mobile Sidebar */}
      <div className="md:hidden p-4 absolute top-4 left-4 z-10">
        <Sheet>
          <SheetTrigger>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="space-y-4 mt-8">
              <Button
                variant={section === "startup" ? "default" : "outline"}
                className="w-full"
                onClick={() => setSection("startup")}
              >
                Startup
              </Button>
              <Button
                variant={section === "msme" ? "default" : "outline"}
                className="w-full"
                onClick={() => setSection("msme")}
              >
                MSME
              </Button>
              <Button
                variant={section === "study" ? "default" : "outline"}
                className="w-full"
                onClick={() => setSection("study")}
              >
                Study
              </Button>
              <div className="pt-4">
                <select
                  className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="or">Odia</option>
                </select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-8">JagratAI</h2>
        <div className="space-y-4">
          <Button
            variant={section === "startup" ? "default" : "outline"}
            className="w-full"
            onClick={() => setSection("startup")}
          >
            Startup
          </Button>
          <Button
            variant={section === "msme" ? "default" : "outline"}
            className="w-full"
            onClick={() => setSection("msme")}
          >
            MSME
          </Button>
          <Button
            variant={section === "study" ? "default" : "outline"}
            className="w-full"
            onClick={() => setSection("study")}
          >
            Study
          </Button>
          <div className="pt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Language
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="or">Odia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="p-6 pb-0 md:p-8 md:pb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900">JagratAI</h1>
          <p className="text-lg text-gray-700 mt-2">
            Odisha-specific {section.charAt(0).toUpperCase() + section.slice(1)} Assistance
          </p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col p-6 md:p-8"
        >
          {/* Answer Display Area */}
          <div className="flex-1 mb-6 overflow-y-auto">
            {reply && (
              <Card className="h-full shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-blue-700">Response</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-blue max-w-none">
                    <p className="whitespace-pre-wrap text-gray-800 text-base leading-relaxed">
                      {formatReply(reply)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Input Area */}
          <Card className="shadow-xl rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col gap-4">
                <Textarea
                  placeholder={`Ask about ${section} in Odisha...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[100px]"
                  disabled={loading}
                />
                <div className="flex gap-2 justify-between">
                  <Button
                    onClick={() => SpeechRecognition.startListening({
                      continuous: false,
                      language: language === "or" ? "or-IN" : language === "hi" ? "hi-IN" : "en-IN"
                    })}
                    variant="outline"
                    size="icon"
                    disabled={listening || loading}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleAsk}
                    disabled={loading || !query.trim()}
                    className="flex-1"
                  >
                    {loading ? (
                      <span>Processing...</span>
                    ) : (
                      <span>Ask JagratAI ({section.charAt(0).toUpperCase() + section.slice(1)})</span>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}