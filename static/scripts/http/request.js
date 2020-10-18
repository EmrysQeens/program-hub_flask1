class Request{
    request=null
    url=`${location.protocol+'//'}${document.domain}:${location.port}/`

    fresh=(data, method, url)=>{
        //Request cancels request after 15seconds.
        this.request=new XMLHttpRequest()
        this.request.timeout=25000
        const datas=new FormData()
        datas.append('data',JSON.stringify(data))
        this.request.open(method, this.url+url)
        this.request.send(datas)
    }
    loaded=func=>{
        this.request.onload=()=>{
            const response=JSON.parse(this.request.responseText)
            const status=this.request.status
            func(response, status)
        }
     }

    cancel=()=> this.request.abort()
    timeout=func=> this.request.ontimeout=()=>func()
    error=func=> this.request.onerror=err=>func(err)
}