document.addEventListener('DOMContentLoaded', async ()=>{
    const title = document.querySelector('#title')
    const title_ = document.querySelector('#title_')
    const img_chooser = document.querySelector('#img')
    const btn_create = document.querySelector('#create')
    const btn_preview = document.querySelector('#btn_preview')
    const image = document.querySelector('#image')
    const content = document.querySelector('#content')
    const is_create = btn_create.dataset.create == 'create'

    await CKSource
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
            console.log(Array.from(editor.ui.componentFactory.names()))
        })
        .catch(err => {
            console.error(err.stack)
        })

    const toBase64 = file => new Promise((resolve, reject)=>{
        const reader = new FileReader()
        if (file == undefined) return
        reader.readAsDataURL(file)
        reader.onload = () => resolve([reader.result, true])
        reader.onerror = (err) => reject([err, false])
    })

    const clear = () =>{
        editor.setData('')
        title.value = ''
        img_chooser.value = ''
    }

    const disable = (bool) =>{
        btn_create.disabled = bool
        btn_preview.disabled = bool
    }


    const upload = async (e) =>{
        if(!(editor.getData() != '' && title.value != '' && img_chooser.files[0] != undefined ))
            return
        disable(true)
        const img_data = await toBase64(img_chooser.files[0])
        if (img_data[1] == false)
            return
        const loader =  new Loader(e.target)
        const bool = e.target.innerText == 'Create'
        loader.load( bool ? 'Creating' : 'Saving' )
        const r= bool ? 'Create' : 'Save'
        const request = new Request()
        const data = bool ? {'type': 'upload', 'title': title.value,'img': img_data[0], 'content': editor.getData()} : {'id': btn_create.dataset.id, 'img': img_data, 'content': editor.getData()}
        request.fresh(data, bool ? 'POST' : 'PUT', 'learn')
        request.loaded((response, status)=>{
            if(status == 200){
                 if (response['result']){
                    loader.exit(false, 'Create')
                    pop_up([`${ bool ? 'Created' : 'Saved'}!!!`, `${title.value} was successfully ${ bool ? 'created' : 'updated'}.`, `${ bool ? 'Created':'Updated'}`], true)
                    clear()
                    clearStorage()
                    if(!bool) {
                        window.history.replaceState('', 'Write', '/write')
                        title.readOnly = false;
                    }
                 }
            }
            else {
                    loader.exit(false, r)
                    pop_up(['Error!!!', `${title.value} might exist.`, 'err_error'], false)
                    disable(false)
             }
        })
        request.timeout(()=>{
            pop_up(['Connection Timeout!!!', 'Connection time exceeded', 'err_timeout'], false)
            loader.exit(false, r)
            disable(false)
        })
        request.error(()=> {
            pop_up(['Connection Error!!!', 'Connection to server couldn\'t be established.', 'err_no connection'], false)
            loader.exit(false, r)
            disable(false)
        })

    }

    const nan_null = (btns) => btns.forEach(btn => btn.disabled= !( editor.getData() != '' && title.value != '' && img_chooser.files[0] != undefined ) )

    title.oninput = () =>{
        nan_null([btn_create, btn_preview])
        save('title_', title.value)
    }
    img_chooser.onchange = () => nan_null([btn_create, btn_preview])


    btn_create.onclick = (e) =>{
        upload(e);
    }

    btn_preview.onclick = async () =>{
        const img_data = await toBase64(img_chooser.files[0])
        image.src=img_data[0]
        title_.innerText = title.value.toLowerCase();
        content.innerHTML = editor.getData()
        content.querySelectorAll('pre').forEach(pre=>{
                const code_class = pre.querySelector('code').className.substring(9)
                pre.innerHTML= `<b>$_> ${code_class.charAt(0).toUpperCase()+code_class.substring(1)}</b>\n\n` + pre.innerHTML
        })
    }

    window.onload = () =>{
    document.querySelector('.ck-editor__editable').oninput=()=>{
        nan_null([btn_create, btn_preview])
        save('content_', editor.getData())
    }

     if (!is_create){
        editor.setData(hold.innerHTML)
        hold.remove()
       }
      else{
        title.value = get('title_')
        editor.setData(get('content_'))
       }
    }

    const save = (key, value) => localStorage.setItem(key, value)
    const get = (key) => localStorage.getItem(key)
    const clearStorage = () =>{
        save('title_', '')
        save('content_', '')
    }


    })

