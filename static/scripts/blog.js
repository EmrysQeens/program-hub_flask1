document.addEventListener('DOMContentLoaded', () => {
    const blog_content = document.querySelector('#blog_content');
    const create_btn = document.querySelector('#create');
    const preview_btn = document.querySelector("#btn_preview");
    CKSource
        .Editor.create(blog_content, {
           toolbar: {
                items: ["bold", "code", "codeBlock",
                "undo", "redo", "heading", "horizontalLine", "imageTextAlternative", "imageResize",, "imageUpload", "indent", "outdent", "italic", "link", "numberedList",
                "bulletedList", "mediaEmbed", "strikethrough", "subscript", "superscript", "underline" ],
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
            'name':document.querySelector('#name'),
            'email':document.querySelector('#email'),
            'content':editor.getData();
        }
        async function post(){
            const resp=await fetch(`${location.protocol}//${document.domain}:${location.port}`,{
                method:'POST',
                header{
                    content:'application/json'
                },
                body:datas
            });
        }
    });

    preview_btn.addEventListener('click', e => document.querySelector('#preview').innerHTML=editor.getData());




});


toggleBtn = (btn, func) => {
    btn.className = btn.className == 'btn btn-secondary btn-sm cn' ? "btn btn-outline-secondary btn-sm cn" : 'btn btn-secondary btn-sm cn';
    func();
}