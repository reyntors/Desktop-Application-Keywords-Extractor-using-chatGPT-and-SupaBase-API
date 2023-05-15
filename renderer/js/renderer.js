const form = document.getElementById("form_sentence");

if (form) {
  form.onsubmit = async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    
    const sentence = formData.get("sentence");
    
    // Call openAI function
    const openAIResponse = await window.axios.openAI(sentence);
    const keywords = JSON.stringify(openAIResponse.choices[0].text).replace(/\\n/g, '');
    
    // Call Supabase API to insert the data
    const supaBaseResponse = await window.axios.supaBase('post', '', {
      sentence: sentence,
      keywords: keywords
    });
    
    console.log(supaBaseResponse);
    
    document.getElementById("extract").innerHTML = keywords;
  };
}


