import './assets/modal.css'
let zindex = 1000;

export { Modal }

function Modal(page, onClose)
{

    const element = page(close)
    const close_button = ref()
    const prompt = ref()
    const modal = 
    <div class="modal-background" v-show="visible">
        <div class="modal-prompt" ref={prompt}>
        <span class="close-button" ref={close_button} id="close">✖</span>{element}</div>
    </div>

    prompt.$on("click",e => e.stopPropagation())


    modal.$on("click",(e)=>{
        if(prompt.contains(e.target)) return
        close()
    })

    modal.$style({"z-index":zindex++})
    function close()
    {
        if(onClose) onClose()
        zindex--
        modal.remove()
    }
    close_button.$on("click",close)
    modal.$parent(document.body)
}