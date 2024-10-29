"use client";
import { NextPage } from "next";
import React, { useContext } from "react";
import Navbar from "@/components/navBar";
import Head from "next/head";
import ChatBotButton from "@/components/ChatbotButton";
import ServiceSlider from "@/components/ServiceSlider";
import { Toaster } from "react-hot-toast";
import { ThemeContext } from "./ThemeContext";
import RepairRequestButton from "@/components/requestbutton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ContactForm from "@/components/forms/ContactForm";
import Reviews from "@/components/Review";
import FAQ from "@/components/FAQ";
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
        {/********************************/}
        <Navbar />
        <RepairRequestButton />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: isDarkMode ? "#333" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
              fontSize: "14px",
            },
          }}
        />
        <ChatBotButton />
        <section className="bg-blue-500 text-white py-20 hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold">
              We Fix Your Electronics Quickly & Professionally
            </h2>
            <p className="mt-4 text-lg">
              Screen repairs, battery replacements, and more. Get your device
              working like new again.
            </p>
          </div>
        </section>
        {/* Services Section */}
        <ServiceSlider />
        {/* About Us Section */}
        <section id="about" className="py-20">
          <div
            className={`container mx-auto px-4 text-center${
              isDarkMode ? "bg-gray-900 text-light" : "bg-gray-400 text-black"
            }`}
          >
            <h3 className="text-3xl font-semibold mb-8">Why Choose Us?</h3>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              We are experts in repairing electronics, offering fast, reliable,
              and affordable services. With a skilled team and quality parts, we
              ensure that your device is returned to you in perfect condition.
            </p>
          </div>
        </section>
        <section>
          {/* Reviews Section */}
          <Reviews />
        </section>
        {/* Contact Section */}
        <section
          id="contact"
          className={`py-20 my-5 ${
            isDarkMode ? "bg-gray-800 text-light" : "bg-blue-200 text-black"
          }`}
        >
          <ContactForm />
          <FAQ />
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
