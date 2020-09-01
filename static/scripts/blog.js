document.addEventListener('DOMContentLoaded', ()=>{
    const blog_content = document.querySelector('#blog_content')
    const create_btn = document.querySelector('#create')
    const preview_btn = document.querySelector("#btn_preview")

    const elements=[ document.querySelector('#name'), document.querySelector('#email'), document.querySelector('#title')]
    const displays=[ document.querySelector('#namep'),  document.querySelector('#emailp'),  document.querySelector('#titlep')]

    CKSource
        .Editor.create(blog_content, {
           toolbar: {
                items: [ "bold", "code", "codeBlock", "undo",
                         "redo", "heading", "horizontalLine", "imageTextAlternative",
                         "imageResize", "imageUpload", "indent", "outdent", "italic",
                         "link", "numberedList", "bulletedList", "mediaEmbed", "strikethrough", "subscript",
                         "superscript", "insertTable", "tableColumn", "tableRow", "mergeTableCells",
                         "tableCellProperties", "tableProperties", "underline"],
                shouldNotGroupWhenFull: true
            }
        })
        .then(editor => {
            window.editor = editor;
            //Hold and st Value then discard if it was edited
            const hold=document.querySelector('#hold')
            editor.setData(`${hold.innerHTML}`)
            hold.remove()
            console.log(Array.from(editor.ui.componentFactory.names()))
        })
        .catch(err => {
            console.error(err.stack)
        })

        //Preview button event handler
        preview_btn.addEventListener('click', e =>{
            displays.forEach((display, index)=>{
                display.innerHTML=elements[index].value
            })
            document.querySelector('#content').innerHTML=editor.getData()
         });
        //End preview

        //Create button event handler..
         create_btn.addEventListener('click', ()=>{
            const loader=new Loader()
            loader.load()
            r=new Request()
            const post_data={'name': elements[0].value, 'email': elements[1].value, 'title': elements[2].value, 'content': editor.getData(), 'type':'new'}
            const put_data={'id': create_btn.value, 'content': editor.getData() }
            const bool=create_btn.innerText=='Create'
            //Creates and send request
            r.fresh( bool ? post_data : put_data, bool ? 'POST' : 'PUT', 'blog')
            //On load
            r.loaded((response,status)=>{
                if(status==200){
                    reset()
                    loader.exit(()=>{})
                    alert(response['stat'])
                }else{

                }
            })
            r.error(()=>{})
         })
        //End create

        //Reset Button Event Handler
         reset=()=>{
            elements.forEach(element=> element.value='')
            window.editor.setData('')
         }
         //End reset
})