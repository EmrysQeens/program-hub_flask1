document.addEventListener('DOMContentLoaded', ()=>{
    const prev_btn = document.querySelector('#prev')
    const next_btn = document.querySelector('#next')
    const content = document.querySelector('#content_full')
    const title = document.querySelector('#title')
    const img = document.querySelector('#img')
    const id_ = document.querySelector('#id_')

    const disable = (bool) =>{
        prev_btn.disabled = bool
        next_btn.disabled = bool
    }

    const disable_ = (b,bo) =>{
        prev_btn.disabled = bo
        next_btn.disabled = b
    }

    let is_next_pressed = false
    let next_disabled = false
    let prev_disabled = false

    const state = () =>{
        next_disabled = next_btn.disabled
        prev_disabled = prev_btn.disabled
    }

    const scroll_ = () =>{
        scroll = setInterval(()=>{
            window.scrollTo(0, window.scrollY-5)
            if(window.scrollY == 0) clearInterval(scroll)
        },10)
    }

    const upload=(e)=>{
        state()
        disable(true)
        const request = new Request()
        const id = parseInt(e.target.parentElement.dataset.id)
        const bool = e.target.id == 'next'
        request.fresh({'id': id, 'nxt': bool}, 'POST', '/learn/dummy')
        request.loaded((response, status)=>{
            console.log(response['disable'])
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
                disable_(next_disabled, prev_disabled)
            }
        })
        request.timeout(()=> {
            pop_up(['Connection Timeout', 'The connection to server was timed out please retry', 'timeout_err'], false)
            disable_(next_disabled, prev_disabled)
        })
        request.error(()=>{
            pop_up(['Connection Error', 'Couldn\'t fetch data', 'connection_err'], false)
            disable_(next_disabled, prev_disabled)
        })
    }

    document.querySelectorAll('.c').forEach(btn=>{
        btn.onclick = (e) => upload(e)
    })


})