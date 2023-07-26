import { useState, useEffect} from 'react';
import Note from './components/Note';
import axios from 'axios';
import noteServices from './services/notes';


const App = () => {
  const [notes, setNotes] = useState(null);
  const [newNote, setNewNote] = useState('A new note...')
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("Error Occured...")

  // const hook = () => {
  //   console.log('effect');
  //   axios.get('http://localhost:3001/notes').then(response => {
  //     console.log('promise fulfilled')
  //     setNotes(response.data)
  //   })
  // }

  // useEffect(hook, [])
  // console.log('render', notes.length, "notes");

  //WHAT IS THIS FOR AGAIN???
  useEffect(() => {
    noteServices
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])
  
  if(!notes) {
    return null
  }
  
  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
    noteServices
      .create(noteObject)
      .then(returnedNote => {
        console.log(returnedNote)
        setNotes(notes.concat(returnedNote))
        setNewNote("");
      })
  }

  // Very confusing... what is a axios.put??? 
  //Com back to the maps array and changedNot variable.
  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id);
    //REVIEW THIS!!!11!!
    const changedNote = { ...note, important: !note.important }
    noteServices
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(`The note ${note.content} was already deleted from server...`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  }

  const Notification = ({ message }) => {
    if (message === null) {
      return null;
    }
    return  (
      <div class="error">
        {message}
      </div>
    )
  }

  const Footer = () => {
    const footerStyle = {
      color: 'green',
      fontStyle: 'italic',
      fontSize: '16'
    }
    return (
      <div style={footerStyle}>
        <br />
        <em>Note app, Department of <bold>Monte</bold>, University of <bold>Yoon</bold></em>
      </div>
    )
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'Important' : 'All'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
         <Note note={note} key={note.id} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type='submit'>Save</button>
      </form>
      <Footer />
    </div>
  )
}


export default App;
