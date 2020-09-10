document.addEventListener('DOMContentLoaded', ()=>{

    let id=null  /* This helps to set id of blog clicked so it can be used for request */
    const r=new Request()
    const h=new Request()
    const pop__up=document.querySelector('#alert')
    const alert_comp=[document.querySelector('#msg_h') ,document.querySelector('#msg_b') ,document.querySelector('#msg_f')]
    const btns=[document.querySelector('.edit'), document.querySelector('#add'), document.querySelector('#delete')]
    const displays=[ document.querySelector('#titlep'),  document.querySelector('#namep'),  document.querySelector('#emailp'),  document.querySelector('#content')]

    //Add functionality to all divs
    document.querySelectorAll('.div-blog').forEach(div=>{
      //Add click listener
      div.addEventListener('click', ()=>{
        //Creates a new loader to load a span element
        const loader= new Loader()
        loader.load()
        //Creates an object and attach blog number and admin details...
        const data={'num':div.dataset.blog,
                    'admin':document.querySelector('#preview').dataset.admin}
        //Creates new Request object
        r.fresh(data, 'POST', 'blogs')
        //On load of new Request.
        r.loaded((response, status)=>{
          if(status==200){
            id=div.dataset.blog
            const resp=[ response['title'], response['name'], response['email'], response['content']]
            displays.forEach((element, index)=>{
                element.innerHTML= index==1 ? `By ${resp[index]}` : resp[index]
            })
            //Add code block language
            document.querySelector('#content').querySelectorAll('pre').forEach(pre=>{
                pre.innerHTML= `<b>$_> ${pre.querySelector('code').className.substring(9)}</b>\n\n` + pre.innerHTML
            })
            //Parse tags href attribute
            displays[3].querySelectorAll('a').forEach(tag=>{
                tag.setAttribute('href', tag.href.startsWith(r.url) ? `https://${tag.href.substring(r.url.length)}` : tag.href)
                tag.setAttribute('target', '_blank')
            })
            loader.exit(()=>{})
            //Tries to set edit button href attribute if admin page...
            try{
                document.querySelector('#edit').setAttribute('href', `${r.url}edit/${id}`)
                //Enables edit, add and commit buttons
                btns.forEach(btn=> btn.disabled=false) }
                catch(err){}
                }else{

                }
         r.error(err=>{l.exit(()=>{})})
        })
       })
    })
    //End of div functionality..

     //Adds functionality to modal and dismiss button...
     const dis_mod=[ document.querySelector('#dismiss'), document.querySelector('#exampleModalCenter')]
     dis_mod.forEach(elem=> elem.onclick=()=>dismiss(r))
    //Ends functionality...

    //Adds functionality of commit and delete button
    try{
    //Commit button
      btns[1].addEventListener('click', ()=>{
        const data={'num': id, 'content' :document.querySelector('#content').innerHTML, 'type': 'old'}
        //Creates new Request Object
        h.fresh(data, 'POST', 'blog')
        //On load
        h.loaded((response,status)=>{
            if(status==200 && response['stat']=='added'){
                    //TODO
                    document.querySelector(`#blog-${id}`).remove()
                }
                else{
                   //TODO
                }
        })
        h.error(err=>{})
    })

    //Delete button
    btns[2].addEventListener('click', ()=>{
        //Creates new Request Object
        h.fresh({'num':id}, 'DELETE', 'delete')
        //On load
        h.loaded((response,status)=>{
            if(status==200 && response['stat'] =='deleted'){
                    pop_up(['Deleted', 'Successfully deleted', 'Dismiss to continue'], true)
                    document.querySelector(`#blog-${id}`).remove()
                    setTimeout(()=> document.getElementById('exampleModalCenter').click(), 3000)
                }
                else{
                    console.log('else')
                }
        })
        h.error(err=>{console.log('Error')})
    })
    //End functionality
    }catch(err){}

    dismiss=r=>{
        r.cancel()
        displays.forEach(element=>element.innerHTML='')
        try{btns.forEach(btn=>btn.disabled=true)}catch(err){}
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

})