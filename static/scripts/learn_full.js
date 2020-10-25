document.addEventListener('DOMContentLoaded', ()=>{
    const prev_btn = document.querySelector('#prev')
    const next_btn = document.querySelector('#next')
    const content = document.querySelector('#content_full')
    const title = document.querySelector('#title')
    const img = document.querySelector('#img')
    const id_ = document.querySelector('#id_')
    const lent = document.querySelector('#controls').dataset.lent

    const disable = (bool) =>{  // disables both button with same boolean value
        prev_btn.disabled = bool
        next_btn.disabled = bool
    }

    const scroll_ = () =>{
        scroll = setInterval(()=>{
            window.scrollTo(0, window.scrollY-5)
            if(window.scrollY == 0) clearInterval(scroll)
        },10)
    }

    const disable_ = (b,bo) =>{
        prev_btn.disabled = bo
        next_btn.disabled = b
    }

    let next_disabled = false
    let prev_disabled = false

    const state = () =>{
        next_disabled = next_btn.disabled
        prev_disabled = prev_btn.disabled
    }

    document.querySelectorAll('.c').forEach(btn=>  btn.onclick = (e) => upload(e))

    const upload = (e) =>{
        let id = parseInt(e.target.parentElement.dataset.id)
        const bool = e.target.id == 'next'
        const i_d = bool ? id+1 : id-1
        if ( ! ( i_d >= 0 && i_d <= lent)) return
        state()
        disable[true]
        const request = new Request()
        request.fresh({'id': id, 'nxt': bool}, 'POST', 'learn/change')
        request.loaded((response, status)=>{
            if(status == 200){
                scroll_()
                img.src = response['img']
                title.innerText = response['title']
                try{ id_.value = response['id'] }catch(err){ console.log(err)}
                content.innerHTML = response['content']
                id = bool ? id + 1 : id - 1
                e.target.parentElement.dataset.id = id
                disable(false)
                if (response['disable']){
                    if ( id == 0) prev_btn.disabled = true
                    if ( id == lent) next_btn.disabled = true
                }
                window.history.replaceState('', `${response['title']}`, `/learn/${response['title']}`)
        }
        request.timeout(()=> {
            pop_up(['Connection Timeout', 'The connection to server was timed out please retry', 'timeout_err'], false)
            disable_(next_disabled, prev_disabled)
        })
        request.error(()=>{
            pop_up(['Connection Error', 'Couldn\'t fetch data', 'connection_err'], false)
            disable_(next_disabled, prev_disabled)
        })
    })
    }

})