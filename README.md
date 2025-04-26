# Space-Themed Landing Page — "Cartoon Galaxy UX"

A playful, immersive, and intuitive space-themed experience that merges cartoon visuals with lightweight 3D interactivity using HTML/CSS, JavaScript, and Three.js.

## 🚀 Features

- **Immersive Starry Background**: Multi-layered space environment with animated stars and particles
- **Interactive Elements**: Rocket for social links and galaxy for worlds exploration
- **Custom Cat Cursor**: Follows mouse movement with slight rotation
- **Three.js Integration**: 3D animations and effects for an engaging experience
- **Responsive Design**: Adapts to different screen sizes
- **Cartoon Visual Style**: Soft edges, muted neon colors, and light textures

## 👨‍💻 Technology Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- Three.js for 3D effects
- SVG animations

## 🛠️ Setup & Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd spacee
   ```

2. There's no build process required. Simply open `index.html` in your browser or use a local server:
   ```bash
   # If you have Python installed
   python -m http.server
   
   # Or if you have Node.js installed
   npx serve
   ```

3. The site should now be running at `http://localhost:8000` or similar.

## 📱 Pages

- **Home/Landing Page**: Interactive space scene with rocket and galaxy
- **Social Page**: Links to social media platforms (Twitter, Instagram, Discord)
- **Worlds Page**: Interactive planets representing Creativity, Adventure, and Knowledge

## 🚀 Deployment

This project is designed to be deployed on Vercel:

1. Install Vercel CLI (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. Deploy the project
   ```bash
   vercel
   ```

## 📁 Project Structure

```
/
├── index.html              # Main landing page
├── social.html             # Social links page
├── worlds.html             # Worlds exploration page
├── public/
│   ├── css/
│   │   ├── styles.css      # Main stylesheet
│   │   ├── social.css      # Social page styles
│   │   └── worlds.css      # Worlds page styles
│   ├── js/
│   │   ├── main.js         # Main JavaScript with Three.js setup
│   │   ├── social.js       # Social page functionality
│   │   └── worlds.js       # Worlds page functionality
│   └── images/             # SVG and image assets
├── roadmap.txt             # Project roadmap and progress
└── mandates.txt            # Project requirements and mandates
```

## 🧑‍🎨 Design Philosophy

This project embraces a playful, cartoon-style space aesthetic with an emphasis on:
- Intuitive user experience
- Delightful interactions
- Lightweight but impressive 3D effects
- Cohesive visual language

## 🌐 Browser Compatibility

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## ⚠️ Requirements

Modern browser with JavaScript and WebGL enabled. 