package com.noteApp.NotesApplication.Repository;

import com.noteApp.NotesApplication.Entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    // Custom method to find notes by tag
    List<Note> findByTagContainingIgnoreCase(String tag);

}


