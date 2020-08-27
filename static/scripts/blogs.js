document.addEventListener('DOMContentLoaded',()=>{
    window.onscroll = () => {
        /*if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            alert(document.innerHeight)
            alert("end")
        }*/
    };
    let id=null
    const r=new Request()
    try{

        //Commit button in html onclick event
        document.querySelector('#add').addEventListener('click',()=>{
            const req=new XMLHttpRequest()
            req.open('POST',`${location.protocol+'//'}${document.domain}:${location.port}/blog`)
            const data=new FormData()
            datas={
                'num':id,
                'content':document.querySelector('#content').innerHTML,
                'type':'old'
            }
            data.append('data',JSON.stringify(datas))
            req.onload=e=>{
                if(req.status==200 && JSON.parse(req.responseText)['stat']=='added'){
                    alert('Added Succesfully');
                    document.querySelector(`#blog-${id}`).remove()
                }
                else{
                    alert(req.status)
                }
            }
            req.onerror=e=> alert('Error cannot complete request...')
            req.send(data)
         })

         //Delete button
         document.querySelector('#delete').addEventListener('click',()=>{
            const req=new XMLHttpRequest()
            req.open('POST',`${location.protocol+'//'}${document.domain}:${location.port}/delete`)
            const data=new FormData()
            datas={
                'num':id
            }
            data.append('data',JSON.stringify(datas))
            req.onload=e=>{
                console.log(req.responseText)
                if(req.status==200 && JSON.parse(req.responseText)['stat']=='deleted'){
                    alert('Deleted Succesfully');
                    document.querySelector(`#blog-${id}`).remove()
                }
                else{
                    alert(req.status)
                }
            }
            req.onerror=e=> alert('Error cannot complete request...')
            req.send(data)
         })

         //Edit Button
         document.querySelector('#edit').addEventListener('click',()=>{
            const req=new XMLHttpRequest()
            req.open('POST',`${location.protocol+'//'}${document.domain}:${location.port}/edit`)
            const data=new FormData()
            datas={
                'num':id
            }
            data.append('data',JSON.stringify(datas))
            req.onload=e=>{
                console.log(req.responseText)
                if(req.status==200 && JSON.parse(req.responseText)['stat']=='deleted'){
                    alert('Deleted Succesfully');
                    document.querySelector(`#blog-${id}`).remove()
                }
                else{
                    alert(req.status)
                }
            }
            req.onerror=e=> alert('Error cannot complete request...')
            req.send(data)
         })

         }catch(err){

         }

    document.querySelector('#dismiss').onclick=()=>{
        r.cancel()
        r.loaded(true)
        console.log(id)
        id=null
        document.querySelector('#titlep').innerHTML=""
        document.querySelector('#namep').innerHTML=""
        document.querySelector('#emailp').innerHTML=""
        document.querySelector('#content').innerHTML=""
    };

    document.querySelectorAll('.div-blog').forEach(div=>{
        div.addEventListener('click',()=>{
            r.fresh(div,(data,e)=>{
            //onload
                id=div.dataset.blog
                document.querySelector('#titlep').innerHTML=data['title']
                document.querySelector('#namep').innerHTML='By '+data['name']
                document.querySelector('#emailp').innerHTML=data['email']
                document.querySelector('#content').innerHTML=data['content']
            },(e)=>{
            //onprogress
                console.log(e.loaded)
            },(e)=>{
            //onerrror
            })

         })
    })
});

//update=e=>{
//    document.querySelector('#progress').style.width=(e.loaded/e.total) * 100 +'%'
//}