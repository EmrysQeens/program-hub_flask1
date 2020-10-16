document.addEventListener('DOMContentLoaded', ()=>{
    const prev_btn = document.querySelector('#prev')
    const next_btn = document.querySelector('#next')
    const content = document.querySelector('#content_full')
    const title = document.querySelector('#title')
    const img = document.querySelector('#img')

    const disable = (bool) =>{
        prev_btn.disabled = bool
        next_btn.disabled = bool
    }

    const upload=(e)=>{
        disable(true)
        const request = new Request()
        const id = parseInt(e.target.parentElement.dataset.id)
        const bool = e.target.id == 'next'
        request.fresh({'id': id, 'nxt': bool}, 'POST', '/learn/dummy')
        request.loaded((response, status)=>{
            if(status == 200){
                img.src = response['img']
                title.innerText = response['title']
                content.innerHTML = response['content']
                if (! response['disable']) {
                    prev_btn.disabled = false
                    next_btn.disabled = false
                }
                else e.target.disabled = true
                e.target.parentElement.dataset.id = bool ? id + 1 : id - 1
                window.scrollTo(0,0)
                window.history.replaceState('', `${response['title']}`, `/learn/${response['title']}`)
            }
            else disable(true)
        })
        request.timeout(()=> disable(true))
        request.error(()=> disable(true))
    }

    document.querySelectorAll('.c').forEach(btn=>{
        btn.onclick = (e) => upload(e)
    })

})