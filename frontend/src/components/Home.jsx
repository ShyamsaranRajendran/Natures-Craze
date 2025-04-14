import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pouring from "../assets/pouring.jpg";
import logo2Img from "../assets/logo2.jpg";
import fssaiImg from "../assets/fssai.png";
import QImg from "../assets/quality.png";
import satImg from "../assets/sat.png";
import achImg from "../assets/achieve.png";
import pureImg from "../assets/pure.png";
import {
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Leaf,
  Award,
  Shield,
  Sun,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.5]);

  // InView hooks for animations
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [productsRef, productsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [testimonialRef, testimonialInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Reduced splash time for better UX
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setIsLoggedIn(false);
    window.location.reload();
  };

  const toggleCategory = (index) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  // Splash Screen with enhanced animation
  if (showSplash) {
    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 bg-white z-50 flex items-center justify-center"
          onClick={() => setShowSplash(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="text-center cursor-pointer"
          >
            <motion.img 
              src={logo2Img}  
              alt="Nature's Craze Logo" 
              className="w-72 h-72 mx-auto mb-6 object-contain"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ 
                y: { 
                  duration: 1.2, 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  ease: "easeInOut" 
                }
              }}
            />
            <motion.h1 
              className="text-5xl font-bold text-amber-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Nature's Craze
            </motion.h1>
            <motion.p 
              className="mt-4 text-xl text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Pure Turmeric Products
            </motion.p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden" ref={containerRef}>
      {/* Hero Section with advanced animations */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-white"
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: heroInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: heroInView ? 0 : 50, opacity: heroInView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >

             {/* Added Company Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : -20 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-8"
      >
        <img 
          src={logo2Img}  
          alt="Nature's Craze Logo" 
          className="w-40 h-40 mx-auto object-contain"
        />
      </motion.div>
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: heroInView ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Pure & Natural <br />
              <motion.span 
                className="text-amber-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: heroInView ? 1 : 0, x: heroInView ? 0 : -20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Turmeric Products
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Experience the authentic goodness of traditionally processed
              turmeric, crafted with care for your health and wellness.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: heroInView ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <Link
                to="/products"
                className="px-8 py-4 bg-amber-600 text-white text-lg font-medium rounded-full hover:bg-amber-700 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center group shadow-lg shadow-amber-100"
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => navigate("/about")}
                className="px-8 py-4 bg-white text-gray-900 text-lg font-medium rounded-full hover:bg-gray-50 transition-all duration-300 border border-gray-200 shadow-sm"
              >
                Learn More
              </button>
            </motion.div>
          </motion.div>
          
          {/* Animated decorative elements */}
          <motion.div 
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-200 opacity-20 mix-blend-multiply filter blur-3xl"
            style={{ y: y1 }}
          />
          <motion.div 
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber-400 opacity-20 mix-blend-multiply filter blur-3xl"
            style={{ y: y2 }}
          />
        </div>
        
        {/* Product showcase with parallax */}
        <motion.div 
          className="max-w-7xl mx-auto px-6 lg:px-8 pb-32"
          style={{ opacity }}
        >
          <motion.div 
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            whileHover={{ scale: 1.01 }}
          >
            <img
              src={Pouring}
              alt="Turmeric Products"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Logo Cloud Section with staggered animations */}
      <motion.div 
  className="bg-gray-50 py-20"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <motion.h3
      className="text-center text-3xl font-bold text-gray-800 mb-16"
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8,
        delay: 0.2,
        type: "spring",
        stiffness: 100
      }}
    >
      Certified & Authorized
    </motion.h3>
    
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10 items-center justify-center">
      {/* FSSAI Badge */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 20 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.8,
          delay: 0.3,
          type: "spring",
          bounce: 0.4
        }}
        whileHover={{ 
          scale: 1.1,
          transition: { duration: 0.3 }
        }}
        className="flex flex-col items-center"
      >
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-40 w-40 flex items-center justify-center hover:shadow-xl transition-all">
          <img 
            src={fssaiImg} 
            alt="FSSAI Certified" 
            className="h-24 w-auto object-contain"
          />
        </div>
        <motion.p 
          className="mt-4 text-lg font-semibold text-gray-700"
          whileHover={{ color: "#d97706" }}
          transition={{ duration: 0.3 }}
        >
          FSSAI Certified
        </motion.p>
      </motion.div>

      {/* Quality Badge */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 20 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.8,
          delay: 0.4,
          type: "spring",
          bounce: 0.4
        }}
        whileHover={{ 
          scale: 1.1,
          transition: { duration: 0.3 }
        }}
        className="flex flex-col items-center"
      >
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-40 w-40 flex items-center justify-center hover:shadow-xl transition-all">
          <img 
            src={QImg} 
            alt="Quality Certified" 
            className="h-24 w-auto object-contain"
          />
        </div>
        <motion.p 
          className="mt-4 text-lg font-semibold text-gray-700"
          whileHover={{ color: "#d97706" }}
          transition={{ duration: 0.3 }}
        >
          Quality Certified
        </motion.p>
      </motion.div>

      {/* Satisfaction Badge */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 20 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.8,
          delay: 0.5,
          type: "spring",
          bounce: 0.4
        }}
        whileHover={{ 
          scale: 1.1,
          transition: { duration: 0.3 }
        }}
        className="flex flex-col items-center"
      >
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-40 w-40 flex items-center justify-center hover:shadow-xl transition-all">
          <img 
            src={satImg} 
            alt="Satisfaction Guaranteed" 
            className="h-24 w-auto object-contain"
          />
        </div>
        <motion.p 
          className="mt-4 text-lg font-semibold text-gray-700"
          whileHover={{ color: "#d97706" }}
          transition={{ duration: 0.3 }}
        >
          Satisfaction Guaranteed
        </motion.p>
      </motion.div>

      {/* Achievement Badge */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 20 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.8,
          delay: 0.6,
          type: "spring",
          bounce: 0.4
        }}
        whileHover={{ 
          scale: 1.1,
          transition: { duration: 0.3 }
        }}
        className="flex flex-col items-center"
      >
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-40 w-40 flex items-center justify-center hover:shadow-xl transition-all">
          <img 
            src={achImg} 
            alt="Achievement Badge" 
            className="h-24 w-auto object-contain"
          />
        </div>
        <motion.p 
          className="mt-4 text-lg font-semibold text-gray-700"
          whileHover={{ color: "#d97706" }}
          transition={{ duration: 0.3 }}
        >
          Achievement Award
        </motion.p>
      </motion.div>

      {/* Pure Badge */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 20 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.8,
          delay: 0.7,
          type: "spring",
          bounce: 0.4
        }}
        whileHover={{ 
          scale: 1.1,
          transition: { duration: 0.3 }
        }}
        className="flex flex-col items-center"
      >
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-40 w-40 flex items-center justify-center hover:shadow-xl transition-all">
          <img 
            src={pureImg} 
            alt="100% Pure" 
            className="h-24 w-auto object-contain"
          />
        </div>
        <motion.p 
          className="mt-4 text-lg font-semibold text-gray-700"
          whileHover={{ color: "#d97706" }}
          transition={{ duration: 0.3 }}
        >
          100% Pure
        </motion.p>
      </motion.div>
    </div>

    {/* Additional animated certification text */}
    <motion.div
      className="mt-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6 }}
    >
      <p className="text-gray-600 max-w-3xl mx-auto">
        Our products meet the highest standards of quality and purity, certified by leading 
        international organizations for your peace of mind.
      </p>
    </motion.div>
  </div>
