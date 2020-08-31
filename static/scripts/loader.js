class Loader{
    interval=null
    constructor(elem){
        this.elem=elem
    }

    load=(func)=>{
        const l=['Loading.','Loading..','Loading...']
        func()
        let itr=0
        this.interval=setInterval(()=>{
            this.elem.innerHTML=l[itr==3 ? itr=0 :itr++]
            console.log('joy')
        },1000)
    }

    exit=(func)=>{
        clearInterval(this.interval)
        func()
    }
}

