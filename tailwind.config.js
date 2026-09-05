import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                dwo: {
                    bg: '#0b0b0c',
                    elevated: '#141416',
                    soft: '#18181b',
                    accent: '#e8ff47',
                    danger: '#e11d48',
                },
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                display: ['"Bebas Neue"', 'Impact', 'Haettenschweiler', 'sans-serif'],
            },
            maxWidth: {
                '8xl': '88rem',
            },
        },
    },

    plugins: [forms],
};
