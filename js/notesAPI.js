export default class NotesAPI{

    static getAllNotes(){
        const notes = JSON.parse(localStorage.getItem("notesapp") || "[]");

        return notes.sort((a,b)=>{
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;

        });
    }

    static saveNote(noteToSave){
        const notes = NotesAPI.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id);

        // edit/update
        if(existing){
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        }
        else{  // new note
            noteToSave.id = Math.floor(Math.random()*1000000);
            noteToSave.updated = new Date().toISOString();
            notes.push(noteToSave);
        }


        localStorage.setItem("notesapp", JSON.stringify(notes));
    }

    static deleteNote(id){
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id != id);

        localStorage.setItem("notesapp",JSON.stringify(newNotes));
    }
}