</motion.div>

      {/* Features Section with elegant animations */}
      <motion.div 
        className="py-20 px-6 lg:px-8 bg-white"
        ref={featuresRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: featuresInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: featuresInView ? 0 : 50, opacity: featuresInView ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: featuresInView ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Why Choose Our Turmeric?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: featuresInView ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              We combine traditional wisdom with modern quality standards to bring you the finest turmeric products.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-12">
              {[
                {
                  icon: <Leaf className="w-6 h-6 text-amber-600" />,
                  title: "100% Organic",
                  description:
                    "Sourced from certified organic farms with sustainable practices",
                },
                {
                  icon: <Award className="w-6 h-6 text-amber-600" />,
                  title: "Premium Quality",
                  description:
                    "Cold-ground to preserve natural oils and nutrients",
                },
              ].map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex"
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2,
                    type: "spring",
                    damping: 10
                  }}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 mr-6">
                    <motion.div 
                      className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-50"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="space-y-12">
              {[
                {
                  icon: <Shield className="w-6 h-6 text-amber-600" />,
                  title: "Lab Tested",
                  description: "Verified for purity and curcumin content",
                },
                {
                  icon: <Sun className="w-6 h-6 text-amber-600" />,
                  title: "Traditional Process",
                  description: "Following age-old methods for authentic results",
                },
              ].map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex"
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2,
                    type: "spring",
                    damping: 10
                  }}
                  whileHover={{ x: -5 }}
                >
                  <div className="flex-shrink-0 mr-6">
                    <motion.div 
                      className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-50"
                      whileHover={{ rotate: -10, scale: 1.1 }}
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Products Section with card animations */}
      <motion.div 
        className="py-20 px-6 lg:px-8 bg-gray-50"
        ref={productsRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: productsInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: productsInView ? 0 : 50, opacity: productsInView ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Premium Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Carefully crafted turmeric products for every need
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Unboiled Turmeric Powder",
                description:
                  "Pure, raw turmeric powder processed without heat for maximum potency",
                features: [
                  "Maximum curcumin content",
                  "Bright yellow color",
                  "Versatile uses"
                ],
                cta: "Shop Unboiled"
              },
              {
                title: "Organic Boiled Turmeric",
                description:
                  "Traditionally processed turmeric with enhanced color and aroma",
                features: [
                  "Enhanced bioavailability",
                  "Rich golden color",
                  "Traditional preparation"
                ],
                cta: "Shop Boiled"
              },
              {
                title: "Golden Milk Blend",
                description: "Premium turmeric blend with complementary spices",
                features: [
                  "Ready-to-use mix",
                  "Includes black pepper",
                  "Delicious flavor"
                ],
                cta: "Shop Golden Milk"
              },
            ].map((product, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 80
                }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <div className="p-8">
                  <motion.div 
                    className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center mb-6"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1 }}
                  >
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{product.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start"
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <Check className="flex-shrink-0 w-5 h-5 text-amber-500 mr-2 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <Link
                    to="/products"
                    className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center group"
                  >
                    {product.cta}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Testimonial Section with floating animation */}
      <motion.div 
        className="py-20 px-6 lg:px-8 bg-white"
        ref={testimonialRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: testimonialInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="h-12 w-12 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: testimonialInView ? 1 : 0 }}
            transition={{ 
              type: "spring",
              stiffness: 150,
              damping: 10,
              delay: 0.2
            }}
          >
            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </motion.div>
          <motion.blockquote 
            className="text-2xl md:text-3xl font-medium text-gray-900 mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: testimonialInView ? 0 : 50, opacity: testimonialInView ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            "Nature's Craze turmeric has transformed my daily routine. The quality is unmatched and the health benefits are noticeable within weeks."
          </motion.blockquote>
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: testimonialInView ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
          
           
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section with pulse animation */}
      <motion.div 
        className="bg-amber-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to experience the difference?
            </motion.h2>
            <motion.p 
              className="text-xl text-amber-100 max-w-3xl mx-auto mb-10"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join thousands of satisfied customers who have made our turmeric products part of their daily wellness routine.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                to="/products"
                className="px-8 py-4 bg-white text-amber-600 text-lg font-medium rounded-full hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center group shadow-lg relative overflow-hidden"
              >
                <motion.span 
                  className="relative z-10 flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.span>
                <motion.div 
                  className="absolute inset-0 bg-white opacity-20 rounded-full"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </Link>
              <motion.button
                onClick={() => navigate("/about")}
                className="px-8 py-4 bg-transparent text-white text-lg font-medium rounded-full hover:bg-amber-700 transition-all duration-300 border border-white relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative z-10">Learn More</span>
                <motion.div 
                  className="absolute inset-0 bg-white opacity-10 rounded-full"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.2, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;