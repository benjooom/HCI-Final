# An Interactive Collaborative Art Project Demo

## How to install dependencies and run the project
Since our project doesn't have a backend, there's no need to install any dependencies.
To run the project, open `index.html` in a web browser.

## Project Description

The following dynamic art display allows users to draw on a shared canvas and build upon previous user drawings. The system tracks the user’s body and parses the direction and speed of the movements to create paint strokes on the canvas. The user's interaction time is controlled with a 30 second countdown timer. When the time is up, the system displays a QR code which links to an external website, where the user can download their artwork, view other people’s artworks, and sign up for a mailing list to receive the completed form of their artwork.

Tasks addressed:
1. The installation uses the user's body as a paintbrush. The display parses user movements to determine the color of the paintstroke, depending on different body parts and speeds.
2. The installation allows users to take their artwork home. The QR code allows the user to download their work in the form of a digital file, while the mailing list let's them stay up to date with their piece as it develops throughout the day.

## Deployment Constraints
Since our project requires tracking data from the `cpsc484-02.yale.internal:8888`, it should only work when connected to the Yale network. The physical space must also be large enough for the user to walk around and wave their arms should they choose to. The design is also intended to only work with one user at a time. Hence, it will choose the first individual in the frame and track their movements only. Finally, our app uses GitHub to store image data, whose API requires a TOKEN to run. The current TOKEN will expire in 1 month, so a new TOKEN is required to run the app at that time.

## Collaboration Record
Julius Lin (jl3574):

Benjamin Mehmedovic (bm746):

Emily Cai (ec966):
I wrote the HTML files for the 'Index' and 'Introduction' pages. I created the animated GIF for the start pose.

Ziteng Jiao(zj89):
I developed the tracking manager and the painting canvas.
I merged the canvas with the `Index` and `Introduction` page developed by Emily.
I developed the timer and the logic to redirect between pages.
I implements the image upload/download using the GitHub API wrapper function built by Ben.
I tested the installation on the display.

