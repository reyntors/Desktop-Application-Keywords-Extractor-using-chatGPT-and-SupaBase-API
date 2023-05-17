const form = document.getElementById("form_sentence");

if (form) {
  form.onsubmit = async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    
    const sentence = formData.get("sentence");

    if(sentence.length <= 8){

      alertMessage("error","Please input atleast 8 characters!");

      return;
    }
    else if(sentence.length > 8){
      alertMessage("sucess","Sucess!");
    }
    
    // Call openAI function
    const openAIResponse = await window.axios.openAI(sentence);
    const keywords = openAIResponse.choices[0].text.replace(/\\n/g, '');
    
    // Call Supabase API to insert the data
    const supaBaseResponse = await window.axios.supaBase('post', '', {
      sentence: sentence,
      keywords: keywords
    });
   
   
    

    // Generate the HTML for the keywords
    const keywordHTML = keywords
    .split(" ")
    .map((keyword) => `<span class="keyword">${keyword}</span>`)
    .join(" ");

    // Set the HTML content of the textarea
    document.getElementById("extract").innerHTML = keywordHTML;
    
      };
}

function alertMessage(status,sentence){
window.Toastify.showToast({
  text: sentence,
  duration: 3000,
  gravity: "top", 
  position: "right", 
  stopOnFocus: true, 
  style: {
      textAlign: "center",
      background: status == "error" ? "#ff4d4f" : "#52c41a",
      color: "#ffffff",
      fontWeight: "bold",
      padding: "10px",
      borderRadius: "5px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
  }
});

}


