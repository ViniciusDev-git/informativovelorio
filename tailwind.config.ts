import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		screens: {
			// Mobile breakpoints
			'xs': '320px',   // Small mobile
			'sm': '375px',   // Mobile
			'md': '768px',   // Tablet
			'lg': '1024px',  // Large tablet / small laptop
			'xl': '1280px',  // Desktop
			'2xl': '1920px', // Large desktop
			'3xl': '2560px', // Ultra-wide desktop
			'4k': '3840px',  // 4K TV
			'8k': '7680px',  // 8K TV (future-proofing)
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Cortel Brand Colors
				'cortel-blue': {
					dark: 'hsl(var(--cortel-blue-dark))',
					medium: 'hsl(var(--cortel-blue-medium))',
					light: 'hsl(var(--cortel-blue-light))'
				},
				'card-funeral': {
					DEFAULT: 'hsl(var(--card-funeral))',
					foreground: 'hsl(var(--card-funeral-foreground))'
				},
				'card-video': {
					DEFAULT: 'hsl(var(--card-video))',
					foreground: 'hsl(var(--card-video-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				'lato': ['Lato', 'sans-serif'],
			},
			backgroundImage: {
				'gradient-main': 'var(--gradient-main)',
				'gradient-animated': 'var(--gradient-animated)'
			},
			boxShadow: {
				'card': 'var(--shadow-card)',
				'video': 'var(--shadow-video)'
			},
			spacing: {
				'tv': 'var(--tv-padding)',
				'card-gap': 'var(--card-gap)',
				// Responsive spacing
				'xs': '0.25rem',
				'sm': '0.5rem',
				'md': '1rem',
				'lg': '1.5rem',
				'xl': '2rem',
				'2xl': '3rem',
				'3xl': '4rem',
				'4xl': '6rem',
				'5xl': '8rem',
			},
			fontSize: {
				// Responsive font sizes
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }],
				// TV specific sizes
				'tv-sm': ['1.5rem', { lineHeight: '2rem' }],
				'tv-base': ['2rem', { lineHeight: '2.5rem' }],
				'tv-lg': ['3rem', { lineHeight: '3.5rem' }],
				'tv-xl': ['4rem', { lineHeight: '4.5rem' }],
				'tv-2xl': ['6rem', { lineHeight: '6.5rem' }],
				'tv-3xl': ['8rem', { lineHeight: '8.5rem' }],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				// Responsive border radius
				'xs': '0.125rem',
				'sm': '0.25rem',
				'base': '0.375rem',
				'lg': '0.5rem',
				'xl': '0.75rem',
				'2xl': '1rem',
				'3xl': '1.5rem',
				'4xl': '2rem',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'gradient-flow': {
					'0%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					},
					'100%': {
						backgroundPosition: '0% 50%'
					}
				},
				'slide-up': {
					'0%': {
						transform: 'translateY(100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'slide-down': {
					'0%': {
						transform: 'translateY(-100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'slide-up-out': {
					'0%': {
						transform: 'translateY(0)',
						opacity: '1'
					},
					'100%': {
						transform: 'translateY(-100%)',
						opacity: '0'
					}
				},
				'slide-down-out': {
					'0%': {
						transform: 'translateY(0)',
						opacity: '1'
					},
					'100%': {
						transform: 'translateY(100%)',
						opacity: '0'
					}
				},
				'fade-in-scale': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'wheel-rotate': {
					'0%': {
						transform: 'translateY(100%) rotateX(90deg)',
						opacity: '0'
					},
					'50%': {
						transform: 'translateY(50%) rotateX(45deg)',
						opacity: '0.5'
					},
					'100%': {
						transform: 'translateY(0) rotateX(0deg)',
						opacity: '1'
					}
				},
				'wheel-rotate-out': {
					'0%': {
						transform: 'translateY(0) rotateX(0deg)',
						opacity: '1'
					},
					'50%': {
						transform: 'translateY(-50%) rotateX(-45deg)',
						opacity: '0.5'
					},
					'100%': {
						transform: 'translateY(-100%) rotateX(-90deg)',
						opacity: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gradient-flow': 'gradient-flow 20s ease-in-out infinite',
				'slide-up': 'slide-up 0.6s ease-out',
				'slide-down': 'slide-down 0.6s ease-out',
				'slide-up-out': 'slide-up-out 0.6s ease-out',
				'slide-down-out': 'slide-down-out 0.6s ease-out',
				'fade-in-scale': 'fade-in-scale 0.4s ease-out',
				'wheel-rotate': 'wheel-rotate 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'wheel-rotate-out': 'wheel-rotate-out 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			},
			// Responsive utilities
			maxWidth: {
				'xs': '20rem',
				'sm': '24rem',
				'md': '28rem',
				'lg': '32rem',
				'xl': '36rem',
				'2xl': '42rem',
				'3xl': '48rem',
				'4xl': '56rem',
				'5xl': '64rem',
				'6xl': '72rem',
				'7xl': '80rem',
				'full': '100%',
			},
			minHeight: {
				'screen-xs': '100vh',
				'screen-sm': '100vh',
				'screen-md': '100vh',
				'screen-lg': '100vh',
				'screen-xl': '100vh',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
