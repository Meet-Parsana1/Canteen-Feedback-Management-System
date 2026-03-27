/** @type {import('tailwindcss').Config} */
export default {
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      theme: {
            extend: {
                  colors: {
                        primary: '#139E9C',
                        primaryDark: '#0E7C7B',
                        primaryLight: '#E6F6F5',
                  },
            },
      },
      plugins: [],
};
