"use client";
import { NextPage } from "next";
import React, { useContext } from "react";
import Navbar from "@/components/navBar";
import Head from "next/head";
import ChatBotButton from "@/components/ChatbotButton";
import { Toaster } from "react-hot-toast";
import { ThemeContext } from "./ThemeContext";
import RepairRequestButton from "@/components/requestbutton";

const Home: NextPage = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div>
      {/* Meta Information */}
      <Head>
        <title>Electronic Repair Platform</title>
        <meta
          name="description"
          content="We specialize in repairing electronic devices, especially screen repairs."
        />
        <meta
          name="keywords"
          content="electronic repair, screen repair, battery replacement"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main Container */}
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900 text-light" : "bg-gray-100 text-black"
        }`}
      >
        <Navbar />
        <RepairRequestButton />
        <Toaster />
        <ChatBotButton />
        <section className="bg-blue-500 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold">
              We Fix Your Electronics Quickly & Professionally
            </h2>
            <p className="mt-4 text-lg">
              Screen repairs, battery replacements, and more. Get your device
              working like new again.
            </p>
            <a
              href="#services"
              className="mt-6 inline-block bg-white text-blue-500 py-3 px-6 rounded-full shadow hover:bg-gray-100"
            >
              Explore Our Services
            </a>
          </div>
        </section>
        {/* Services Section */}

        {/* About Us Section */}
        <section id="about" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-semibold mb-8">Why Choose Us?</h3>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              We are experts in repairing electronics, offering fast, reliable,
              and affordable services. With a skilled team and quality parts, we
              ensure that your device is returned to you in perfect condition.
            </p>
          </div>
        </section>
        {/* Contact Section */}
        <section id="contact" className="py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-semibold text-center mb-8">
              Get In Touch
            </h3>
            <form className="max-w-lg mx-auto">
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Message</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  rows={5}
                ></textarea>
              </div>
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                Send Message
              </button>
            </form>
          </div>
        </section>
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p>© 2024 Repair Services. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
