document.addEventListener('DOMContentLoaded', ()=>{
    // If scrolled to bottom, load the next 10 template.
    template=()=>{
        return `<div class="jumbotron jumb">
                <div class="img">
                <img src="https://stackabuse.s3.amazonaws.com/media/encoding-and-decoding-base64-strings-python-1.png" class="img_logo"  alt="Template image">
                </div>
                <div class="text">
                <span class="header">Base 64 Encoding</span>
                <span class="pre_content">In computer science, Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation.</span>
                </div>
                <div class="btns">
                    <button class="upvote">
                        <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-chevron-double-up" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708l6-6z"/>
                            <path fill-rule="evenodd" d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                        </svg>
                        <span id="u_votes">10</span>
                    </button>
                    <button class="downvote">
                        <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-chevron-double-down" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                            <path fill-rule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                        </svg>
                        <span id="d_votes">10</span>
                    </button>
                </div>
            </div>`
    }
    window.onscroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) more()
     };

     const more=()=>{
        // Creates new Request
        const request=new Request();
        // Initializes and sends request.
        request.fresh({'type': 'templates', 'len': document.querySelectorAll('.jumb').length}, 'POST', 'learn');
        // When request loads.
        request.loaded((response, status)=>{
            console.log(response)
            document.querySelector('.container').innerHTML+=" "+template()
            document.querySelector('.container').innerHTML+=" "+template()
            document.querySelector('.container').innerHTML+=" "+template()
            document.querySelector('.container').innerHTML+=" "+template()
            document.querySelector('.container').innerHTML+=" "+template()
            document.querySelector('.container').innerHTML+=" "+template()
        })

     }


})