"use client";
import { NextPage } from "next";
import React, { useContext } from "react";
import Navbar from "@/components/navBar";
import ChatBotButton from "@/components/ChatbotButton";
import ServiceSlider from "@/components/ServiceSlider";
import { Toaster } from "react-hot-toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "./context/ThemeContext";
import RepairRequestButton from "@/components/requestbutton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ContactForm from "@/components/forms/ContactForm";
import Reviews from "@/components/Review";
import FAQ from "@/components/FAQ";
import Footer from "@/components/footer";
import Link from "next/link";
import About from "@/components/about";

const Home: NextPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const update = () => console.log("done");
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
      <RepairRequestButton update={update} />
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
      <section
        className={`hero ${
          isDarkMode ? "dark text-white" : "light text-black"
        } py-20`}
      >
        <div className="hero-overlay"></div>
        <div className="container mx-auto px-4 text-center md:text-left flex flex-col md:flex-row items-center justify-between ">
          {/* Hero Text Section (Right Column) */}
          <div className="md:w-1/2 flex flex-col items-center text-center md:text-left z-20">
            <h2 className="text-4xl font-bold">
              نحن نصلح أجهزتك الإلكترونية بسرعة واحترافية
            </h2>
            <p className="mt-4 text-lg">
              إصلاح الشاشات، استبدال البطاريات، والمزيد. اجعل جهازك يعمل كما لو
              كان جديدًا مرة أخرى.
            </p>
            <Link
              href="/register"
              className={` ${
                isDarkMode ? "text-white" : "text-black"
              } btn mt-6`}
            >
              إنشاء حساب
            </Link>
          </div>

          {/* Slider Section (Left Column) */}
          <div className="md:w-1/2 w-full z-20  mt-8 mr-2 md:mt-0 ">
            <ServiceSlider />
          </div>
        </div>
      </section>

      <About />
      <section className="py-20">
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
        <div
          className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center lg:items-start justify-center lg:justify-between"
          style={{ minHeight: "100vh" }}
        >
          {/* مكون الفورم */}
          <div className="w-full lg:flex-1">
            <ContactForm />
          </div>

          {/* مكون الأسئلة الشائعة */}
          <div className="w-full lg:flex-1">
            <FAQ />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default Home;
