document.addEventListener('DOMContentLoaded', () => {
    const blog_content = document.querySelector('#blog_content');
    const create_btn = document.querySelector('#create');
    const preview_btn = document.querySelector("#btn_preview");
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
            const hold=document.querySelector('#hold')
            editor.setData(`${hold.innerHTML}`)
            hold.remove()
            console.log(Array.from(editor.ui.componentFactory.names()));
        })
        .catch(err => {
            console.error(err.stack);
        });


    create_btn.addEventListener('click', e => {
        const l=new Loader(document.querySelector('#loader'))
         l.load()
        const data=new FormData();
        const bool=document.querySelector('#create').innerText=='Create'
        datas={
            'name':document.querySelector('#name').value,
            'email':document.querySelector('#email').value,
            'title':document.querySelector('#title').value,
            'content':editor.getData(),
            'type':'new'
        }

        put={
            'id':document.querySelector('#create').value,
            'content':editor.getData()
        }

        data.append('data',JSON.stringify( bool ? datas : put))
        const post=async function(){
            const resp=await fetch(`${location.protocol+'//'}${document.domain}:${location.port}/blog`,{
                method: `${ bool ? 'POST' : 'PUT'}`,
                header:{
                    content:'application/json'
                },
                body:data
            }).then(res=> res.json())
                .then(stat=>{
                    reset()
                    l.exit(()=>{})
                    })
                .catch(err=>console.log(err))
            }
        post()
    });

    preview_btn.addEventListener('click', e =>{
         name=document.querySelector('#name').value
         email=document.querySelector('#email').value
         title=document.querySelector('#title').value
         document.querySelector('#titlep').innerHTML=title
         document.querySelector('#namep').innerHTML='By '+name
         document.querySelector('#emailp').innerHTML=email
         document.querySelector('#content').innerHTML=editor.getData()
         });



});


function reset(){
    name=document.querySelector('#name').value=''
    email=document.querySelector('#email').value=''
    title=document.querySelector('#title').value=''
    window.editor.setData('')
}