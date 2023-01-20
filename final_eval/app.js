// set up api
const API = (() => {
  const URL = "http://localhost:3000/events";

  const getEvents = () => {
    return fetch(URL).then((res) => res.json());
  };

  const postEvent = (newEvent) => {
    return fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    }).then((res) => res.json());
  };

  const deleteEvent = (id) => {
    return fetch(`${URL}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .catch(console.log);
  };

  const updateEvent = (id, updatedContent) => {
    return fetch(`${URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedContent),
    }).then((res) => res.json());
  };

  return {
    getEvents,
    postEvent,
    deleteEvent,
    updateEvent,
  };
})();

// model
class EventListModel {
  #eventList;
  constructor() {
    this.#eventList = [];
  }

  fetchEvents() {
    return API.getEvents().then((events) => {
      this.setEvents(events);
      return events;
    });
  }

  setEvents(events) {
    this.#eventList = events;
  }

  addEvent(event) {
    return API.postEvent(event).then((newEvent) => {
      this.#eventList.push(newEvent);
      return newEvent;
    });
  }

  removeEvent(id) {
    return API.deleteEvent(id).then((res) => {
      this.#eventList = this.#eventList.filter((event) => {
        return event.id !== +id;
      });
    });
  }

  updateEvent(id, updatedEvent) {
    return API.updateEvent(id, updatedEvent).then((event) => {
      return event;
    });
  }
}

// view
class EventListView {
  constructor() {
    this.addBtn = document.getElementById("event-list-app__add-button");
    this.eventTable = document.getElementById("event-list-app__table");
    this.tableBody = document.getElementById("event-list-app__table-body");
    this.eventApp = document.getElementById("event-list-app");
  }

  renderEvents(eventsList) {
    this.tableBody.textContent = "";
    eventsList.forEach((event) => {
      this.appendEvent(event);
    });
  }

  //   tempEvent(event) {
  //     this.createNewEvent();
  //   }

  appendEvent(event) {
    // create a row
    const eventEle = document.createElement("tr");
    eventEle.classList.add("event");
    eventEle.setAttribute("id", event.id);

    // create event name
    const eventName = document.createElement("td");
    eventName.classList.add("event-name");
    eventName.textContent = event.eventName;

    // create event date, start and end
    const eventStartDate = document.createElement("td");
    eventStartDate.textContent = event.startDate;
    eventStartDate.classList.add("event-startDate");
    const eventEndDate = document.createElement("td");
    eventEndDate.textContent = event.endDate;
    eventEndDate.classList.add("event-endDate");

    // create action buttons
    const eventActions = document.createElement("div");
    eventActions.classList.add("event-actions");

    const editButton = document.createElement("button");
    editButton.textContent = "EDIT";
    editButton.classList.add("edit-button");
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "DELETE";

    // appaned child to the tr
    eventActions.append(editButton, deleteButton);
    eventEle.append(eventName, eventStartDate, eventEndDate, eventActions);

    // append the tr to the tbody
    this.tableBody.append(eventEle);
  }

  createNewEvent() {
    // create a row
    const eventEle = document.createElement("tr");
    eventEle.classList.add("event");

    // create event name placeholdre
    const eventName = document.createElement("td");
    eventName.classList.add("event-name");

    // create event date placeholder
    const eventStartDate = document.createElement("td");
    eventStartDate.classList.add("event-startDate");
    const eventEndDate = document.createElement("td");
    eventEndDate.classList.add("event-endDate");

    // create a div for action buttons
    const newEventActions = document.createElement("div");
    newEventActions.classList.add("new-event-actions");

    // create action buttons
    const postButton = document.createElement("button");
    postButton.textContent = "+";
    postButton.classList.add("post-button");
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "X";
    cancelButton.classList.add("cancel-button");

    // create input
    const eventNameInput = document.createElement("input");
    eventNameInput.classList.add("event-name-input");
    eventNameInput.setAttribute("type", "text");

    const eventStartDateInput = document.createElement("input");
    eventStartDateInput.classList.add("event-startDate-input");
    eventStartDateInput.setAttribute("type", "date");

    const eventEndDateInput = document.createElement("input");
    eventEndDateInput.classList.add("event-endDate-input");
    eventEndDateInput.setAttribute("type", "date");

    //append all to the tr
    eventName.append(eventNameInput);
    eventStartDate.append(eventStartDateInput);
    eventEndDate.append(eventEndDateInput);
    newEventActions.append(postButton, cancelButton);
    eventEle.append(eventName, eventStartDate, eventEndDate, newEventActions);

    // append the tr to tbody
    this.tableBody.append(eventEle);
  }
}

class EventListController {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.init();
  }

  init() {
    this.renderContent();
    this.setupAddEvent();
    this.setupDeleteButton();
  }

  renderContent() {
    this.model.fetchEvents().then((events) => {
      this.view.renderEvents(events);
    });
  }

  setupActionsEvents() {
    this.view.tableBody.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-button")) {
      }
    });
  }

  setupAddEvent() {
    this.view.addBtn.addEventListener("click", (e) => {
      this.view.createNewEvent();
    });
    this.setupPostButton();
  }

  setupPostButton() {
    this.view.tableBody.addEventListener("click", (e) => {
      if (e.target.classList.contains("post-button")) {
        const eventName = document.querySelector(".event-name-input").value;
        const eventStartDate = document.querySelector(
          ".event-startDate-input"
        ).value;
        const eventEndDate = document.querySelector(
          ".event-endDate-input"
        ).value;
        this.model
          .addEvent({
            eventName: eventName,
            startDate: eventStartDate,
            endDate: eventEndDate,
          })
          .then((data) => {
            this.renderContent();
          });
      }
    });
  }

  setupDeleteButton() {
    this.view.eventTable.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-button")) {
        const eventId = e.target.parentNode.parentNode.getAttribute("id");
        this.model.removeEvent(eventId).then((data) => {
          this.renderContent();
        });
      }
    });
  }

  setupEditButton() {
    this.view.eventApp.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit-button")) {
        const eventRow = e.target.parentNode.parentNode;
        const eventId = eventRow.getAttribute("id");

        const newNameInput = document.createElement("input");
        newNameInput.setAttribute("type", "text");
        newNameInput.value = eventRow.querySelector("event-name").textContent;

        const newStartDateInput = document.createElement("input");
        newStartDateInput.setAttribute("type", "date");
        newStartDateInput.value =
          eventRow.querySelector("event-startDate").value;

        const newEndDateInput = document.createElement("input");
        newEndDateInput.setAttribute("type", "date");
        newEndDateInput.value = eventRow.querySelector("event-endDate").value;

        const newButton = document.createElement("button");
        newButton.textContent = "Cancel";

        eventRow.querySelector("event-name").replaceWith(newNameInput);
        eventRow
          .querySelector("event-startDate")
          .replaceWith(newStartDateInput);
        eventRow.querySelector("event-EndDate").replaceWith(newEndDateInput);
        eventRow.querySelector("delete-button").replaceWith(newButton);

        e.target.textContent = "Done";

        const updatedContent = {
          eventName: eventName,
          startDate: eventStartDate,
          endDate: eventEndDate,
        };

        this.model.updateEvent(eventId, updatedContent).then((data) => {
          this.renderContent();
        });
      }
    });
  }
}

const eventListView = new EventListView();
const eventListModel = new EventListModel();
const eventListController = new EventListController(
  eventListView,
  eventListModel
);
