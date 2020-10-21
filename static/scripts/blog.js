document.addEventListener('DOMContentLoaded', ()=>{
  window.onload = async () =>{
    const blog_content = document.querySelector('#blog_content')  //blog content
    const create_btn = document.querySelector('#create')    //create || save button
    const preview_btn = document.querySelector("#btn_preview")  //preview button
    const select=document.querySelector('#relate')  //drop down list
    const content=document.querySelector('#content')    //editor initializer

    /*
        elements {
            name = input element in with id name.
            email = input element with id email
            error = input element with id error
        }
    */
    const elements=[ document.querySelector('#name'), document.querySelector('#email'), document.querySelector('#title'), document.querySelector('#error')]
    /*
        displays: list{
            namep = h3 element in the preview modal
            emailp = p element in the preview modal
            namep = p element in the preview modal
            }
    */
    const displays=[ document.querySelector('#namep'),  document.querySelector('#emailp'),  document.querySelector('#titlep')]
    // keys for each element. i.e used to save in localStorage
    const keys=['name', 'email', 'title', 'error', 'select', 'content']

    //Regex to validate name and email
    const test=[/^[a-z A-Z][^0-9][^~`!@#$%^&*(){}\[\];:\"\'<,.>?\/\\|_+=-]* [a-z A-Z][^0-9][^~`!@#$%^&*(){}\[\];:\"\'<,.>?\/\\|_+=-]*$/, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]

    // this initializes the editor to the div with id blog_content
    await CKSource
        .Editor.create(blog_content, {
           toolbar: {
                items: [ "bold", "codeBlock", "undo",
                         "redo", "heading", "horizontalLine", "imageTextAlternative",
                         "imageResize", "imageUpload", "indent", "outdent", "italic",
                         "link", "numberedList", "bulletedList", "strikethrough", "subscript",
                         "superscript", "insertTable", "tableColumn", "tableRow", "mergeTableCells",
                         "tableCellProperties", "tableProperties", "underline"],
                shouldNotGroupWhenFull: true
            }
        })
        .then(editor => {
            window.editor = editor;
            console.log(Array.from(editor.ui.componentFactory.names()))
        })
        .catch(err => {
            console.error(err.stack)
        })

    // save to localStorage so not to loose typed work on page reload without creating and validates.
    const save = (index, value) => {
        localStorage.setItem(keys[index], value)
        validate()
    }
    // get item from localStorage
    const read = index => localStorage.getItem(keys[index])
    // disabled buttons [ create, preview]
    const disable = bool =>{
        create_btn.disabled = bool
        preview_btn.disabled = bool
    }
    // validates user input returns true if all cases matched and disables btn
    const validate = () =>{
        const tst = ! ( test[0].test(elements[0].value) &&
                        test[1].test(elements[1].value) &&
                        elements[2].value !='' &&
                        elements[3].value !='' &&
                        editor.getData() !='' &&
                        select.selectedIndex != (0 || 5 || 14))
        disable(tst)
        return tst
    }

    // adds event listener to elements to save value to local storage oninputs.
    elements.forEach((element, index) =>{
        element.oninput = () => save(index, element.value)
        if(index !=2 && index !=3){
            element.onchange = () =>{
                if( ! test[index].test(element.value) ) element.style.background='red'
            }
            element.onfocus=()=> element.style.background='#ffffff'
        }
    })
    select.onchange = () =>{
        save(4, select.selectedIndex)
        if (select.value == 'tn'){
            elements[3].value = 'NAN'
            elements[3].disabled = true
            return
        }
        elements[3].disabled = false
    }
    document.querySelector('.ck-editor__editable').oninput = () => save(5, editor.getData())

    // clears all fields
    const clear = () =>{
        elements.forEach(element=> element.value = '')
        select.selectedIndex = 0
        window.editor.setData('')
    }

    // makes all input disabled.
    const readonly = bool =>{
        elements.forEach(element => element.readOnly = bool)
        select.disabled = bool
        editor.isReadOnly = bool
    }

    // loads data in localStorage if it is not edited and return else jumps.
    const load_data = (bool) =>{
        if(!bool) {
            const hold = [document.querySelector('#hold'), document.querySelector('#type')]
            editor.setData(hold[0].innerHTML)
            select.value = hold[1].innerText
            hold.forEach(elem => elem.remove())
            validate()
            return
        }
        elements.forEach((element, index)=> element.value = localStorage.getItem(keys[index]))
        elements[3].value = select.selectedIndex != (0 || 5 || 14) ? select.value : 'NAN'
        select.selectedIndex = localStorage.getItem(keys[4])
        window.editor.setData(localStorage.getItem(keys[5]))
        validate()
    }

    load_data (create_btn.dataset.create == 'create')   // loading data saved to localStorage.

    create_btn.onclick = () =>{
        const bool_ = validate() // validates.
        if (bool_) return   // if not validation return.
        readonly(! bool_)   // if validation successful make input fields readonly 'not editable'.
        const bool = create_btn.dataset.create === 'create'  // checks if save or create.
        const loader = new Loader(create_btn)   // creates a new loader object.
        const request = new Request()   // creates new request object to send data to server.
        loader.load( bool ? 'Creating' : 'Saving')  // loads the loader object with create if being created or save if saved
        const text = create_btn.innerText   // get inner text of create button element.
        const data = bool ? // determines which data to send.
                           { 'name': elements[0].value,
                             'email': elements[1].value,
                             'title': elements[2].value,
                             'date': new Date().toGMTString(),
                             'content': editor.getData(),
                             'typ': select.selectedIndex != (0 || 5 || 14) ? select.value : 'NAN',
                             'error': elements[3].value,
                             'type':'new'}
                           :
                           {
                             'id': create_btn.value,
                             'content': editor.getData()
                           }
        const method = bool ? 'POST' : 'PUT' // determines method to send data if create it post else put.
        request.fresh(data, method, 'blog') // use the request object created to send data.
        request.loaded((response, status)=>{    // when response loads.
            if(status == 200 && response['stat'] === 'added' ){ // request sent and status of 200 is recieved.
                pop_up(
                       ['Success!!!',
                        'Your Post was successfully created.',
                        `An email will be sent to ${elements[1].value} when verified`],
                         true) // pops up a notification
                localStorage.clear() // clears localStorage of saved values if request successful.
                loader.exit(false, 'Create') // destroy loader object.
                clear() // clears input fields.
                window.history.replaceState('', 'Blog', '/blog') // replaces state of window.
                if (!bool) create_btn.dataset.create = 'create' // sets dataset to create if was saved.
            }
            else{
                pop_up(
                       ['Error!!!',
                       'Blog Post was not successfully created.',
                       'Please try again'],
                       false) // pops up a notification
                loader.exit(false, bool ? 'Create' : 'Save')  // destroy loader object.
            }
            readonly(!bool) //
            validate()
        })
        request.error(()=>{ // request on error.
            pop_up(
                   ['Error!!!',
                    'The Request was not successfully completed...',
                    '$-> err_conn'],
                    false)
            loader.exit(false, bool ? 'Create' : 'Save')  // destroy loader object.
            readonly(!bool)
        })
        request.timeout(()=>{
            pop_up(
                   ['Error!!!',
                    'The Request was not successfully completed...',
                    '$-> err_timeout'],
                    false)
            loader.exit(false, bool ? 'Create' : 'Save')  // destroy loader object.
            readonly(!bool)
        })


    }
  preview_btn.onclick = () =>{  // preview button event handler set modal values.
    displays.forEach((display, index)=>{
       display.innerHTML= index==0 ? `By ${elements[index].value}` : elements[index].value
    })
    content.innerHTML=editor.getData()
    content.querySelectorAll('pre').forEach(pre=>{  // Adds name of language to code class.
        const code_class = pre.querySelector('code').className.substring(9)
        pre.innerHTML= `<b>$_> ${code_class.charAt(0).toUpperCase()+code_class.substring(1)}</b>\n\n` + pre.innerHTML
    })
  }

  }
})