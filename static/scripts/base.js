if(localStorage.getItem("user_mail")== null)
    localStorage.setItem("user_mail", "null")


const mail_test=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const request_mail_address=()=>{
    mail_address=prompt('Enter your mail Please')
    localStorage.setItem('user_mail', mail_test.test(mail_address) ? mail_address.toLowerCase() : null)
}
