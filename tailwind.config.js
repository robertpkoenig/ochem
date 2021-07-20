const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                'poppins': ['Poppins', 'sans-serif'],
            },
            width: {
                '700': '700px',
                '40': '40px',
            },
            height: {
                '40': '40px',
            },
            translate: {
                'n50': "-50%"
            },
        },
    },
    variants: {
        extend: {
            visibility: ['group-hover'],
            backgroundColor: ['disabled'],
            cursor: ['disabled']
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
