
class Request{
    request=null


    fresh=(div,...func)=>{
        this.request=new XMLHttpRequest()
        const admin=document.querySelector('#preview').dataset.admin
        //Cancels request after 15seconds.
        this.request.timeout=15000
        const num=new FormData()

        //Appends the id of blog to be requested
        num.append('num',JSON.stringify({'num':div.dataset.blog, 'admin':admin}))


         this.request.open('POST',`${location.protocol+'//'}${document.domain}:${location.port}/blogs`)

            //On load
            this.request.onload=(e)=>{
                func[0](JSON.parse(this.request.responseText),e)
                this.loaded(false)
            }

            this.request.onprogress=(e)=> func[1](e)

            //On error
            this.request.onerror=(e)=>func[2](e)

            //this.request.onreadystatechange=(e)=> console.log(e.loaded)

            this.request.send(num)

    }
    cancel=()=> this.request.abort()
    timeout=(fun)=> this.request.ontimeout(fun())
    loaded=(bool)=>{
      try{
        document.querySelector('.edit').disabled=bool
        document.querySelector('#add').disabled=bool
        document.querySelector('#delete').disabled=bool
        }
        catch(err){

        }
    }



}
