const form = document.getElementById("form_sentence");


if (form) {
  form.onsubmit = async function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    const text = await window.axios.openAI();
    document.getElementById("extract").innerHTML = text;
    console.log(text);
  };
}

