document.addEventListener('DOMContentLoaded', ()=>{
    const editor = document.querySelector('#editor')

    editor.onkeypress = (e) =>{
        if (e.keyCode == 13)
            editor.innerText += "\n" + "    "
        console.log(e)
    }

})