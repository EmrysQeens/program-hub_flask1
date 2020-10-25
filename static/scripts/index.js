window.onload=()=>{
      const typer=document.querySelector('#hd_blinker')
      bool=true
      setInterval(()=>{
        typer.innerText= bool ? '$-> Program~Hub' : '$-> Program~Hub _'
        bool=! bool} , 1000)

      alert('Welcome to Program~Hub inspired by the lectures taught by the cs50 geeks.')

      document.querySelector('#mail').onclick = () => request_mail_address()

      const mail = document.querySelector('#address')
      const subscribe = document.querySelector('#subscribe')
      const disable = (bool) => {
        subscribe.disabled = bool
      }
      mail.disabled = false
      mail.oninput = () => subscribe.disabled = !mail_test.test(mail.value)
      subscribe.onclick = (e) =>{
        if (!mail_test.test(mail.value))
          return
        disable(true)
        const loader = new Loader(subscribe)
        loader.load('Subscribing')
        const request = new Request()
        request.fresh({'address' : mail.value}, 'POST', 'subscribe')
        request.loaded((response, status)=>{
            if (status==200 && response['subscribed']){
                pop_up(['Subscribed', 'Email notification will be sent to you when new learn is added', 'Thanks'], true)
                mail.value = '' }
            else
                pop_up(['Subscribed', 'Already subscribed', 'Thanks'], true)
            loader.exit(false, 'Subscribe')
        })

         request.timeout(()=> {
            pop_up(['Connection Timeout', 'The connection to server was timed out please retry', 'timeout_err'], false)
            loader.exit(false, 'Subscribe')
            disable(false)
        })
        request.error(()=>{
            pop_up(['Connection Error', 'Couldn\'t Validate', 'connection_err'], false)
            loader.exit(false, 'Subscribe')
            disable(false)
        })

      }

      }