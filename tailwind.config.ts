/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  theme: {
    fontFamily: {
      inter: ['"Inter"']
    },
    extend: {
      colors: {
        tagCashew: {
          light: 'hsl(var(--tag-cashew))',
          dark: 'hsl(var(--tag-cashew-dark))'
        },
        tagBrass: {
          light: 'hsl(var(--tag-brass))',
          dark: 'hsl(var(--tag-brass-dark))'
        },
        tagRedwood: {
          light: 'hsl(var(--tag-redwood))',
          dark: 'hsl(var(--tag-redwood-dark))'
        },
        tagLeather: {
          light: 'hsl(var(--tag-leather))',
          dark: 'hsl(var(--tag-leather-dark))'
        },
        tagApricot: {
          light: 'hsl(var(--tag-apricot))',
          dark: 'hsl(var(--tag-apricot-dark))'
        },
        tagCamel: {
          light: 'hsl(var(--tag-camel))',
          dark: 'hsl(var(--tag-camel-dark))'
        },
        tagOcean: {
          light: 'hsl(var(--tag-ocean))',
          dark: 'hsl(var(--tag-ocean-dark))'
        },
        tagNight: {
          light: 'hsl(var(--tag-night))',
          dark: 'hsl(var(--tag-night-dark))'
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
