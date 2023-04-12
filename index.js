function loadImages() {
  const baseURL = "https://api.github.com/repos/benjooom/HCI-Final/contents/images";
  
  fetch(baseURL)
    .then(response => response.json())
    .then(data => {
      data.forEach(file => {
        if (file.type === "file" && (file.name.endsWith(".jpg") || file.name.endsWith(".jpeg") || file.name.endsWith(".png") || file.name.endsWith(".gif"))) {
          const imgElement = document.createElement("img");
          imgElement.src = file.download_url;
          imgElement.alt = file.name;
          imgElement.style.width = "300px";
          imgElement.style.margin = "10px";
          document.getElementById("gallery").appendChild(imgElement);
        }
      });
    })
    .catch(error => {
      console.error("Error fetching images:", error);
    });
}
