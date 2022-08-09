class App{
    constructor(){
        console.log("app works!")
        
        this.notes = []
        this.noteId = 0
        this.$placeholder = document.querySelector('#placeholder');
        this.$form = document.querySelector('#form')
        this.$noteTitle = document.querySelector('#note-title');
        this.$noteText = document.querySelector('#note-text')
        this.$formButtoms = document.querySelector('#form-buttons')
        this.$notes = document.querySelector('#notes')
        this.$modal = document.querySelector('.modal')
        this.$modalTitle = document.querySelector('.modal-title')
        this.$modalText = document.querySelector('.modal-text')
        this.$modalCloseButton = document.querySelector('.modal-close-button')
        this.addEventListeners()
        this.displayNotes()
        this.listarNotes()

    }
//eventos de click

    addEventListeners(){
        document.body.addEventListener('click', event =>{
            console.log(event.path[0].id)
            this.handleFormClick(event)
            this.closeModal(event)
            if(event.path[2].id === 'notes'){
                this.openModel(event)
                this.selectNote(event)
            }

            if(event.target.matches('.color-option')){
                this.changeNoteColor(event)
            }

            if(event.target.matches('.toolbar-delete')){
                this.deleteNote(event)
            }
            
        })

        document.body.addEventListener('mouseover', event => {
            this.openTooltip(event)
        })

        document.body.addEventListener('mouseout', event =>{
            this.closeTooltip(event)
            
        })


        this.$form.addEventListener('submit', event => {
            event.preventDefault();
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            this.$noteText.value =""
            this.$noteTitle.value=""
            const hasNote = text && title
            if(hasNote){
                this.addNotes({title, text})
            }
            console.log(title.length, text.length)
            this.closeForm()
        })
    }

    handleFormClick(event){
        const isFormClicked = this.$form.contains(event.target)
        const isCloseClicked = event.path[0].id==='form-close-button'
        
        if(isFormClicked){
            this.openForm()
        } else{
            this.closeForm( true)
        }
        if(isCloseClicked){
            this.closeForm(false)
        }
    }

    openForm(){
        this.$form.classList.add('form-open');
        this.$formButtoms.style.display = 'block'
        this.$noteTitle.style.display = 'block';
    }

    openTooltip(event){
        if(!event.target.matches('.toolbar-color')){
            return
        }
        console.log("TOOLBAR OPEN")
        
        this.noteId = event.target.dataset.id; 
        const noteCoords = event.target.getBoundingClientRect();
        console.log(noteCoords)
        console.log(window.scrollY)
        const horizontal = noteCoords.left + window.scrollX
        const vertical = noteCoords.bottom + window.scrollY -20
        console.log(vertical)
        
        this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical-294}px)`;
        this.$colorTooltip.style.display = 'flex';
    }

    closeTooltip(event){
        if(event.target.matches('.toolbar-color')){
            this.$colorTooltip.style.display = 'none';
            
        }
    }

    changeNoteColor(event){
        console.log(event.target.dataset.color)
        const color =event.target.dataset.color
        if(color){
            this.editNoteColor(color)
        }
    }

    closeForm(add){
        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        this.$noteText.value =""
        this.$noteTitle.value=""
        const hasNote = text || text
        if(hasNote && add){
            this.addNotes({title, text})
        }
        this.$formButtoms.style.display = 'none'
        this.$form.classList.remove('form-open');
        this.$noteTitle.style.display = 'none';
        this.$noteTitle.value=""
        this.$noteText.value=""
    }

    openModel(event){
        if(event.target.closest('.note')){
            this.$modal.classList.toggle('open-modal')
        }
    }

    closeModal(event){
        if(event.path[0].className === 'modal-close-button'){
            console.log(this.$modalTitle.value)
            this.editNotes()
            this.$modalTitle.value = ''
            this.$modalText.value = ''
            this.$modal.classList.toggle('open-modal')
        }
    }
//seleciona uma nota 
    selectNote(event){
        console.log("select called")
        const $selectedNote = event.target.closest('.note')
        const [$noteTitle, $noteText] = $selectedNote.children
        this.noteId = $selectedNote.dataset.id
        this.$modalTitle.value = $noteTitle.outerText
        this.$modalText.value = $noteText.outerText
    }

    listarNotes(){
        const url = 'http://localhost:3002/notas'
        
        fetch(url)
        .then(response => response.json())
        .then(notes =>{
            
            this.notes = notes//array
            console.log('notes',notes)
            this.displayNotes()
 
        })
    }
    
//adiciona notas
    addNotes(note){
        console.log("Adding notes", note.title, note.text)
        const newNote ={//objeto 
            title: note.title,
            text: note.text,
            color: 'white',
        }

        fetch("http://localhost:3002/notas",{
            method:'POST',
            headers:{
                'accept':'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify(newNote)
        }).then(response =>{
            this.listarNotes();
        }).catch(error => alert('Falha ao Salvar'));
    }


//edita notas
    editNotes() {
        
        const title = this.$modalTitle.value
        const text = this.$modalText.value
        const id = this.noteId
        const color = 'white'

        const editNote ={
            _id: id,
            title: title,
            text: text,
            color: 'white',
        }
        
        fetch("http://localhost:3002/notas",{
            method: 'PUT',
            headers:{
                'accept':'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify(editNote)
        }).then(response =>{
            alert('Editado com Sucesso')
            this.listarNotes();
        }).catch(error =>alert('Falha ao Edita'));
            
    }

//deleta notas

    deleteNote(event){
        console.log("DELETE CALLED")
        console.log(event.target.closest('.note').dataset.id)
        this.noteId = event.target.closest('.note').dataset.id
    
        fetch(`http://localhost:3002/notas/${this.noteId}`,{
            method:'DELETE',
            headers:{
                'accept':'application/json',
                'Content-Type':'application/json'
            },
        }).then(response =>{
            this.listarNotes();
            alert('Deletado com Sucesso');
        }).catch(error => alert('Falha ao Deletar'));
    }


    displayNotes(){
        console.log(this.notes)
        const hasNotes = this.notes.length > 0
        this.$placeholder.style.display = hasNotes ? 'none' : 'flex';

        this.$notes.innerHTML = this.notes.map(note => `
        <div style="background: ${note.color};" class="note" data-id="${note._id}">
            <div class="${note.title && 'note-title'}">${note.title}</div>
            <div class="note-text">${note.text}</div>
            <div class="toolbar-container">
            <div class="toolbar">

                <svg class="toolbar-delete" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </div>
            </div>
        </div>
        `).join("");
    }
}

new App