# Images Directory

This directory is ready for local image assets.

## Current Setup

The project currently uses remote royalty-free image URLs centralized in `src/data/images.js`.

## For Production

Replace remote URLs with local high-quality photography:

1. Add your professional tailoring photos to subdirectories:
   - `home/` — hero, introduction, collections
   - `craft/` — close-up craftsmanship details
   - `wedding/` — groom and ceremony photography
   - `fabrics/` — fabric texture close-ups
   - `studio/` — atelier and workspace
   - `story/` — team and heritage

2. Update `src/data/images.js` to import and reference local files:

```javascript
import heroImage from '../assets/images/home/hero.jpg';

export const images = {
  hero: heroImage,
  // ... rest of images
};
```

3. Use high-quality images:
   - Minimum 1600px wide for hero images
   - 1200px for standard content images
   - JPG format, optimized for web (70-85% quality)
   - Consistent color grading and lighting

## Recommended Photography

- Real tailoring process (measuring, cutting, stitching)
- Suit details (lapels, buttons, fabric texture)
- Studio environment and workspace
- Client fittings (with permission)
- Finished garments
- Avoid obvious stock photography
