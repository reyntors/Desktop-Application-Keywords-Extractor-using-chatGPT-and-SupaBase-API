// Read Prompts from SupaBase
getPrompts();
async function getPrompts () {
    // Fetch API Response
    const response = await window.axios.supaBase('get');

    // Load table from API Response
    let htmlResult = '';
    Object.keys(response).forEach(key => {
        let date = new Date(response[key].created_at.replace(' ', 'T'));


        htmlResult += '<tr>' +
        '<th scope="row">' + response[key].prompt_id + '</th>' +
        '<td>' + response[key].sentence + '</td>' +
        '<td>' + response[key].keywords + '</td>' +
        '<td>' + date.toLocaleString('en-US', { timeZone: 'UTC' }) + '</td>' +
        '<td>' +
        '<button id="btn_prompts_del" class="btn btn-danger btn-sm" name="' + response[key].prompt_id + '">Delete</button>' +
        '</td>' +
        '</tr>';
});

    //Display
    const tbody = document.getElementById('tbl_prompts');
    tbody.innerHTML = htmlResult;
}

// Set Btn Delete Prompt Click functionality from Table Prompts
const tbl_prompts = document.getElementById('tbl_prompts');
if (tbl_prompts) {
    tbl_prompts.onclick = async function (e) {
        if(e.target && e.target.id == "btn_prompts_del") {
            const id = e.target.name;
            const response = await window.axios.supaBase('delete', id);
            console.log(response);
            
            alertMessage("success", "Successfully deleted id " + id + '!');
            getPrompts();
            
        }
    };
}