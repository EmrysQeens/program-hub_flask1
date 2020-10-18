document.addEventListener('DOMContentLoaded', ()=>{
    const pop__up=document.querySelector('#alert')
    let id=null  /* This helps to set id of blog clicked so it can be used for request */
    const r=new Request()
    const btns=[document.querySelector('.edit'), document.querySelector('#add'), document.querySelector('#delete')]
    const displays=[ document.querySelector('#titlep'),  document.querySelector('#namep'),  document.querySelector('#emailp'),  document.querySelector('#content')]

    //Add functionality to all divs
    document.querySelectorAll('.div-blog').forEach(div=>{
      //Add click listener
      div.addEventListener('click', ()=>{
        //Creates a new loader to load a span element
        const loader= new Loader(document.querySelector('#loader'))
        loader.load('fetching data')
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
            displays.forEach((element, index)=> element.innerHTML= index==1 ? `By ${resp[index]}` : resp[index])
            //Set maximum height to device screen
            displays[3].style.maxHeight= window.innerHeight - 100 + 'px'
            displays[3].style.overflowY= 'auto'
            //Add code block language
            displays[3].querySelectorAll('pre').forEach(pre=>{
                const code_class = pre.querySelector('code').className.substring(9)
                pre.innerHTML= `<b>$_> ${code_class.charAt(0).toUpperCase()+code_class.substring(1)}</b>\n\n` + pre.innerHTML
            })
            //Parse tags href attribute
            displays[3].querySelectorAll('a').forEach(tag=>{
                tag.setAttribute('href', tag.href.startsWith(r.url) ? `https://${tag.href.substring(r.url.length)}` : tag.href)
                tag.setAttribute('target', '_blank')
            })
            loader.exit(()=>{})
            //Tries to set edit button href attribute if admin page...
            try{
                document.querySelector('#id').value=id
                document.querySelector('form').onsubmit=()=> disable(true)
                //Enables edit, add and commit buttons
                disable(false) }
            catch(err){}
            }
           else{
                    loader.exit(true, '')
                }
        })
        //Onerror
        r.error(()=>{
            loader.exit(true, '')
            pop_up(['Error', 'Connection error', 'Check your internet connection.'])
            })
        //On timeout
        r.timeout(()=>{
            loader.exit(true, '')
            pop_up(['Error', 'Connection timeout', 'Please retry'])
            })
       })
    })
    //End of div functionality..

     //Adds functionality to modal and dismiss button...
     const dis_mod=[ document.querySelector('#dismiss'), document.querySelector('#exampleModalCenter')]
     dis_mod.forEach(elem=> elem.onclick=(e)=> {
            if(e.target.id=='dismiss' || e.target.id=='exampleModalCenter') dismiss()
        }) // TODO target
    //Ends functionality...

    //Adds functionality of commit and delete button
    try{
    //Commit button
      btns[1].addEventListener('click', ()=>{
        const h=new Request()
        const commit=new Loader(btns[1])
        commit.load('Committing')
        disable(true)
        const data={'num': id, 'content' :document.querySelector('#content').innerHTML, 'type': 'old'}
        //Creates new Request Object
        h.fresh(data, 'POST', 'blog')
        //On load
        h.loaded((response, status)=>{
            if(status==200 && response['stat']=='added'){
                    pop_up(['Committed Successfully', 'The post has been validated', 'Continue..'], true)
                    document.querySelector(`#blog-${id}`).remove()
                    document.querySelector('#exampleModalCenter').click()
                }
                else{
                   pop_up(['Commit Failure', 'The post has not been validated', 'Please Retry'], false)
                   disable(false)
                }
            commit.exit(false, 'Commit')
        })
        h.error(()=>{
            pop_up(['Connection Error', 'Couldn\'t establish a connection to server', 'Please Retry'], false)
            commit.exit(false, 'Commit')
            disable(false)
        })
        h.timeout(()=>{
            pop_up(['Connection Timeout', 'Couldn\'t validate', 'Please Retry'], false)
            commit.exit(false, 'Commit')
            disable(false)
         })
    })

    //Hides pop up if any part of modal content is clicked
    document.querySelector('.modal-content').onclick=(e)=>{
        if(e.target.id != pop__up.id) {
            pop__up.style.animationName='close'
            pop__up.style.animationDuration='2s'
            pop__up.animationPlayState='running'
            pop__up.onAnimationEnd=()=> pop__up.style.display='none'
        }
    }

    //Delete button
    btns[2].addEventListener('click', ()=>{
        const d=new Request()
        const erase=new Loader(btns[2])
        erase.load('Deleting')
        disable(true)
        //Creates new Request Object
        d.fresh({'num':id}, 'DELETE', 'delete')
        //On load
        d.loaded((response,status)=>{
            if(status==200 && response['stat'] =='deleted'){
                    pop_up(['Deleted', 'Successfully deleted', 'Dismiss to continue'], true)
                    document.querySelector(`#blog-${id}`).remove()
                    document.querySelector('#exampleModalCenter').click()
                }
                else{
                    pop_up(['Deletion Error', 'The post has not been deleted', 'Please Retry'], false)
                    disable(false)
                }
                erase.exit(false, 'Delete')
        })
        d.error(()=>{
            pop_up(['Connection Error', 'Couldn\'t establish a connection to server', 'Please Retry'], false)
            erase.exit(false, 'Delete')
            disable(false) })
        d.timeout(()=>{
            pop_up(['Connection Timeout', 'Couldn\'t delete', 'Please Retry'], false)
            erase.exit(false, 'Delete')
            disable(false) })
    })
    //End functionality
    }catch(err){}

    dismiss=()=>{
        r.cancel()
        displays.forEach(element=>element.innerHTML='')
        document.querySelector('#close').click()
        try{btns.forEach(btn=>btn.disabled=true)}catch(err){}
    }

    //Disable edit, commit and delete btn if one is clicked
         disable=(bool)=>btns.forEach(btn=> btn.disabled=bool)

})