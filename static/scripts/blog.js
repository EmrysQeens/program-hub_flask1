document.addEventListener('DOMContentLoaded', ()=>{
    const blog_content = document.querySelector('#blog_content')
    const create_btn = document.querySelector('#create')
    const preview_btn = document.querySelector("#btn_preview")
    const select=document.querySelector('#relate')
    const pop__up=document.querySelector('#alert')
    const content=document.querySelector('#content')
    const alert_comp=[document.querySelector('#msg_h') ,document.querySelector('#msg_b') ,document.querySelector('#msg_f')]

    const elements=[ document.querySelector('#name'), document.querySelector('#email'), document.querySelector('#title'), document.querySelector('#error')]
    const displays=[ document.querySelector('#namep'),  document.querySelector('#emailp'),  document.querySelector('#titlep')]
    const vals=['name', 'email', 'title', 'error']
    const r=new Request()
    //Regex name and email test
    const test=[/^[a-z A-Z][^0-9][^~`!@#$%^&*(){}\[\];:\"\'<,.>?\/\\|_+=-]* [a-z A-Z][^0-9][^~`!@#$%^&*(){}\[\];:\"\'<,.>?\/\\|_+=-]*$/, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]
    CKSource
        .Editor.create(blog_content, {
           toolbar: {
                items: [ "bold", "codeBlock", "undo",
                         "redo", "heading", "horizontalLine", "imageTextAlternative",
                         "imageResize", "imageUpload", "indent", "outdent", "italic",
                         "link", "numberedList", "bulletedList", "strikethrough", "subscript",
                         "superscript", "insertTable", "tableColumn", "tableRow", "mergeTableCells",
                         "tableCellProperties", "tableProperties", "underline"],
                shouldNotGroupWhenFull: true
            }
        })
        .then(editor => {
            window.editor = editor;
            //Hold and store Value then discard if it was edited
            const type=document.querySelector('#type')
            select.value= type=="" ? 'NAN' : type.innerText
            type.remove()
            const hold=document.querySelector('#hold')
            editor.setData(`${hold.innerHTML}`)
            hold.remove()
            console.log(Array.from(editor.ui.componentFactory.names()))
        })
        .catch(err => {
            console.error(err.stack)
        })

    //Preview button event handler set modal values
        preview_btn.addEventListener('click', e =>{
            displays.forEach((display, index)=>{
                display.innerHTML= index==0 ? `By ${elements[index].value}` : elements[index].value
            })
            content.querySelectorAll('a').forEach(tag=>{
                tag.setAttribute('href', tag.href.startsWith(r.url) ? `https://${tag.href.substring(r.url.length)}` : tag.href)
            })
            content.innerHTML=editor.getData()
            content.querySelectorAll('pre').forEach(pre=>{
                const code_class = pre.querySelector('code').className.substring(9)
                pre.innerHTML= `<b>$_> ${code_class.charAt(0).toUpperCase()+code_class.substring(1)}</b>\n\n` + pre.innerHTML
            })
         });
        //End preview

        //Create button event handler..
         create_btn.addEventListener('click', ()=>{
            readonly(true)
            const bool= create_btn.innerText=='Create'
            const v=create_btn.innerText
            const loader=new Loader(create_btn)
            loader.load(`<small>${bool ? 'Creating' : 'Saving'}</small>`)
            const post_data={ 'name': elements[0].value, 'email': elements[1].value,
                               'title': elements[2].value, 'content': editor.getData(),
                               'typ': select.value, 'error': elements[3].value, 'type':'new'}
            const put_data={'id': create_btn.value, 'content': editor.getData() }
            //Creates and send request
            r.fresh( bool ? post_data : put_data, bool ? 'POST' : 'PUT', 'blog')
            //On load
            r.loaded((response,status)=>{
                if(status==200 && response['stat']=='added'){
                    pop_up(['Success!!!', 'Blog Post was successfully created.', `An email will be sent to ${elements[1].value} when verified`], true)
                    localStorage.clear()
                    reset()
                }else { pop_up(['Error!!!', 'Blog Post was not successfully created.', 'Please try again'], false) }
                readonly(false)
                select.disabled=false
                loader.exit(false, `<small>${ v == 'Saving' ? 'Save' : 'Create'}</small>`)
                validate()
                //Replaces url if blog was edited and saved.
                if (!bool) window.history.replaceState('', 'Blog', '/blog')
            })
            r.error(()=> {
                readonly(false)
                loader.exit(false, `<small>${v.contains('Saving') ? 'Save' : 'Create'}</small>` )
                pop_up(['Error!!!', 'The Request was not successfully completed...', '$_> Connection failed'], false)})
            r.timeout(()=> {
                readonly(false)
                loader.exit(false, `<small>${v.contains('Saving') ? 'Save' : 'Create'}</small>` )
                pop_up(['Error!!!', 'The Request was not successfully completed...', '$_> Connection timeout'], false)})
         })
        //End create

         //Reset all input fields Event Handler
         reset=()=>{
            elements.forEach(element=> element.value='')
            window.editor.setData('')
         }
         //End reset

        //Validates user inputs by disabling preview and create btn if terms not met
        validate=()=>{
            const tst = ! (test[0].test(elements[0].value) && test[1].test(elements[1].value) && elements[2].value !='' &&elements[3].value !='' && editor.getData() !='')
            preview_btn.disabled = tst
            create_btn.disabled = tst
         }

         //Match regular expression name for input name
         elements.forEach((it, index)=>{
            it.onchange=()=>{
              if(index !=2 && index !=3)
                if( ! test[index].test(it.value) ) it.style.background='red'
            }
            it.oninput=()=> {
                //The line below sets a value for each input as they are changed
                localStorage.setItem(vals[index], it.value)
                validate()
            }
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
            pop__up.style.background= e ? 'linear-gradient(#42275a, #734b6d)' : 'red'
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

         select.onchange=()=>
         {
            localStorage.setItem('type', select.selectedIndex)
            if(select.value=='tn' || select.value=='cs'){
                elements[3].value='NAN'
                elements[3].readOnly=true}
            else{
                elements[3].readOnly=false
            }
         }

   window.onload=()=>{
    //Editor
    document.querySelector('.ck-editor__editable').onkeyup=()=>{
        localStorage.setItem('content', editor.getData())
        validate()
    }

    loadData=()=>{
         if(select.disabled == false){
            elements.forEach((element, index)=>{
                element.value=localStorage.getItem(vals[index])
            })
            select.selectedIndex=localStorage.getItem('type')
         else{
            editor.setData(localStorage.getItem('content'))}
            catch(err){}
         }
         }
    loadData()
    validate()
}

})
