class Request{
    request=null
    url=`${location.protocol+'//'}${document.domain}:${location.port}/`

    fresh=(data, method, url)=>{
        //Request cancels request after 15seconds.
        this.request=new XMLHttpRequest()
        this.request.timeout=120000
        const datas=new FormData()
        datas.append('data',JSON.stringify(data))
        this.request.open(method, this.url+url, true)
        this.request.send(datas)
    }
    loaded= func=>{
        this.request.onload=(e)=>{
            const status = this.request.status
            try{
                const response = JSON.parse(this.request.responseText)
                func(response, status)
            }
            catch(err){
                console.log(err)
            }
        }
     }

    cancel=()=> this.request.abort()
    timeout=func=> this.request.ontimeout=()=>func()
    error=func=> this.request.onerror=err=>func(err)
}
