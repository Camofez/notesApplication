/*************************************************************************
 * Create Note Popup Logic
 **************************************************************************/

function popup() {

    const popupContainer = document.createElement("div");

    popupContainer.innerHTML = `
    <div id="popupContainer">
        <h1>New Note</h1>
        <textarea id="note-text" placeholder="Enter your note..."></textarea>
        <input type="text" id="note-tag" placeholder="Enter note's tag">
        <div id="btn-container">
            <button id="submitBtn" onclick="createNote()">Create Note</button>
            <button id="closeBtn" onclick="closePopup()">Close</button>
        </div>
    </div>
    `;
    document.body.appendChild(popupContainer);
}

function closePopup() {
    const popupContainer = document.getElementById("popupContainer");
    if(popupContainer) {
        popupContainer.remove();
    }
}

async function createNote() {
    const noteText = document.getElementById('note-text').value.trim();
    const noteTag = document.getElementById('note-tag').value.trim();

    if (noteText !== '') {
        const note = { text: noteText, tag: noteTag };

        try {
            const response = await fetch('http://localhost:8080/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(note),
            });

            if (response.ok) {
                document.getElementById('note-text').value = '';
                document.getElementById('note-tag').value = '';
                closePopup();
                displayNotes(); // Refresh the notes list
            } else {
                console.error('Failed to save the note');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

/*************************************************************************
 * Display Notes Logic
 **************************************************************************/
async function displayNotes(notes = null) {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    // If no notes are provided, fetch all notes
    if (!notes) {
        try {
            const response = await fetch('http://localhost:8080/api/notes');
            notes = await response.json();
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }

    // Display the notes
    notes.forEach(note => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${note.text}</span>
            <div id="noteTags-container">
                <span>${note.tag}</span>
                <i class="fa-solid fa-tag"></i>        
            </div>
            <div id="noteBtns-container">
                <button id="editBtn" onclick="editNote(${note.id})"><i class="fa-solid fa-pen"></i></button>
                <button id="deleteBtn" onclick="deleteNote(${note.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        notesList.appendChild(listItem);
    });
}



async function filterNotes() {
    const tag = document.getElementById('filter-tag').value.trim();

    if (tag) {
        try {
            const response = await fetch(`http://localhost:8080/api/notes/filter?tag=${tag}`);
            const filteredNotes = await response.json();
            displayNotes(filteredNotes); // Display filtered notes
        } catch (error) {
            console.error('Error filtering notes:', error);
        }
    } else {
        displayNotes(); // If no tag is entered, display all notes
    }
}


/*************************************************************************
 * Edit Note Popup Logic
 **************************************************************************/

async function editNote(noteId) {
    try {
        const response = await fetch(`http://localhost:8080/api/notes/${noteId}`);
        const note = await response.json();

        if (note) {
            const editingPopup = document.createElement('div');
            editingPopup.innerHTML = `
                <div id="editing-container" data-note-id="${noteId}">
                    <h1>Edit Note</h1>
                    <textarea id="note-text">${note.text}</textarea>
                    <input type="text" id="note-tag" value="${note.tag}">
                    <div id="btn-container">
                        <button id="submitBtn" onclick="updateNote(${noteId})">Done</button>
                        <button id="closeBtn" onclick="closeEditPopup()">Cancel</button>
                    </div>
                </div>
            `;
            document.body.appendChild(editingPopup);
        }
    } catch (error) {
        console.error('Error fetching note:', error);
    }
}


function closeEditPopup() {
    const editingPopup = document.getElementById("editing-container");

    if(editingPopup) {
        editingPopup.remove();
    }
}

async function updateNote(noteId) {
    const noteText = document.getElementById('note-text').value.trim();
    const noteTag = document.getElementById('note-tag').value.trim();

    if (noteText !== '') {
        const note = { text: noteText, tag: noteTag };

        try {
            const response = await fetch(`http://localhost:8080/api/notes/${noteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(note),
            });

            if (response.ok) {
                closeEditPopup();
                displayNotes(); // Refresh the notes list
            } else {
                console.error('Failed to update the note');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}


/*************************************************************************
 * Delete Note Logic
 **************************************************************************/

async function deleteNote(noteId) {
    try {
        const response = await fetch(`http://localhost:8080/api/notes/${noteId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            displayNotes();
        } else {
            console.error('Failed to delete the note');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
displayNotes();