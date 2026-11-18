/*
    EMERGENCY INFORMATION MANAGER - JAVASCRIPT

    This file controls the interactive features:
    1. Add, edit and delete personal contacts.
    2. Save allergies and important notes.
    3. Add and delete document references.
    4. Save information in browser localStorage.
    5. Export the saved information as a JSON file.

    The public helpline cards are written in HTML and styled with CSS,
    so JavaScript is not required to display those six cards.
*/


// ---------------- 1. LOAD SAVED INFORMATION ----------------

// Read the saved contacts text from localStorage and convert it into an array.
// If no contacts have been saved, use an empty array instead.
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

// Read the saved documents text and convert it into an array.
// If no documents have been saved, start with an empty array.
let documents = JSON.parse(localStorage.getItem("documents")) || [];

// Read the saved notes from localStorage.
// If no notes exist, use an empty string.
let savedNotes = localStorage.getItem("notes") || "";

// This variable remembers which contact is currently being edited.
// null means that the user is adding a new contact, not editing one.
let editingIndex = null;


// ---------------- 2. SELECT HTML ELEMENTS ----------------

// Find the contact form in the HTML and store it in a variable.
const contactForm = document.getElementById("contactForm");

// Find the contact list container where personal contacts will appear.
const contactsContainer = document.getElementById("contacts");

// Find the quick-access container near the top of the page.
const quickContainer = document.getElementById("quick");

// Find the notes text area and place the previously saved notes inside it.
const notesInput = document.getElementById("notes");
notesInput.value = savedNotes;

// Find the button used to submit the contact form.
const contactSubmitButton = document.getElementById("contactSubmitButton");

// Find the Cancel Edit button.
const cancelEditButton = document.getElementById("cancelEditButton");


// ---------------- 3. SAVE CONTACTS ----------------

// This function converts the contacts array into JSON text and saves it.
function saveContacts() {
    // JSON.stringify converts the JavaScript array into text.
    const contactsText = JSON.stringify(contacts);

    // setItem stores that text in the browser under the key "contacts".
    localStorage.setItem("contacts", contactsText);
}


// ---------------- 4. DISPLAY PERSONAL CONTACTS ----------------

// This function creates and displays every saved personal contact.
function showContacts() {
    // Clear the old contact cards before creating the updated list.
    contactsContainer.innerHTML = "";

    // Clear the old quick-access links before updating them.
    quickContainer.innerHTML = "";

    // Check whether the contacts array has no items.
    if (contacts.length === 0) {
        // Show a simple message when the user has not added any contacts.
        contactsContainer.textContent = "No personal contacts added yet.";

        // Show a message in the quick-access area too.
        quickContainer.textContent = "No contacts saved yet.";
    }

    // Visit each contact in the array, one at a time.
    contacts.forEach(function (contact, index) {

        // Create a new div to hold one personal contact row.
        const row = document.createElement("div");

        // Apply the CSS class that styles contact rows.
        row.className = "item";

        // Create a separate div for the contact's text information.
        const details = document.createElement("div");

        // Create a bold element to display the contact's name.
        const name = document.createElement("strong");

        // Put the contact's name into the bold element as plain text.
        name.textContent = contact.name;

        // Create a paragraph to display the relationship and phone number.
        const contactDetails = document.createElement("p");

        // Join the relationship and phone number into one readable line.
        contactDetails.textContent = contact.relation + " | " + contact.phone;

        // Create a paragraph to display the email address.
        const email = document.createElement("p");

        // Show the email, or show a message if the email is empty.
        email.textContent = contact.email || "No email provided";

        // Put the name inside the details container.
        details.appendChild(name);

        // Put the relationship and phone number below the name.
        details.appendChild(contactDetails);

        // Put the email below the other contact details.
        details.appendChild(email);

        // Create a container for the Call, Edit and Delete controls.
        const actions = document.createElement("div");

        // Create a telephone link so a compatible device can call the contact.
        const callLink = document.createElement("a");

        // Set the telephone link destination using the contact's phone number.
        callLink.href = "tel:" + contact.phone;

        // Display the word Call on the link.
        callLink.textContent = "Call";

        // Add a CSS class so the link looks like a small button.
        callLink.className = "small-action";

        // Create the Edit button for this contact.
        const editButton = document.createElement("button");

        // Set the visible text of the Edit button.
        editButton.textContent = "Edit";

        // When clicked, call editContact and pass this contact's array position.
        editButton.addEventListener("click", function () {
            editContact(index);
        });

        // Create the Delete button for this contact.
        const deleteButton = document.createElement("button");

        // Set the visible text of the Delete button.
        deleteButton.textContent = "Delete";

        // When clicked, call deleteContact and pass this contact's array position.
        deleteButton.addEventListener("click", function () {
            deleteContact(index);
        });

        // Put the Call link inside the action container.
        actions.appendChild(callLink);

        // Put the Edit button beside the Call link.
        actions.appendChild(editButton);

        // Put the Delete button beside the Edit button.
        actions.appendChild(deleteButton);

        // Put the contact details inside the complete row.
        row.appendChild(details);

        // Put the action controls inside the complete row.
        row.appendChild(actions);

        // Add the completed contact row to the webpage.
        contactsContainer.appendChild(row);

        // Create a paragraph for the quick-access contact link.
        const quickRow = document.createElement("p");

        // Create a bold element for the contact's name in quick access.
        const quickName = document.createElement("strong");

        // Add the contact's name as plain text.
        quickName.textContent = contact.name + " — ";

        // Create a link for quickly calling this contact.
        const quickCall = document.createElement("a");

        // Set the quick-call link to the contact's telephone number.
        quickCall.href = "tel:" + contact.phone;

        // Display the phone number as the link text.
        quickCall.textContent = contact.phone + " (Call)";

        // Add the name to the quick-access paragraph.
        quickRow.appendChild(quickName);

        // Add the phone link after the name.
        quickRow.appendChild(quickCall);

        // Display the quick-access paragraph on the webpage.
        quickContainer.appendChild(quickRow);
    });

    // Save the latest contacts array after displaying it.
    saveContacts();
}


