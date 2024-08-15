var modal = document.getElementById("modalcontent");
var btn = document.getElementById("togglemodal");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}


window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }

}

function showSwalDialog() {

    Swal.fire({

        title: 'Do you want to save the changes?',

        showDenyButton: true,

        showCancelButton: true,

        confirmButtonText: 'Save',

        denyButtonText: `Don't save`,

    }).then((result) => {

        /* Read more about isConfirmed, isDenied below */

        if (result.isConfirmed) {

            Swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {

            Swal.fire('Changes are not saved', '', 'info')

        }

    });

}