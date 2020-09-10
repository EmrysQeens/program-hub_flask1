class Loader{
    interval=null
    elem=document.querySelector('#loader')
    constructor(){

    }

    load=()=>{
        const l=['Loading.','Loading..','Loading...']
        this.elem.style.display='block'
        let itr=0
        this.interval=setInterval(()=>{
            this.elem.innerHTML=l[itr==3 ? itr=0 :itr++]
        },1000)
    }

    exit=(func)=>{
        clearInterval(this.interval)
        this.elem.style.display='none'
        func()
    }
}



