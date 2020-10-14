document.addEventListener('DOMContentLoaded', ()=>{
    // If scrolled to bottom, load the next 10 template.
    template=(id, title, img, content, upvote, downvote)=>{
        return `<div class="jumbotron jumb">
                <a href="/learn/${title}">
                <div class="img">
                <img src=${img} class="img_logo"  alt="Template image">
                </div>
                <div class="text">
                <span class="header">${title}</span>
                <span class="pre_content">${content}</span>
                </div>
                </a>
                <div class="btns" data-id="${id}">
                    <button class="upvote b" id="upvote" style="outline: none;">
                        <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-chevron-double-up" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708l6-6z"/>
                            <path fill-rule="evenodd" d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                        </svg>
                        <span id="u_votes">${upvote}</span>
                    </button>
                    <button class="downvote b" id="downvote" style="outline: none;">
                        <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-chevron-double-down" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                            <path fill-rule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                        </svg>
                        <span id="d_votes">${downvote}</span>
                    </button>
                </div>
                </div>`
    }

    let end = false
    let is_loading = false

    window.onscroll = () => {
        if (window.innerHeight + window.scrollY >= 0.95 * document.body.offsetHeight && !end && !is_loading) more()
     };

     const more=()=>{
        // Creates new Request
        const request = new Request();
        // Initializes and sends request.
        is_loading = true
        request.fresh({'type': 'templates', 'len': document.querySelectorAll('.jumb').length}, 'POST', 'learn');
        // When request loads.
        request.loaded((response, status)=>{
            if (status == 200){
                console.log(response['templates'])
                response['templates'].forEach((temp, index)=>{
                    document.querySelector('.cont').innerHTML+=" "+template(temp['id'], temp['title'], temp['img'], temp['content'], temp['up_votes'], temp['down_votes'])
                })
                end = response['end']
                is_loading = false
            }

            //Adds event listener to all button when page content is appended to
            reboot()
        })

     }


     const vote=(bool, e)=>{
        const r=new Request();
        const mail_address=localStorage.getItem('user_mail')
        if(mail_address == "null")
            request_mail_address()
        if(mail_address == "null")
            return
        const parent = e.target.parentElement
        r.fresh({'address': mail_address, 'upvote': bool, 'id': parent.dataset.id}, 'POST', 'like_unlike')
        r.loaded((response, status)=>{
            if(response['stat'] == 'success' && status == 200){
               const value=response['value']
               parent.querySelector('#u_votes').innerHTML= value['like']
               parent.querySelector('#d_votes').innerHTML= value['dislike']
               console.log(response['value']['like'])
               }
        })
     }

     const reboot=()=>{
        document.querySelectorAll('.upvote').forEach(btn=>{
            btn.onclick=(e)=> vote(true, e)
        })
        document.querySelectorAll('.downvote').forEach(btn=>{
            btn.onclick=(e)=> vote(false, e)
        })
     }

     reboot()


})