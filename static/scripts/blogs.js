document.addEventListener('DOMContentLoaded',()=>{
    window.onscroll = () => {
        /*if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            alert(document.innerHeight)
            alert("end")
        }*/
    };

    document.querySelectorAll('.div-blog').forEach(div=>{
        div.addEventListener('click',()=>{
            const request=new XMLHttpRequest();
            const num=new FormData()
            num.append('num',JSON.stringify({'num':div.dataset.blog}))
            request.open('POST',`${location.protocol+'//'}${document.domain}:${location.port}/blogs`)
            request.onload=()=>{
                data=JSON.parse(request.responseText)
                document.querySelector('#titlep').innerHTML=data['title']
                document.querySelector('#namep').innerHTML='By '+data['name']
                document.querySelector('#emailp').innerHTML=data['email']
                document.querySelector('#content').innerHTML=data['content']
            }
            request.onprogress=()=>{

            }
            request.send(num)
        })
    })
}); 