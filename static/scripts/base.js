if(localStorage.getItem("user_mail")== null)
    localStorage.setItem("user_mail", "null")


const mail_test=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const request_mail_address=()=>{
    mail_address=prompt('Enter your mail Please')
    localStorage.setItem('user_mail', mail_test.test(mail_address) ? mail_address.toLowerCase() : null)
}

document.addEventListener('DOMContentLoaded', ()=>{
    is_up = true
    const toggler = document.querySelector('.navbar-toggler')
    toggler.onclick=()=>{
        toggler.style.animationFillMode='forwards'
        toggler.style.animationDuration='1s'
        if(is_up) toggler.style.animationName='roll_a'
        else toggler.style.animationName='roll_b'
        is_up = !is_up
        toggler.animationPlayState='running'
    }

})


