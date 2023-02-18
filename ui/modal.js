// Somewhere we can queue messages if they arrive while another message is displayed
const backlog = [];

/**
 * Action to close the modal dialogue
 */
const closeModal = ev => {

    const modal = document.getElementById("modal");
    modal.style.display = "none";
    ev.target.modalCloseCallback();

    const queuedAlert = backlog.pop();
    if (queuedAlert) {
        alertModal(queuedAlert.header, queuedAlert.msg);
    }
};

/**
 * Create the message window
 */
const initMessageWindow = () => {

    const modal = document.createElement("div");
    modal.setAttribute("id", "modal");

    const messages = document.createElement("div");
    messages.setAttribute("id", "messages");

    const header = document.createElement("h2");
    header.textContent = "Attention";

    const body = document.createElement("p");
    body.textContent = "message";

    const button = document.createElement("button");
    button.setAttribute("id", "close");
    button.textContent = "Close";

    modal.appendChild(messages);
    messages.appendChild(header);
    messages.appendChild(body);
    messages.appendChild(button);

    document.getElementsByTagName("body")[0].appendChild(modal);
};

/**
 * Initialise button actions
 *
 * Walk down one level from the modal DIV, assuming that's where all the
 * dialogues will be, then look for buttons in that dialogue, and add an action
 */
const initButtons = () => {

    const dialogues = [...document.getElementById("modal").children].filter(elem => elem.tagName === "DIV");
    dialogues.forEach(dialogue => {

        const buttons = [...dialogue.children].filter(elem => elem.tagName === "BUTTON");
        buttons.forEach(button => {
            if (button.id === "close") {
                button.addEventListener("click", closeModal);
            }
        });
    });
};

/**
 * Initialise all our messaging elements
 */
const initModal = hub => {

    initMessageWindow();
    initButtons();
};

/**
 * Pop up the alert dialog
 */
const alertModal = (header, msg, button, callback) => {

    const modal = document.getElementById("modal");
    if (modal.style.display === "block") {
        backlog.push ({ header, msg });
        return;
    }

    [...document.getElementById("messages").children].forEach(elem => {

        if (elem.tagName === "H2") {
            elem.textContent = header;
        } else if (elem.tagName === "P") {
            elem.textContent = msg;
        } else if (elem.tagName === "BUTTON") {
            elem.textContent = button;
            elem.modalCloseCallback = callback;
        }
    });

    modal.style.display = "block";
};
