import React, { useEffect } from "react";
import DevLogoD from "../assets/dark.jpeg"; // Light theme logo
import DevLogo from "../assets/white.jpeg"; // Dark theme logo
import { useNavigate } from "react-router-dom";
const AboutCodelancing = () => {
    const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-container p-6 md:p-12 bg-white  text-gray-800  font-light mt-10">
      {/* Logo Section */}
      <div className="logo-container flex justify-center p-3 mb-6">
        {/* Conditional rendering based on theme */}
        <img
          src={DevLogo}
          alt="Codelancing Technologies Logo Light"
          className="w-30 h-auto rounded-lg dark:hidden"
        />
        <img
          src={DevLogoD}
          alt="Codelancing Technologies Logo Dark"
          className="w-30 h-auto rounded-lg hidden dark:block"
        />
      </div>
      <h6 className="text-2xl font-bold text-gray-800 mb-4 flex items-center text-center md:text-left">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-800 mr-4 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring focus:ring-gray-300"
          aria-label="Go Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        Welcome to Codelancing Technologies
      </h6>
      <p className="mb-6 text-base sm:text-lg md:text-xl leading-relaxed">
        Where innovation meets flexibility. We are a dynamic and
        forward-thinking company dedicated to redefining how technology
        solutions are delivered. Breaking away from traditional methodologies,
        we embrace an unstructured approach that allows us to adapt to the
        unique needs of every project.
      </p>
      <p className="mb-6 text-base sm:text-lg md:text-xl leading-relaxed">
        At Codelancing Technologies, we operate on a freelancing model, bringing
        together a diverse pool of talented professionals from across the globe.
        This enables us to assemble the perfect team for each project, ensuring
        top-notch quality and fresh perspectives. From e-commerce solutions to
        bespoke software development, our passion lies in turning your ideas
        into reality.
      </p>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-10 mb-4 text-center md:text-left">
        Our Mission
      </h2>
      <p className="mb-6 text-base sm:text-lg md:text-xl leading-relaxed">
        To empower businesses with cutting-edge solutions while fostering a
        culture of creativity and collaboration. We believe in pushing
        boundaries, challenging norms, and delivering results that exceed
        expectations.
      </p>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-10 mb-4 text-center md:text-left">
        Managing Directors
      </h2>
      <ul className="list-disc ml-8 mb-6 text-base sm:text-lg md:text-xl">
        <li>
          <strong>Aditya Balasubramaniam</strong> (Founder & CTO)
        </li>
        <li>
          <strong>Mounesh Raja</strong> (CEO)
        </li>
      </ul>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-10 mb-4 text-center md:text-left">
        Contact
      </h2>
      <p className="mb-6 text-base sm:text-lg md:text-xl leading-relaxed">
        Email:{" "}
        <a
          href="mailto:codelancingtechnologies@gmail.com"
          className="text-blue-500 dark:text-blue-400"
          aria-label="Email Codelancing Technologies"
        >
          codelancingtechnologies@gmail.com
        </a>
        <br /> Instagram:{" "}
        <a
          href="https://instagram.com/codelancing_technologies_"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 dark:text-blue-400"
          aria-label="Visit Codelancing Technologies Instagram"
        >
          @codelancing_technologies_
        </a>
        <br /> Website:{" "}
        <a
          href="https://codelancing.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 dark:text-blue-400"
          aria-label="Visit Codelancing Technologies Website"
        >
          codelancing.in
        </a>
        <p className="text-base sm:text-lg md:text-xl text-red-500 mt-2">
          *Site Under Construction*
        </p>
      </p>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-10 mb-4 text-center md:text-left">
        Rights
      </h2>
      <p className="mb-6 text-base sm:text-lg md:text-xl leading-relaxed">
        At Codelancing Technologies, we are committed to transparency and open
        collaboration. The content, images, and resources provided on our
        platform are fully open-sourced, fostering innovation and creativity
        within the community.
      </p>
      <p className="mb-6 text-base sm:text-lg md:text-xl leading-relaxed">
        While all materials are free to use, we encourage proper attribution to
        maintain the spirit of shared knowledge. Unauthorized redistribution,
        commercial use, or modification without acknowledgment may be subject to
        review under our usage policies.
      </p>
      <p className="text-base sm:text-lg md:text-xl leading-relaxed">
        Together, let's build a future where technology empowers everyone.
      </p>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-10 mb-4 text-center md:text-left">
        Developer Credits
      </h2>
      <p className="text-base sm:text-lg md:text-xl">
        GitHub:{" "}
        <a
          href="https://github.com/ShyamsaranRajendran"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 dark:text-blue-400"
          aria-label="Shyamsaran Rajendran GitHub Profile"
        >
          Shyamsaran Rajendran
        </a>
      </p>
    </div>
  );
};

export default AboutCodelancing;
