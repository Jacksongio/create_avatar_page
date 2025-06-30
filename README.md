# Custom Avatar Builder

A Next.js application for creating personalized avatars with custom attributes and styling.

## Features

- **Avatar Customization**: Create personalized avatars with custom names and descriptions
- **Attribute System**: Adjust 5 different attributes (Strength, Intelligence, Charisma, Creativity, Humor) using interactive sliders
- **Real-time Preview**: See your avatar preview in a 1024x1024 square display
- **Dark Theme**: Modern dark UI matching gaming aesthetics
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository or download the project files
2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page component
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── slider.tsx
│   │   └── textarea.tsx
│   └── avatar-customizer.tsx # Main avatar customizer component
├── lib/
│   └── utils.ts             # Utility functions
├── next.config.mjs          # Next.js configuration
├── package.json             # Dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
\`\`\`

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

The avatar customizer includes:

- **Name Input**: Set your avatar's display name
- **Attribute Sliders**: Adjust 5 different character attributes (0-100 scale)
- **Description Field**: Describe your avatar's appearance and personality
- **Generate Button**: Create your avatar preview

## Future Enhancements

- AI-powered avatar generation
- Export functionality for avatar images
- Avatar gallery and saving system
- Additional customization options
- Social sharing features

## License

This project is open source and available under the MIT License.
