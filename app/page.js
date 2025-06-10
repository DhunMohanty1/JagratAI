// app/page.js
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // For a horizontal line

export default function HomePage() {
  const companyName = "JagratAI";
  const tagline = "Your Smart AI Assistant for Odisha's Growth.";
  const introduction = "JagratAI is an innovative AI platform specifically designed to empower individuals and businesses in Odisha. We provide tailored, localized guidance across key sectors: startups, MSMEs, and education. Our mission is to bridge information gaps and foster growth, making essential information accessible and actionable for everyone in the state.";
  const companyGoal = "Our primary goal is to be the go-to resource for anyone seeking reliable, concise, and relevant information in Odisha, promoting economic development and educational advancement through intelligent assistance.";

  // Key areas of focus for your AI
  const focusAreas = [
    {
      title: "Startup Guidance",
      description: "Get essential, concise advice for launching and scaling your venture in Odisha. From registration to funding, we cover it all.",
    },
    {
      title: "MSME Support",
      description: "Navigate government schemes, secure financing, and optimize operations for your Micro, Small, and Medium Enterprises.",
    },
    {
      title: "Education & Study",
      description: "Find answers to academic queries, explore career opportunities, and access valuable study resources relevant to Odisha's educational landscape.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-blue-50">
      {/* Navbar (Simple Header for Homepage) */}
      <nav className="w-full bg-white border-b py-4 px-4 md:px-8 flex justify-between items-center shadow-sm">
        <Link href="/" passHref>
          <div className="text-2xl font-bold text-blue-900 cursor-pointer">
            {companyName}
          </div>
        </Link>
        {/* This button redirects to your chatbot page */}
        <Link href="/chatbot" passHref>
          <Button>Access AI Assistant</Button>
        </Link>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <section className="text-center py-12 md:py-20 bg-blue-50 rounded-xl shadow-md mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 leading-tight mb-4">
            {companyName}: <span className="text-blue-700">{tagline}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
            {introduction}
          </p>
          {/* Main Call to Action Button */}
          <Link href="/chatbot" passHref>
            <Button size="lg" className="px-8 py-3 text-lg bg-blue-700 hover:bg-blue-800 transition-colors duration-300">
              Launch JagratAI Assistant
            </Button>
          </Link>
        </section>

        <Separator className="my-12 bg-blue-200" />

        {/* Company Goal Section */}
        <section className="py-12 md:py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
            Our Vision for Odisha
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
            {companyGoal}
          </p>
        </section>

        <Separator className="my-12 bg-blue-200" />

        {/* Focus Areas Section */}
        <section className="py-12 md:py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center mb-8">
            How JagratAI Helps You
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {focusAreas.map((area, index) => (
              <Card key={index} className="bg-white shadow-lg border-blue-200 border-2 hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-blue-700">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700 leading-relaxed">
                    {area.description}
                  </CardDescription>
                  {/* Each card also links to the chatbot page */}
                  <Link href="/chatbot" passHref>
                    <Button variant="link" className="mt-4 pl-0 text-blue-600 hover:text-blue-800">
                      Explore {area.title} &rarr;
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action (Repeat) */}
        <section className="text-center py-12 md:py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Ready to Experience Smart Guidance?
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Join the growing community of entrepreneurs, businesses, and students leveraging JagratAI for success in Odisha.
          </p>
          <Link href="/chatbot" passHref>
            <Button size="lg" className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700 transition-colors duration-300">
              Get Started with JagratAI
            </Button>
          </Link>
        </section>
      </main>

      {/* Basic Footer */}
      <footer className="w-full border-t bg-white py-6 md:py-8 mt-12 text-sm text-gray-600 text-center">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          <p className="text-xs text-gray-500 mt-2">
            Built with ❤️ for the people of Odisha.
          </p>
        </div>
      </footer>
    </div>
  );
}