// ---------------- 5. ADD OR UPDATE A CONTACT ----------------

// Listen for the contact form's submit event.
contactForm.addEventListener("submit", function (event) {

    // Stop the browser from refreshing the page after form submission.
    event.preventDefault();

    // Read the name input and remove extra spaces at the beginning and end.
    const name = document.getElementById("name").value.trim();

    // Read the relationship input and remove extra outside spaces.
    const relation = document.getElementById("relation").value.trim();

    // Read the phone input and remove extra outside spaces.
    const phone = document.getElementById("phone").value.trim();

    // Read the email input and remove extra outside spaces.
    const email = document.getElementById("email").value.trim();

    // Make one object containing all the information for this contact.
    const contactData = {
        name: name,
        relation: relation,
        phone: phone,
        email: email
    };

    // Check whether editingIndex has a position instead of null.
    if (editingIndex === null) {

        // If no contact is being edited, add the new object to the array.
        contacts.push(contactData);

    } else {

        // If a contact is being edited, replace that contact at its old position.
        contacts[editingIndex] = contactData;
    }

    // Save the new or updated contacts in localStorage.
    saveContacts();

    // Refresh the contact list so the latest information appears.
    showContacts();

    // Clear the input fields and return the form to Add Contact mode.
    resetContactForm();
});


// ---------------- 6. EDIT A CONTACT ----------------

// This function receives the array position of the contact to edit.
function editContact(index) {

    // Get the selected contact object from the contacts array.
    const selectedContact = contacts[index];

    // Remember the selected contact's position for the next form submission.
    editingIndex = index;

    // Put the selected contact's name back into the name input.
    document.getElementById("name").value = selectedContact.name;

    // Put the selected contact's relationship back into its input.
    document.getElementById("relation").value = selectedContact.relation;

    // Put the selected contact's phone number back into its input.
    document.getElementById("phone").value = selectedContact.phone;

    // Put the selected contact's email back into its input.
    document.getElementById("email").value = selectedContact.email;

    // Change the submit button text to show that the user is editing.
    contactSubmitButton.textContent = "Update Contact";

    // Show the Cancel Edit button while editing is active.
    cancelEditButton.classList.remove("hidden");

    // Move the page to the contact form so the user can edit the details.
    contactForm.scrollIntoView({ behavior: "smooth", block: "center" });
}


// ---------------- 7. RESET THE CONTACT FORM ----------------

// This function clears the form and returns it to Add Contact mode.
function resetContactForm() {

    // Clear all contact form fields.
    contactForm.reset();

    // Set editingIndex to null because no contact is being edited now.
    editingIndex = null;

    // Change the submit button text back to Add Contact.
    contactSubmitButton.textContent = "Add Contact";

    // Hide the Cancel Edit button because editing has ended.
    cancelEditButton.classList.add("hidden");
}


// ---------------- 8. CANCEL CONTACT EDITING ----------------

// Listen for a click on the Cancel Edit button.
cancelEditButton.addEventListener("click", function () {

    // Reset the form without changing the saved contact.
    resetContactForm();
});


// ---------------- 9. DELETE A CONTACT ----------------

// This function receives the array position of the contact to delete.
function deleteContact(index) {

    // Ask the user to confirm before removing the contact.
    const userConfirmed = confirm("Do you want to delete this contact?");

    // Continue only if the user selected OK.
    if (userConfirmed) {

        // Remove one contact from the array at the selected position.
        contacts.splice(index, 1);

        // If the deleted contact was being edited, clear the form.
        if (editingIndex === index) {
            resetContactForm();
        }

        // Save the updated contacts array.
        saveContacts();

        // Display the updated contact list.
        showContacts();
    }
}


// ---------------- 10. SAVE ALLERGIES AND IMPORTANT NOTES ----------------

// Find the Save Notes button and listen for its click event.
document.getElementById("saveNotes").addEventListener("click", function () {

    // Read the notes text area and save its text in localStorage.
    localStorage.setItem("notes", notesInput.value.trim());

    // Display a confirmation message after saving the notes.
    alert("Notes saved successfully.");
});


