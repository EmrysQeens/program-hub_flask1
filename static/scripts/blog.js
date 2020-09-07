document.addEventListener('DOMContentLoaded', ()=>{
    const blog_content = document.querySelector('#blog_content')
    const create_btn = document.querySelector('#create')
    const preview_btn = document.querySelector("#btn_preview")
    const pop__up=document.querySelector('#alert')
    const alert_comp=[document.querySelector('#msg_h') ,document.querySelector('#msg_b') ,document.querySelector('#msg_f')]

    const elements=[ document.querySelector('#name'), document.querySelector('#email'), document.querySelector('#title')]
    const displays=[ document.querySelector('#namep'),  document.querySelector('#emailp'),  document.querySelector('#titlep')]

    //Regex name and email test
    const test=[/^[a-z A-Z][^0-9][^~`!@#$%^&*(){}\[\];:\"\'<,.>?\/\\|_+=-]* [a-z A-Z][^0-9][^~`!@#$%^&*(){}\[\];:\"\'<,.>?\/\\|_+=-]*$/, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]
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
            readonly(true)
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
                if(status==200 && response['stat']=='added'){
                    pop_up(['Success!!!', 'Blog Post was successfully created.', `An email will be sent to ${elements[1].value} when verified`], true)
                    reset()
                }else pop_up(['Error!!!', 'Blog Post was not successfully created.', 'Please try again'], false)
                readonly(false)
                loader.exit(()=>{})
            })
            r.error(()=> {
                readonly(false)
                loader.exit(()=>{})
                pop_up(['Error!!!', 'The Request was not successfully completed...', '$_> Connection failed'], false)})
            r.timeout(()=> {
                readonly(false)
                loader.exit(()=>{})
                pop_up(['Error!!!', 'The Request was not successfully completed...', '$_> Connection timeout'], false)})
         })
        //End create

        //Reset all input fields Event Handler
         reset=()=>{
            elements.forEach(element=> element.value='')
            window.editor.setData('')
         }
         //End reset

         validate=()=>create_btn.disabled = ! (test[0].test(elements[0].value) && test[1].test(elements[1].value) && elements[2].value !='' && editor.getData() !='')
         //Match regular expression name for input name
         elements.forEach((it, index)=>{
            it.onchange=()=>{
              if(index !=2)
                if( ! test[index].test(it.value) ) it.style.background='red'
            }
            it.oninput=()=> validate()
            //Return to normal styling on focus
            it.onfocus=()=> it.style.background='transparent'
         })

         //Readonly for disabling all input fields
         readonly=bool=>{
            elements.forEach(element=> element.readOnly=bool)
            editor.isReadOnly=bool
            create_btn.disabled=!bool
         }

         //Sets alert for submission complete, error etc
         pop_up=(messages, e)=>{
            pop__up.style.top=window.scrollY+'px'
            pop__up.style.background= e ? 'blue' : 'red'
            pop__up.style.display='block'
            alert_comp.forEach((component, index)=> component.innerText= messages[index])
            pop__up.style.animationName='open'
            pop__up.style.animationDuration='2s'
            pop__up.animationPlayState='running'
         }

         window.onscroll=()=>{
            pop__up.style.top=window.scrollY+'px'
         }
         //Alert close button
         document.querySelector('#close').onclick=()=>{
            pop__up.style.animationName='close'
            pop__up.style.animationDuration='2s'
            pop__up.animationPlayState='running'
         }

})

window.onload=()=>{
    //Editor
    document.querySelector('.ck-editor__editable').onkeyup=()=>validate()
}


