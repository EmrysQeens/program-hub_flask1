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
            console.log(Array.from(editor.ui.componentFactory.names()));
        })
        .catch(err => {
            console.error(err.stack);
        });

    create_btn.addEventListener('click', e => {
        data=new FormData();
        datas={
            'name':document.querySelector('#name').value,
            'email':document.querySelector('#email').value,
            'title':document.querySelector('#title').value,
            'content':editor.getData()
        }
        data.append('data',JSON.stringify(datas))
        async function post(){
            const resp=await fetch(`${location.protocol+'//'}${document.domain}:${location.port}/blog`,{
                method:'POST',
                header:{
                    content:'application/json'
                },
                body:data
            }).then(res=> res.json())
                .then(stat=>{console.log(stat)})
                .catch(err=>console.log(err))
            }
        post()
    });

    preview_btn.addEventListener('click', e => document.querySelector('#preview').innerHTML=editor.getData());
});


toggleBtn = (btn, func) => {
    btn.className = btn.className == 'btn btn-secondary btn-sm cn' ? "btn btn-outline-secondary btn-sm cn" : 'btn btn-secondary btn-sm cn';
    func();
}