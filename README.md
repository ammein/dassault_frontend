# Dassault Systemes
This repository serves a purpose for an assessment task: Build an Interactive Infographic

## Installation
```shell
# Install all npm packages
npm install

# Update git submodules from Lygia by running this command
git submodule update --init --recursive
```

### Features Uses
 - BarbaJS (Navigation State)
 - GSAP (Animation)
 - Lenis (Smooth Scroll)
 - glsl-pipeline (WebGL)
 - Split-Type (Text Split)
 - Lygia (GLSL Library)

### Code Structure
- `src/3d`: 3D Files
- `src/barba/global`: Global functions for BarbaJS
- `src/barba/pages`: Pages Views Functions
- `src/barba/index.js` Barba Helper Class
- `src/glsl`: GLSL Files for extensive GPU animation
- `src/utils`: Utilisation script for the project including animations

### Idea
A story should be explained dramatically with precise and short for viewers to understand the origin behind it. Use scroll advantage to let user keep scrolling to view more information and overwhelmed by the animation on each section scrolls. For more information about the process, can refer here: [Project Workflows](https://boardmix.com/app/share/CAE.CMbqdiABKhDfSQyMG4TKNIbXujwNHAS4MAZAAQ/lkoqgA，)

## Limitations
- Performance might be affected on lower spec devices. (Can be further optimized)
- Scrolling buggy in mobile device.
- Text might get cropped on safari mobile device due to its absolute positioned. (Can be adjusted)
