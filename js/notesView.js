export default class NotesView{
    constructor(root, {onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}){
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteEdit = onNoteEdit;
        this.onNoteAdd = onNoteAdd;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <div class="sideView">
                <button class="addNotes" type="button">Add Note</button>
                <div class="list"></div>
            </div>
            <div class="previewBackground">
                <div class="preview">
                    <input class="notesTitle" type="text" spellcheck="false" placeholder="Enter a title">
                    <textarea class="notesBody" spellcheck="false" placeholder="Enter discription"></textarea>
                </div>
            </div>
        `;

        const btnAddNote = this.root.querySelector('.addNotes');
        const inpTitle = this.root.querySelector('.notesTitle');
        const inpBody = this.root.querySelector('.notesBody');

        btnAddNote.addEventListener('click',()=>{
            this.onNoteAdd();
        });

        [inpTitle, inpBody].forEach(inputField=>{
            inputField.addEventListener('blur',()=>{
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            })
        })

        this.updateNotePreviewVisibility(false);
    }

    createListItemHTML(id, title, body, updated){
        const MAX_BODY_LEN = 35;
        const MAX_TITLE_LEN = 14;

        return `
            <div class="items selectedItems" data-note-id="${id}">
                <div class="left">
                    <div class="smallTitle">
                    ${title.substring(0,MAX_TITLE_LEN)}
                    ${title.length > MAX_TITLE_LEN ? "...":""}
                    </div>
                    <div class="smallContent">
                    ${body.substring(0,MAX_BODY_LEN)}
                    ${body.length > MAX_BODY_LEN ? "..." : ""}
                    <div class="updated">${updated.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</div>
                    </div>
                </div>
                <div class="right">
                    <img src="image/delete.png" class="del" alt="delete">
                </div>
            </div>
        `;
    }

    updateNoteList(notes){
        const notesListContainer = this.root.querySelector('.list');

        // empty list
        notesListContainer.innerHTML = "";

        for (const note of notes){
            const html = this.createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

            notesListContainer.insertAdjacentHTML('beforeend',html);
        }

        // add select/delete events for each list items
        notesListContainer.querySelectorAll('.items').forEach(item =>{
            item.addEventListener("click",()=>{
                this.onNoteSelect(item.dataset.noteId);
            },true);
        });

        const delButtons = this.root.querySelectorAll('.del');
        
        delButtons.forEach(del =>{
            del.addEventListener('click',(event)=>{
// event.stopPropagation();
                const item = event.target.closest('.items');

//         if (item) {
//             this.onNoteDelete(item.dataset.noteId);
//         }

                this.onNoteDelete(item.dataset.noteId);
            })
        })

        // both onNoteDelete and onNoteSelect run;
    }


// without using event delegation

    // updateNoteList(notes){
    //     const notesListContainer = this.root.querySelector('.list');
    
    //     // empty list
    //     notesListContainer.innerHTML = "";
    
    //     for (const note of notes){
    //         const html = this.createListItemHTML(note.id, note.title, note.body, new Date(note.updated));
    
    //         notesListContainer.insertAdjacentHTML('beforeend', html);
    
    //         const noteItem = notesListContainer.lastElementChild; // Get the last added note item

    //         // Add click event listener to select note
    //         noteItem.addEventListener("click", () => {
    //             this.onNoteSelect(note.id);
    //         });

    //         // Add click event listener to delete note
    //         const delButton = noteItem.querySelector('.del');
    //         delButton.addEventListener('click', (event) => {
    //             event.stopPropagation(); // Prevent the note item click event from triggering
    //             this.onNoteDelete(note.id);
    //         });
    //     }
    // }


    updateActiveNote(note){
        this.root.querySelector(".notesTitle").value = note.title;
        this.root.querySelector(".notesBody").value = note.body;

        this.root.querySelectorAll('.items').forEach( item =>{
            item.classList.remove('selectedItems');
        });

        this.root.querySelector(`.items[data-note-id="${note.id}"]`).classList.add('selectedItems');
    }

    updateNotePreviewVisibility(visible){
        this.root.querySelector('.preview').style.visibility = visible ? "visible":"hidden";
    }
}