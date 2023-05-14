const form = document.getElementById("form_sentence");


if (form) {
  form.onsubmit = async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    
    
    const response = await window.axios.openAI(formData.get("sentence"));
    document.getElementById("extract").innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');
  };
}

