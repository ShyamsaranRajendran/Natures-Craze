// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
         rapidColorChange: {
          '0%': { color: '#F5CB58' }, // Custom yellow color
          '25%': { color: '#FF5733' }, // Red
          '50%': { color: '#33FF57' }, // Green
          '75%': { color: '#3357FF' }, // Blue
          '100%': { color: '#F5CB58' }, // Custom yellow color
        },
        'gradient-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInFromTop: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInFromBottom: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'gradient-flow': 'gradient-flow 6s ease infinite',
        'fadeIn': 'fadeIn 1.5s ease-out',
        'fadeInFromTop': 'fadeInFromTop 1s ease-out',
        'fadeInFromBottom': 'fadeInFromBottom 1s ease-out',
        'rapid-color-change': 'rapidColorChange 1s infinite',
      },
      colors: {
        customYellow: "#F5CB58", // Define your custom yellow color
      },
    },
  },
  plugins: [],
};
