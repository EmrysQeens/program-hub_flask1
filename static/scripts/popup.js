document.addEventListener('DOMContentLoaded', ()=>{
    const pop__up=document.querySelector('#alert')
    const alert_comp=[document.querySelector('#msg_h') ,document.querySelector('#msg_b') ,document.querySelector('#msg_f')]


    const scroll_ = () =>{
        scroll = setInterval(()=>{
            window.scrollTo(0, window.scrollY-5)
            if(window.scrollY == 0) clearInterval(scroll)
        },10)
    }

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