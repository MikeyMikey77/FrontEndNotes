import React, { Component } from "react";
import ReactDOM from "react-dom";
//import database from "./database.js";
import "regenerator-runtime/runtime";
//import {hot} from "react-hot-loader";

class UserForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      idGet: "", idCreate: "", idDelete: "", idUpdate: "", UpdateText: "",
      language: this.getRu()
    };

    this.onChangeGetSingle = this.onChangeGetSingle.bind(this);
    this.onChangeCreate = this.onChangeCreate.bind(this);
    this.onChangeUpdate = this.onChangeUpdate.bind(this);
    this.onChangeUpdateText = this.onChangeUpdateText.bind(this);
    this.onChangeDelete = this.onChangeDelete.bind(this);

    this.getAllNotes = this.getAllNotes.bind(this);
    this.getSingleNote = this.getSingleNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.createNote = this.createNote.bind(this);

    this.status = false;

    this.onClick = this.onClick.bind(this);
    this.getRu = this.getRu.bind(this);
    this.getEu = this.getEu.bind(this);

    this.setAsyncState = this.setAsyncState.bind(this);
  }
  onChangeGetSingle(e) {
    var val = e.target.value;
    this.setState({ idGet: val });
    //console.log(this.state);
  }

  onChangeCreate(e) {
    var val = e.target.value;
    this.setState({ idCreate: val });
  }

  onChangeUpdate(e) {
    var val = e.target.value;
    this.setState({ idUpdate: val });
  }

  onChangeUpdateText(e) {
    var val = e.target.value;
    this.setState({ UpdateText: val });
  }

  onChangeDelete(e) {
    var val = e.target.value;
    this.setState({ idDelete: val });
  }

  getAllNotes(e) {
    e.preventDefault();
    //alert("Имя: " + this.state.name);
    fetch("http://localhost:8080/api/GET/notes")
      .then(response => response.json())
      .then(result => {
        console.log(result);
        ReactDOM.render(
          <div id="vasya">
            <ul>
              {
                result.map(note => {
                  return <li key={note.id.toString()}><h2>ID:{note.id} [{note.note}]</h2></li>
                })
              }
            </ul>
          </div>,
          document.getElementById("render")
        )
      });
  }

  getSingleNote(e) {
    e.preventDefault();
    console.log(e);
    let val = this.state.idGet;
    // console.log(val);

    fetch(`http://localhost:8080/api/GET/notes/${val}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        ReactDOM.render(
          <NoteRender val={val} result={res} />,
          document.getElementById("render")
        )
      })
    //e.submit();
  }

  createNote(e) {
    e.preventDefault();
    fetch("http://localhost:8080/api/POST/notes", {
      method: "POST",
      body: JSON.stringify({ note: this.state.idCreate }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.done) {
          ReactDOM.render(<h1>Note is successfully added</h1>,
            document.getElementById("render"));
        }
        else ReactDOM.render(<h1>Not is empty, write somthing in the text-area!</h1>,
          document.getElementById("render"));
      });
  }

  updateNote(e) {
    e.preventDefault();

    if (this.state.idUpdate !== "" && this.state.UpdateText !== "") {

      fetch(`http://localhost:8080/api/PUT/notes/${this.state.idUpdate}`, {
        method: "PUT",
        body: JSON.stringify({ id: this.state.idUpdate, note: this.state.UpdateText }),

        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(res => res.json())
        .then(res => {
          if (res.done) {
            ReactDOM.render(<h1 data-testid="Success">Note with ID:{this.state.idUpdate} is updated!</h1>
              , document.getElementById("render"));
          }
          else ReactDOM.render(<h1 data-testid="Success">Note with ID:{this.state.idUpdate} not updated! {res.message}</h1>
            , document.getElementById("render"));
        });
    }
    else ReactDOM.render(<h1>Fields is Empty!</h1>
      , document.getElementById("render"));
  }

  deleteNote(e) {
    e.preventDefault();

    if (this.state.idDelete !== "") {

      fetch(`http://localhost:8080/api/DELETE/notes/${this.state.idDelete}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(res => res.json())
        .then(res => {
          ReactDOM.render(<h1>{res.message}</h1>
            , document.getElementById("render"));
        })
    }
    else ReactDOM.render(<h1>Field is Empty!</h1>
      , document.getElementById("render"));
  }

  getEu() {
    return {
      header: "User interface for notes managment",
      forDelete: "Enter ID to delete:",
      forUpdate: "Enter ID and text to update note",
      forCreate: "Enter text to create note",
      forGetSingle: "Enter ID to get note",
      forGetAll: "Show list of notes"
    }
  }

  getRu() {
    return {
      header: "Интерфейс пользователя для управления заметками",
      forDelete: `Для удаления заметки введите
             ID заметки и нажмите "ок/Enter"`,
      forUpdate: `Для изменения заметки введите
      текст заметки, ID и нажмите "ок/Enter"`,
      forCreate: `Для создания заметки введите
      текст заметки и нажмите "ок/Enter"`,
      forGetSingle: `Для поиска определенной заметки
      введите ID
      и нажмите "ок/Enter"`,
      forGetAll: `Показать список заметок`
    }
  }

  setAsyncState(newState) {
    return new Promise((resolve) => this.setState(newState, () => resolve()));
  }

  onClick(e) {
    this.status = !this.status;
    let asyncSet;

    if (this.status) {
      asyncSet = this.setAsyncState(this.setState({ language: this.getEu() }));
    }
    else asyncSet = this.setAsyncState(this.setState({ language: this.getRu() }));

    asyncSet.then( () => ReactDOM.render(<h1>{this.state.language.header}</h1>,
      document.getElementById("header")) );
  }

  render() {
    return (
      <div>
        <form onSubmit={this.getAllNotes}>
          <p>
            <input type="submit" value={this.state.language.forGetAll} />
          </p>
        </form>
        <form onSubmit={this.getSingleNote}>
          <p>
            <label>{this.state.language.forGetSingle}</label><br />
            <input type="text" value={this.state.idGet} onChange={this.onChangeGetSingle} />
            <br />
            <input type="submit" value="ОК"></input>
          </p>
        </form>
        <form onSubmit={this.createNote}>
          <p>
            <label>{this.state.language.forCreate}</label>
            <br />
            <input type="text" value={this.state.idCreate} onChange={this.onChangeCreate}></input><br />
            <input type="submit" value="ОК"></input>
          </p>
        </form>
        <form onSubmit={this.updateNote}>
          <p>
            <label>{this.state.language.forUpdate}</label>
            <br />
            <input data-testid="IdUpdate" type="text" value={this.state.idUpdate} onChange={this.onChangeUpdate}></input><label>ID:</label><br />
            <input data-testid="UpdateText" type="text" val={this.state.UpdateText} onChange={this.onChangeUpdateText}></input><label>Text:</label><br />
            <input type="submit" value="ОК"></input>
          </p>
        </form>
        <form onSubmit={this.deleteNote}>
          <p>
            <label>{this.state.language.forDelete}</label>
            <br />
            <input type="text" value={this.state.idDelete} onChange={this.onChangeDelete}></input><br />
            <input type="submit" value="ОК"></input>
          </p>
        </form>
        <button onClick={this.onClick}>Eng/Рус.</button>
      </div>
    );
  }
}

class NoteRender extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    if (this.props.result.done) {
      return <div>
        <ul>
          <li><h2>ID:
                    {
              this.props.result.result.id
            } [{this.props.result.result.note}]
                    </h2></li>
        </ul>
      </div>;
    }
    else return <h1>There is not notes with ID: {this.props.val}</h1>;
  }
}

class LanguageChanger extends React.Component {
  constructor(props) {
    super(props);
    this.status = true;
    this.state = { language: (this.status ? this.getEu() : this.getRu()) };

    this.onClick = this.onClick.bind(this);
    this.getRu = this.getRu.bind(this);
    this.getEu = this.getEu.bind(this);
  }

  getEu() {
    return {
      header: "User interface for notes managment",
      forDelete: "Enter ID to delete:"
    }
  }

  getRu() {
    return {
      header: "Интерфейс пользователя для управления заметками",
      forDelete: `Для удаления заметки введите
             ID заметки и нажмите "ок/Enter"`
    }
  }

  onClick(e) {
    this.status = !this.status;

    if (this.status) {
      this.setState({ language: this.getEu() });
    }
    else this.setState({ language: this.getRu() });

    ReactDOM.render(<h1>{this.state.language.header}</h1>,
      document.getElementById("header"))

    // ReactDOM.render(
    //   <UserForm language={this.state.language} />,
    //   document.getElementById("actions")
    // );
  }

  render() {
    return <button onClick={this.onClick}>Eng/Рус.</button>;
  }
}


ReactDOM.render(
  <UserForm />,
  document.getElementById("actions")
);