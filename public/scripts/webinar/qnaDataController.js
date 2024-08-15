export const qnadataController = (function() {
    
async function saveQnaData(formData){
    await fetch(frendGlobalState.frend_api_url + '/webinar-scene', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    }).then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error saving data', error));

}

return {
    saveQnaData
}

})()


export default qnadataController