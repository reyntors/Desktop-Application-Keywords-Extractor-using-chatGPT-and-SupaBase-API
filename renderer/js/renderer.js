const generateButton = document.getElementById("generate");
const modal = document.getElementById("modal");
const closeModal = document.getElementsByClassName("close")[0];
const textarea = document.getElementById("note-textarea");

generateButton.addEventListener("click", () => {
  const text = textarea.value;
  // perform keyword extraction and display results in modal
  // ...
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});
