document.addEventListener('DOMContentLoaded', ()=>{
    const prev_btn = document.querySelector('#prev')
    const next_btn = document.querySelector('#next')
    const content = document.querySelector('#content_full')
    const title = document.querySelector('#title')
    const img = document.querySelector('#img')
    const id_ = document.querySelector('#id_')
    const pop__up=document.querySelector('#alert')
    const alert_comp=[document.querySelector('#msg_h') ,document.querySelector('#msg_b') ,document.querySelector('#msg_f')]

    const disable = (bool) =>{
        prev_btn.disabled = bool
        next_btn.disabled = bool
    }

    const scroll_ = () =>{
        scroll = setInterval(()=>{
            window.scrollTo(0, window.scrollY-5)
            if(window.scrollY == 0) clearInterval(scroll)
        },10)
    }

    const upload=(e)=>{
        disable(true)
        const request = new Request()
        const id = parseInt(e.target.parentElement.dataset.id)
        const bool = e.target.id == 'next'
        request.fresh({'id': id, 'nxt': bool}, 'POST', '/learn/dummy')
        request.loaded((response, status)=>{
            if(status == 200){
                scroll_()
                img.src = response['img']
                title.innerText = response['title']
                try{ id_.value = response['id'] }catch(err){ console.log(err)}
                content.innerHTML = response['content']
                if (! response['disable']) disable(false)
                else {
                    e.target.disabled = true
                    const dis = e.target.id == next_btn.id ? prev_btn.disabled = false : next_btn.disabled = false
                }
                e.target.parentElement.dataset.id = bool ? id + 1 : id - 1
                window.history.replaceState('', `${response['title']}`, `/learn/${response['title']}`)
            }
            else {
                pop_up(['Server Error', 'Please retry', 'err_server'], false)
                disable(true)
            }
        })
        request.timeout(()=> {
            pop_up(['Connection Timeout', 'The connection to server was timed out please retry', 'timeout_err'], false)
            disable(true)
        })
        request.error(()=>{
            pop_up(['Connection Error', 'Couldn\'t fetch data', 'connection_err'], false)
            disable(true)
        })
    }

    document.querySelectorAll('.c').forEach(btn=>{
        btn.onclick = (e) => upload(e)
    })

    pop_up=(messages, e)=>{
        scroll_()
        pop__up.style.top=window.scrollY+'px'
        pop__up.style.background= e ? 'linear-gradient(#42275a, #734b6d)' : 'red'
        pop__up.style.display='block'
        alert_comp.forEach((component, index)=> component.innerText= messages[index])
        pop__up.style.animationName='open'
        pop__up.style.animationDuration='2s'
        pop__up.animationPlayState='running'
     }

    window.onscroll=()=>{
       pop__up.style.top=window.scrollY+'px'
    }

    //Alert close button
    document.querySelector('#close').onclick=()=>{
       pop__up.style.animationName='close'
       pop__up.style.animationDuration='2s'
       pop__up.animationPlayState='running'
    }

})