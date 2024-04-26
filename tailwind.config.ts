/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  theme: {
    fontFamily: {
      inter: ['"Inter"']
    },
    extend: {
      colors: {
        tagRed: {
          light: 'hsl(var(--tag-red))',
          dark: 'hsl(var(--tag-red-dark))'
        },
        tagOrange: {
          light: 'hsl(var(--tag-orange))',
          dark: 'hsl(var(--tag-orange-dark))'
        },
        tagYellow: {
          light: 'hsl(var(--tag-yellow))',
          dark: 'hsl(var(--tag-yellow-dark))'
        },
        tagGreen: {
          light: 'hsl(var(--tag-green))',
          dark: 'hsl(var(--tag-green-dark))'
        },
        tagBlue: {
          light: 'hsl(var(--tag-blue))',
          dark: 'hsl(var(--tag-blue-dark))'
        },
        tagPurple: {
          light: 'hsl(var(--tag-purple))',
          dark: 'hsl(var(--tag-purple-dark))'
        },
        tagPink: {
          light: 'hsl(var(--tag-pink))',
          dark: 'hsl(var(--tag-pink-dark))'
        },
        tagGray: {
          light: 'hsl(var(--tag-gray))',
          dark: 'hsl(var(--tag-gray-dark))'
        }
      },
      width: {
        18: '72px',
        '30p': '30%'
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(15deg)' },
          '20%': { transform: 'rotate(-15deg)' },
          '30%': { transform: 'rotate(9deg)' },
          '40%': { transform: 'rotate(-9deg)' },
          '50%': { transform: 'rotate(6deg)' },
          '60%': { transform: 'rotate(-6deg)' },
          '70%': { transform: 'rotate(2deg)' },
          '80%': { transform: 'rotate(-2deg)' },
          '90%': { transform: 'rotate(0deg)' }
        },
        bounceX: {
          '0%, 100%': {
            transform: 'translateX(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        }
      },
      animation: {
        wave: 'wave 2s infinite linear',
        bounceX: 'bounceX 1s infinite'
      }
    }
  }
}
