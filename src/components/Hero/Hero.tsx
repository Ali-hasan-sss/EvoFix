// components/Hero.tsx
"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ServicesSlider from "../ServicesSlider";
import styles from "./Hero.module.css"; // سنضيف الأنماط لاحقًا
import door from "./door.png";
const Hero: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const doorVariants = {
    hidden: { scale: 0.8, rotateY: -90 },
    visible: {
      scale: 1,
      rotateY: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const sliderVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 1 },
    },
  };

  return (
    <section ref={ref} className={styles.heroSection}>
      <motion.div
        className={styles.doorContainer}
        initial="hidden"
        animate={controls}
        variants={doorVariants}
      >
        <img src={door.src} alt="Door" className={styles.doorImage} />
      </motion.div>
      <motion.div
        className={styles.sliderContainer}
        initial="hidden"
        animate={controls}
        variants={sliderVariants}
      >
        <ServicesSlider />
      </motion.div>
    </section>
  );
};

export default Hero;
