Lander.graphics = (function() {
    'use strict';

    let canvas = Lander.canvas;
    let context = Lander.context;
    let width = 1000;

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    rotation:     // radians
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        Lander.context.save();

        Lander.context.translate(center.x, center.y);
        Lander.context.rotate(rotation);
        Lander.context.translate(-center.x, -center.y);

        Lander.context.drawImage(
            image,
            center.x - size.x / 2,
            center.y - size.y / 2,
            size.x, size.y);

        Lander.context.restore();
    }

    // --------------------------------------------------------------
    //
    // Draw a rectangle to the canvas with the following attributes:
    //      center: { x: , y: },
    //      size: { x: , y: },
    //      rotation:       // radians
    //
    // --------------------------------------------------------------
    function drawRectangle(rect) {
        Lander.context.save();
        Lander.context.translate(rect.center.x, rect.center.y );
        Lander.context.rotate(rect.rotation);
        Lander.context.translate(-rect.center.x, -rect.center.y);
        
        Lander.context.fillStyle = rect.fill;
        Lander.context.fillRect(rect.center.x - rect.size.x / 2, rect.center.y - rect.size.y / 2, rect.size.x, rect.size.y);
        
        Lander.context.strokeStyle = rect.stroke;
        Lander.context.strokeRect(rect.center.x - rect.size.x / 2, rect.center.y - rect.size.y / 2, rect.size.x, rect.size.y);

        Lander.context.restore();
    }

    let api = {
        clear: clear,
        drawTexture: drawTexture,
        drawRectangle: drawRectangle,
        width: width
    };

    return api;
}());
