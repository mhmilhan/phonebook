import { useState, useEffect } from "react";
import personsService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification"; //

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  // Fetch initial data from backend
  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      console.log("Data received from backend:", initialPersons);
      setPersons(initialPersons);
    });
  }, []);

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, 5000);
  };

  // Add or update person
  const addPerson = (e) => {
    e.preventDefault();

    const existingPerson = persons.find(
      (p) => p.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personsService
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : returnedPerson
              )
            );
            showNotification(`Updated ${returnedPerson.name}`, "success");
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            showNotification(
              `Information of ${existingPerson.name} has already been removed from server`,
              "error"
            );
            setPersons(persons.filter((p) => p.id !== existingPerson.id));
          });
      }

      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    personsService
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        showNotification(`Added ${returnedPerson.name}`, "success");
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        console.error("Error creating person:", error.response.data.error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          showNotification(error.response.data.error, "error");
        } else {
          showNotification("An unexpected error occurred.", "error");
        }
      });
  };

  // Delete person
  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`);
    if (!confirmDelete) return;

    personsService
      .remove(id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== id));
        showNotification(`Deleted ${name}`, "success");
      })
      .catch((error) => {
        showNotification(
          `Person '${name}' was already removed from server`,
          "error"
        );
        setPersons(persons.filter((p) => p.id !== id));
      });
  };

  // Event handlers
  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  const handleFilterChange = (e) => setFilter(e.target.value);

  const personsToShow = persons.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification.message} type={notification.type} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
