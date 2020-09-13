document.addEventListener('DOMContentLoaded',()=>{
    const suggestion= document.querySelector('#suggestions')
    const select= document.querySelector('#relate')
    const textbox= document.querySelector('#textbox')
    const search= document.querySelector('#search')
    const r=new Request();
    let is_r=null


    select.onchange=()=> textbox.readOnly= this.value=='NAN'

    textbox.oninput= function(){
       const bool= this.value == ""
       suggestion.style.display= bool ? 'none' : 'block'
       if (!bool && this.value.length > 0){
            const data={'type': select.value,
                        'text': this.value}
           if(is_r!=null){
                r.cancel()
                r.fresh(data, 'POST', 'search')
                is_r=null
            }
            else r.fresh(data, 'POST', 'search')

            r.loaded((response, status)=>{
                if(status == 200){
                    console.log(response.response)
                    suggestion.innerHTML=''
                    for (rep of response.response) suggestion.innerHTML+=`<p data-id='${rep['id']}'>${rep['title']}</p><hr>`
                    suggestion.style.display= textbox.value=='' ? 'none' : 'block';
                    suggestion.querySelectorAll('p').forEach(p=> p.onclick=()=> {
                        textbox.value=p.innerHTML
                        suggestion.style.display='none'} )
                }
                else{ }//TODO
            })
            r.error(()=>{})
            r.timeout(()=>{})
       }
    }
})