// ---------------- 11. DISPLAY DOCUMENT REFERENCES ----------------

// This function displays every saved document name and optional link.
function showDocuments() {

    // Find the document list container in the HTML.
    const documentsContainer = document.getElementById("documents");

    // Clear the old document rows before creating the updated list.
    documentsContainer.innerHTML = "";

    // Check whether the documents array is empty.
    if (documents.length === 0) {

        // Display a message when no documents have been added.
        documentsContainer.textContent = "No documents added yet.";
    }

    // Visit every document object in the documents array.
    documents.forEach(function (documentItem, index) {

        // Create a row for the current document.
        const row = document.createElement("div");

        // Apply the common row design.
        row.className = "item";

        // Create a span to hold the document name and optional link.
        const documentDetails = document.createElement("span");

        // Display the document name as plain text.
        documentDetails.textContent = documentItem.name + " ";

        // Check whether the document has a link.
        if (documentItem.link) {

            // Create a link element for opening the document reference.
            const openLink = document.createElement("a");

            // Set the destination to the saved document URL.
            openLink.href = documentItem.link;

            // Open the reference in a new browser tab.
            openLink.target = "_blank";

            // Add protection when opening an external page in a new tab.
            openLink.rel = "noopener noreferrer";

            // Set the visible link text.
            openLink.textContent = "Open reference";

            // Add the link after the document name.
            documentDetails.appendChild(openLink);
        }

        // Create a button to delete this document.
        const deleteButton = document.createElement("button");

        // Set the button's visible text.
        deleteButton.textContent = "Delete";

        // When clicked, remove this document using its array position.
        deleteButton.addEventListener("click", function () {
            deleteDocument(index);
        });

        // Add the document information to the row.
        row.appendChild(documentDetails);

        // Add the Delete button to the row.
        row.appendChild(deleteButton);

        // Display the completed row inside the document list.
        documentsContainer.appendChild(row);
    });

    // Save the current documents array in localStorage.
    localStorage.setItem("documents", JSON.stringify(documents));
}


// ---------------- 12. ADD A DOCUMENT REFERENCE ----------------

// Listen for the document form's submit event.
document.getElementById("docForm").addEventListener("submit", function (event) {

    // Stop the browser from refreshing the page after form submission.
    event.preventDefault();

    // Read the document name and remove extra spaces.
    const documentName = document.getElementById("docName").value.trim();

    // Read the optional document link and remove extra spaces.
    const documentLink = document.getElementById("docLink").value.trim();

    // Start with an empty link value.
    let safeLink = "";

    // Only check the URL if the user entered one.
    if (documentLink !== "") {

        // Try to understand the entered text as a web address.
        try {
            // Create a URL object so its parts can be checked.
            const parsedUrl = new URL(documentLink);

            // Allow only normal website links that use HTTP or HTTPS.
            if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {

                // Keep the checked web address.
                safeLink = parsedUrl.href;
            }

        } catch (error) {

            // Keep safeLink empty if the entered address is not a valid URL.
            safeLink = "";
        }
    }

    // Create a document object and add it to the documents array.
    documents.push({
        name: documentName,
        link: safeLink
    });

    // Clear the document form after reading its values.
    document.getElementById("docForm").reset();

    // Display the updated document list and save it.
    showDocuments();
});


// ---------------- 13. DELETE A DOCUMENT ----------------

// This function receives the array position of the document to remove.
function deleteDocument(index) {

    // Remove one document from the array at the selected position.
    documents.splice(index, 1);

    // Save the updated documents array in browser storage.
    localStorage.setItem("documents", JSON.stringify(documents));

    // Refresh the document list on the webpage.
    showDocuments();
}


// ---------------- 14. EXPORT ALL INFORMATION ----------------

// Find the Export button and listen for a click.
document.getElementById("export").addEventListener("click", function () {

    // Collect contacts, notes and document references in one object.
    const allInformation = {
        contacts: contacts,
        notes: localStorage.getItem("notes") || "",
        documents: documents
    };

    // Convert the object into readable JSON text with two-space indentation.
    const fileData = JSON.stringify(allInformation, null, 2);

    // Create a file-like Blob containing the JSON text.
    const file = new Blob([fileData], { type: "application/json" });

    // Create a temporary browser URL for the generated file.
    const fileUrl = URL.createObjectURL(file);

    // Create an anchor element that will start the download.
    const downloadLink = document.createElement("a");

    // Set the temporary file URL as the download link destination.
    downloadLink.href = fileUrl;

    // Set the name that the downloaded file should use.
    downloadLink.download = "emergency-information.json";

    // Programmatically click the link to start downloading the file.
    downloadLink.click();

    // Release the temporary URL after starting the download.
    URL.revokeObjectURL(fileUrl);
});


// ---------------- 15. SHOW SAVED INFORMATION WHEN THE PAGE OPENS ----------------

// Display personal contacts saved from an earlier visit.
showContacts();

// Display document references saved from an earlier visit.
showDocuments();
