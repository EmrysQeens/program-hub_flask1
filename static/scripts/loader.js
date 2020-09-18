class Loader{
    interval=null
    elem=null
    constructor(elem){
        this.elem=elem
    }

    load=(text)=>{
        const l=[ '.' ,'..','...']
        this.elem.style.display='inline-block'
        let itr=0
        this.interval=setInterval(()=>{
            this.elem.innerHTML=text+l[itr==3 ? itr=0 :itr++]
        },1000)
    }

    exit=(bool, value)=>{
        clearInterval(this.interval)
        this.interval=null
        this.elem.innerHTML=value
        this.elem.style.display= bool ? 'none' : 'inline-block'
    }
}



