export const navBackgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 2 1'%3E%3Crect fill='%2377aa77' width='2' height='1'/%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%2377aa77'/%3E%3Cstop offset='1' stop-color='%234fd'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23cf8' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23cf8' stop-opacity='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='c' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='2' y2='2'%3E%3Cstop offset='0' stop-color='%23cf8' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23cf8' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='0' y='0' fill='url(%23a)' width='2' height='1'%3E%3Canimate attributeName='x' values='0; -2; 0' dur='6s' repeatCount='indefinite' /%3E%3C/rect%3E%3Cg fill-opacity='0.5'%3E%3Cpolygon fill='url(%23b)' points='0 1 0 0 2 0'%3E%3Canimate attributeName='points' values='0 1 0 0 2 0; 0 1 0 0 2 1; 0 1 0 0 2 0' dur='6s' repeatCount='indefinite' /%3E%3C/polygon%3E%3Cpolygon fill='url(%23c)' points='2 1 2 0 0 0'%3E%3Canimate attributeName='points' values='2 1 2 0 0 0; 2 1 2 0 2 0; 2 1 2 0 0 0' dur='6s' repeatCount='indefinite' /%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E")`


export const svgBackground = generateSvgBackground();

function generateSvgBackground() {
  const numCircles = Math.floor(Math.random() * 10) + 10; // Random number between 10 and 20
  const width = 1440;
  const height = 560;

  const gradients = [
    { id: 'grad1', colors: ['#ab3c51', '#4f4484'] },
    { id: 'grad2', colors: ['#e298de', '#484687'] },
    { id: 'grad3', colors: ['#84b6e0', '#464a8f'] },
  ];

  let svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#32325d"/>
  <defs>
`;

  // Add gradients to defs
  gradients.forEach((gradient) => {
    svgContent += `
    <linearGradient id="${gradient.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradient.colors[0]}"/>
      <stop offset="100%" stop-color="${gradient.colors[1]}"/>
    </linearGradient>
`;
  });

  svgContent += `
  </defs>
`;

  for (let i = 0; i < numCircles; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const r = Math.random() * 30 + 20; // Radius between 20 and 50
    const gradient = gradients[Math.floor(Math.random() * gradients.length)];

    const dur = (Math.random() * 6 + 8).toFixed(2); // Duration between 8s and 14s

    // Generate a smooth random path that starts and ends at (0,0)
    const path = generateSmoothRandomPath();

    svgContent += `
  <circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" fill="url(#${gradient.id})">
    <animateMotion dur="${dur}s" repeatCount="indefinite"
      path="${path}"/>
  </circle>
`;
  }

  svgContent += `
</svg>
`;

  return svgContent;
}

function generateSmoothRandomPath() {
  // Generate a random path starting and ending at (0,0) with smooth curves
  const numSegments = 6; // Number of segments in the path
  let path = 'M0,0 ';

  let currentX = 0;
  let currentY = 0;

  for (let i = 0; i < numSegments; i++) {
    // Random control points relative to the current point
    const cp1x = currentX + (Math.random() - 0.5) * 200;
    const cp1y = currentY + (Math.random() - 0.5) * 200;
    const cp2x = currentX + (Math.random() - 0.5) * 200;
    const cp2y = currentY + (Math.random() - 0.5) * 200;
    const endX = currentX + (Math.random() - 0.5) * 200;
    const endY = currentY + (Math.random() - 0.5) * 200;

    path += `C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${endX.toFixed(2)},${endY.toFixed(2)} `;

    currentX = endX;
    currentY = endY;
  }

  // Add a final curve back to the starting point (0,0)
  const cp1x = currentX + (Math.random() - 0.5) * 200;
  const cp1y = currentY + (Math.random() - 0.5) * 200;
  const cp2x = (Math.random() - 0.5) * 200;
  const cp2y = (Math.random() - 0.5) * 200;

  path += `C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} 0,0 Z`;

  return path;
}
