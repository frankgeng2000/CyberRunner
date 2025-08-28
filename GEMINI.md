# Dino Runner Game

## Project Overview

This project is a simple 2D endless runner game, reminiscent of the classic Chrome Dino game, but with a distinct cyberpunk aesthetic. The game features a "cyber cat" character that navigates a futuristic landscape, dodging obstacles like pylons and drones.

### Technologies Used:

*   **Backend:** Node.js with Express.js for serving static files.
*   **Frontend:** HTML, CSS, and JavaScript (utilizing the Canvas API for game rendering).

### Architecture:

The application follows a client-server architecture. The Node.js server is responsible for serving the static HTML, CSS, and JavaScript files to the client's browser. All game logic, rendering, and user interaction occur directly within the browser using JavaScript and the HTML Canvas API.

## Building and Running

To set up and run the Dino Runner game locally, follow these steps:

### Installation

1.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```
    This command will install the `express` package, which is required for the server to function.

### Running the Application

1.  **Start the server:**
    ```bash
    npm start
    ```
    This command executes the `server.js` file, which starts the Express server.

2.  **Access the game:**
    Once the server is running, open your web browser and navigate to:
    ```
    http://localhost:3000
    ```
    The game will load in your browser.

## Development Conventions

### File Structure:

*   `server.js`: The main backend file, responsible for setting up the Express server and serving static assets.
*   `index.html`: The main HTML file that serves as the entry point for the game's frontend.
*   `public/`:
    *   `css/style.css`: Contains all the CSS rules for styling the game's interface and elements, adhering to a cyberpunk theme.
    *   `js/game.js`: Contains the core JavaScript logic for the game, including rendering, game state management, collision detection, and user input handling.

### Game Mechanics:

*   **Character:** A "cyber cat" that can jump and duck.
*   **Obstacles:** Pylons (ground obstacles) and drones (flying obstacles).
*   **Input:** Keyboard controls (Spacebar/ArrowUp for jump, ArrowDown for duck, ArrowLeft/ArrowRight for horizontal movement).
*   **Scoring:** Score increases as obstacles are successfully dodged.
*   **Game Over:** Occurs upon collision with an obstacle.

### Styling:

The game features a distinct cyberpunk aesthetic, characterized by a dark background, neon-like colors (cyan, magenta), and a retro-futuristic font (`'Courier New'`).