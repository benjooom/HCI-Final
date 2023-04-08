document.addEventListener('DOMContentLoaded', () => {
  loadImages();
});

async function loadImages() {
  const response = await fetch('https://api.github.com/repos/benjooom/HCI-Final/contents/gallery/images/');
  const data = await response.json();
  const imagesContainer = document.getElementById('images-container');

  data.forEach(image => {
    if (image.type === 'file' && image.path.startsWith('images/')) {
      const img = document.createElement('img');
      img.src = image.download_url;
      img.alt = image.name;
      img.width = 200;
      imagesContainer.appendChild(img);
    }
  });
}
