export const getColorFromSeed = (seed) => {
    const baseColor = Math.floor(seed * 16777215).toString(16); // Generate a random base color

    // Convert the base color to RGB
    const rgb = parseInt(baseColor, 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;

    // Adjust the brightness and saturation for a pastel effect
    const colorR = Math.floor((r + 255) / 2);
    const colorG = Math.floor((g + 255) / 2);
    const colorB = Math.floor((b + 255) / 2);

    // Convert the pastel color back to hex
    const pastelColor = ((colorR << 16) | (colorG << 8) | colorB).toString(16).padStart(6, '0');

    return '#' + pastelColor;
};

export const getRandomColor = () => {
    const baseColor = Math.floor(Math.random() * 16777215).toString(16); // Generate a random base color

    // Convert the base color to RGB
    const rgb = parseInt(baseColor, 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;

    // Adjust the brightness and saturation for a pastel effect
    const colorR = Math.floor((r + 255) / 2);
    const colorG = Math.floor((g + 255) / 2);
    const colorB = Math.floor((b + 255) / 2);

    // Convert the pastel color back to hex
    const pastelColor = ((colorR << 16) | (colorG << 8) | colorB).toString(16).padStart(6, '0');

    return '#' + pastelColor;
}

export const hashCode = (str) => {
    let hash = 0;
    if (str.length === 0) return hash;
    
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32-bit integer
    }

    return hash;
};

// // Example function to modify the SVG content
// function modifySvg(svgString, uri){
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(svgString, 'image/svg+xml');

//     // Example: Change the color of all paths to red
//     const whiteRectangles = doc.querySelectorAll('rect[fill="#ffffff"]');
//     whiteRectangles.forEach((rect) => {
//         rect.setAttribute('fill', 'none');
//     });

//     const codeElements = doc.querySelectorAll('rect[fill="#000000"]')// , path[fill="#000000"]');
//     codeElements.forEach((element) => {
//         element.setAttribute("transform", "translate(300 75) scale(0.25)");
//     });

//     const spotifyLogo = doc.querySelectorAll('path[fill="#000000"]');
//     spotifyLogo.forEach((logo) => {
//         logo.setAttribute("transform", "translate(285 60) scale(0.25)");
//     });
    

//     const svgElement = doc.querySelector('svg');

//     for (let i = 0; i < 4; i++) { // Change 2 to the number of rectangles you want
//         const rect = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
//         rect.setAttribute('x', `${i * 100}`);
//         rect.setAttribute('y', '0');
//         rect.setAttribute('width', '100');
//         rect.setAttribute('height', '100');
    
//         //const randomColor = getRandomColor();
//         const randomColor = getColorFromSeed(hashCode(uri) + i * 1000000);
//         console.log(randomColor)
//         rect.setAttribute('fill', randomColor);
    
//         svgElement.insertBefore(rect, svgElement.firstChild);
//     }

//     // Convert the modified DOM back to string
//     const serializer = new XMLSerializer();
//     const modifiedSvgString = serializer.serializeToString(doc);

//     return modifiedSvgString;
// };