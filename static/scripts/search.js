document.addEventListener('DOMContentLoaded',()=>{
    const suggestion= document.querySelector('#suggestions')
    const select= document.querySelector('#relate')
    const textbox= document.querySelector('#textbox')
    const search= document.querySelector('#search')
    const btn=document.querySelector('#btn')
    const r=new Request();
    let is_r=null
    const regex=/^is:(err|title) [ a-z 0-9 A-Z ]+$/


    select.onchange=()=> textbox.readOnly= this.value=='NAN'

    textbox.oninput= function(){
       const bool= regex.test( this.value )
       suggestion.style.display= bool ? 'block' :'none'
       btn.disabled= ! bool

       if (bool){
            const data={'type': select.value,
                        'text': this.value}

            caller= (bool && is_r==null) ? ()=>{
                r.fresh(data, 'POST', 'search')
                is_r=r} : ()=>{
                r.cancel()
                r.fresh(data, 'POST', 'search')
                is_r=r
                }
            caller()

            r.loaded((response, status)=>{
                if(status == 200){
                    suggestion.innerHTML=''
                    for (rep of response.response) suggestion.innerHTML+=`<p data-id='${rep['id']}'>${rep['title']}</p><hr>`
                    suggestion.style.display= textbox.value=='' ? 'none' : 'block';
                    suggestion.querySelectorAll('p').forEach(p=> p.onclick=()=> {
                        textbox.value= (/^is:(err) [ a-z 0-9 A-Z ]+$/.test(this.value) ? 'is:err ' : 'is:title ') +p.innerHTML.toLowerCase()
                        suggestion.style.display='none'} )
                }
                else{ }//TODO
            })
            r.error(()=>{})
            r.timeout(()=>{})
       }
    }
})