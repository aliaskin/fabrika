import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: '#e5e7eb',
        primary: '#ff611a',
        'primary-foreground': '#ffffff',
        accent: '#ff611a',
        'accent-foreground': '#ffffff',
        ring: '#ff611a'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(20, 28, 42, 0.08)',
        glow: '0 0 0 1px rgba(23, 63, 97, 0.12), 0 24px 60px rgba(15, 24, 38, 0.16)'
      },
      backgroundImage: {
        'grain-subtle':
          'radial-gradient(circle at 1px 1px, rgba(16, 23, 35, 0.08) 1px, transparent 0)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'marquee-left': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.28s ease-out',
        'accordion-up': 'accordion-up 0.22s ease-out',
        marquee: 'marquee-left 24s linear infinite'
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        display: ['var(--font-fraunces)', 'serif'],
        yesteryear: ['var(--font-yesteryear)', 'cursive']
      }
    }
  },
  plugins: []
};

export default config;