document.addEventListener('DOMContentLoaded', ()=>{
    const title = document.querySelector('#title')
    const title_ = document.querySelector('#title_')
    const img_chooser = document.querySelector('#img')
    const btn_create = document.querySelector('#create')
    const btn_preview = document.querySelector('#btn_preview')
    const image = document.querySelector('#image')
    const content = document.querySelector('#content')

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
            console.log(Array.from(editor.ui.componentFactory.names()))
        })
        .catch(err => {
            console.error(err.stack)
        })

    const toBase64 = file => new Promise((resolve, reject)=>{
        const reader = new FileReader()
        if (file == undefined) return
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (err) => reject(err)
    })

    const upload = async () =>{
        const img_data = await toBase64(img_chooser.files[0])

        const request = new Request()
        request.fresh({'type': 'upload', 'title': title.value,'img': img_data, 'content': editor.getData()},'POST', 'learn')
        request.loaded((response, status)=>{
            console.log(response)
        })
    }

    const nan_null = (btns) => btns.forEach(btn => btn.disabled= !( editor.getData() != '' && title.value != '' && img_chooser.files[0] != undefined ) )

    title.oninput = () => nan_null([btn_create, btn_preview])
    img_chooser.onchange = () => nan_null([btn_create, btn_preview])


    btn_create.onclick = () =>{
        upload();
    }

    btn_preview.onclick = async () =>{
        const img_data = await toBase64(img_chooser.files[0])
        image.src=img_data
        title_.innerText = title.value;
        content.innerHTML = editor.getData()
        content.querySelectorAll('a').forEach(tag=>{
            tag.setAttribute('href', tag.href.startsWith(r.url) ? `https://${tag.href.substring(r.url.length)}` : tag.href)
        })
        content.querySelectorAll('pre').forEach(pre=>{
                const code_class = pre.querySelector('code').className.substring(9)
                pre.innerHTML= `<b>$_> ${code_class.charAt(0).toUpperCase()+code_class.substring(1)}</b>\n\n` + pre.innerHTML
        })
    }

    window.onload = () =>{
    document.querySelector('.ck-editor__editable').onkeyup=()=>{
        nan_null([btn_create, btn_preview])
    }

    }


    })

