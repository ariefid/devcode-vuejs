/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#16ABF8",
            },
        },
    },
    plugins: [],
};
