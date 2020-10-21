document.addEventListener('DOMContentLoaded', ()=>{
    let request = null
    let id = null
    const pop__up=document.querySelector('#alert')
    const dismisal_btns=[
                         document.querySelector('#dismiss'),
                         document.querySelector('#exampleModalCenter')
                        ]
    const span = document.querySelector('#loader')
    const displays=[ document.querySelector('#titlep'),  document.querySelector('#namep'),  document.querySelector('#emailp'),  document.querySelector('#content')]
    const btns = []
    try{    // tries to get add edit and commit buttons
        btns.push(document.querySelector('.edit'))
        btns.push(document.querySelector('#add'))
        btns.push(document.querySelector('#delete'))
    }
    catch(err){
        console.log(err)
    }
    const validate = () => displays.filter( display => display.innerHTML != '').length == 4
    const disable = (bool) => btns.forEach(btn => btn.disabled = bool)  // disables buttons
    const disable_ = (bool) => dismisal_btns.forEach(elem => elem.disabled = bool)
    const dismiss = () =>{  // dismisses modal and discards modal content.
        cls()
        request.cancel()
        displays.forEach(element=>element.innerHTML='')
        try{
            btns.forEach(btn=>btn.disabled=true)
        }
        catch(err){}
        pop__up.display = 'none'
    }
//    document.querySelector('.modal-content').onclick=(e)=>{ // hides pop up
//        if(e.target.id != pop__up.id) cls()
//    }
    document.querySelectorAll('.div-blog').forEach(div=>{   // selects all div blogs
        div.addEventListener('click', ()=>{ // add click listener to all div blogs
            id=div.dataset.blog
            try{
                disable(true)
            }
            catch(err){
                console.log(err)
            }
            request = new Request()
            const loader= new Loader(span)
            loader.load('Fetching data')
            const data={
                        'num': div.dataset.blog,
                        'admin': document.querySelector('#preview').dataset.admin
                       }
            request.fresh(data, 'POST', 'blogs')    // send request with data
            request.loaded((response, status)=>{ // request loaded
                if(status == 200){
                   const id=div.dataset.blog
                   const resp=[ response['title'], response['name'], response['email'], response['content']]
                   displays.forEach(    // sets content of display
                       (element, index)=> element.innerHTML= index==1 ? `By ${resp[index]}` : resp[index])
                   displays[3].style.maxHeight= window.innerHeight - 290 + 'px' // makes modal not overflow
                   displays[3].style.overflowY= 'auto'
                   displays[3].querySelectorAll('pre').forEach(pre=>{
                        const code_class = pre.querySelector('code').className.substring(9)
                        pre.innerHTML= `<b>$_> ${code_class.charAt(0).toUpperCase()+code_class.substring(1)}</b>\n\n` + pre.innerHTML
                   })
                   loader.exit(true, '')
                   try{ // tries to set edit button href and disable buttons.
                        document.querySelector('#id').value=id
                        document.querySelector('form').onsubmit=()=>{
                            if (!validate()) return
                            disable(true)
                            return validate()
                        }
                        disable(false)  // Enables buttons
                   }
                   catch(err){
                        console.log(err)
                   }
                }
                else{
                    pop_up(['Error', 'Couldn\'t complete request', '$-> err_conn'], false)
                    loader.exit(true, '')
                }
            })
            request.error(()=>{ // request on error
                loader.exit(true, '')
                pop_up(['Error', 'Check your internet connection.', '$-> err_int_conn'], false)
            })
            request.timeout(()=>{
                loader.exit(true, '')
                pop_up(['Timeout', 'Connection timeout', '$-> conn_timeout'])
            })
        })
    })

    dismisal_btns.forEach(elem=>{
        elem.onclick = (e) => {
            if(e.target.id=='dismiss' || e.target.id=='exampleModalCenter') dismiss()
        }
    })
    try{
        btns[1].onclick = () =>{    // commit btn onclick event.
            if(!validate()) return
            disable(true)
            const commit_r = new Request()    // new request object to
            const commit=new Loader(btns[1])
            commit.load('Committing')
            const data={    // data to be sent to server
                        'num': id,
                        'content' :document.querySelector('#content').innerHTML,
                        'type': 'old'
                       }
            commit_r.fresh(data, 'POST', 'blog')    // send request to server.
            commit_r.loaded((response, status)=>{   // commit loaded..
                if(status==200 && response['stat']=='added'){
                    document.querySelector(`#blog-${id}`).remove()
                    document.querySelector('#exampleModalCenter').click()
                }
                else{
                    pop_up( // error message if commit loads with an error.
                           [
                            'Commit Failure',
                            'The post has not been validated',
                            'Please Retry'],
                            false
                           )
                    disable(false)  // renables button.
                    }
                commit.exit(false, 'Commit')    // exits commiting.
            })
            commit_r.error(()=>{
                pop_up(
                       [
                        'Connection Error',
                        'Couldn\'t establish a connection to server',
                        '$-> err_no_connection'],
                        false
                       )
                commit.exit(false, 'Commit')    // exits commiting.
                disable(false)  // renables button.
            })
            commit_r.timeout(()=>{
                pop_up(
                       [
                        'Connection Timeout',
                        'Couldn\'t validate',
                        '$-> err_timeout'],
                        false
                       )
                commit.exit(false, 'Commit')    // exits commiting.
                disable(false)  // renables button.
             })
        }

        btns[2].onclick = () =>{    // delete event listener
            if(!validate()) return
            disable(true)
            const erase_=new Request()
            const erase=new Loader(btns[2])
            erase.load('Deleting')
            erase_.fresh({'num':id}, 'DELETE', 'delete')    // erase data sent.
            erase_.loaded((response, status)=>{
                if(status==200 && response['stat'] =='deleted'){
                        document.querySelector(`#blog-${id}`).remove()
                        document.querySelector('#exampleModalCenter').click()
                    }
                    else{
                        pop_up(
                               [
                                'Deletion Error',
                                'The post has not been deleted',
                                'Please Retry'],
                                false
                               )
                        disable(false)
                    }
                    erase.exit(false, 'Delete')
            })
            erase_.error(()=>{
                pop_up(
                       ['Connection Error',
                        'Couldn\'t establish a connection to server',
                        '$-> err_connection'],
                        false
                       )
                erase.exit(false, 'Delete')
                disable(false) })
            erase_.timeout(()=>{
                pop_up(
                       [
                        'Connection Timeout',
                        'Couldn\'t delete',
                        '$-> err_timeout'],
                        false
                      )
                erase.exit(false, 'Delete')
                disable(false) })
        }
    }
    catch(err){
        console.log(err)
    }
})