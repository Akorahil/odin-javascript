class Category {
  constructor() {
    this.id = "";

    this.nextElement = null;
    this.previousElement = null;

    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  /* Getters and setters */

  getSize() {
    return this.size;
  }

  getHead() {
    return this.head;
  }

  getTail() {
    return this.tail;
  }

  /* Node functionality */

  setNextElement(nextBook) {
    this.nextElement = nextBook;
  }

  getNextElement() {
    return this.nextElement;
  }

  setPreviousElement(previousBook) {
    this.previousElement = previousBook;
  }

  getPreviousElement() {
    return this.previousElement;
  }

  setId(newId) {
    this.id = newId;
  }

  getId() {
    return this.id;
  }

  /* Node addition and removal */

  updateDisplayAdd(book) {
    const cat = document.getElementById(this.id);
    const newBook = document.createElement("div");
    newBook.className = "book";
    newBook.setAttribute("id", book.getId());

    /* Book title */
    let bookElement = document.createElement("img");
    bookElement.className = "book-image";
    newBook.appendChild(bookElement);

    bookElement = document.createElement("h5");
    bookElement.innerText = book.getTitle();
    newBook.appendChild(bookElement);

    bookElement = document.createElement("h5");
    bookElement.innerText = `Author: ${book.getAuthor()}`;
    newBook.appendChild(bookElement);

    bookElement = document.createElement("h5");
    bookElement.innerText = `Pages: ${book.getPages()}`;
    newBook.appendChild(bookElement);

    bookElement = document.createElement("h5");
    bookElement.innerText = `Read: `;
    newBook.appendChild(bookElement);

    const readElement = document.createElement("button");
    if (book.getRead()) {
      readElement.innerText = "Read";
      readElement.classList.add("read-button");
      readElement.classList.add("read");
    } else {
      readElement.innerText = "Unread";
      readElement.classList.add("read-button");
      readElement.classList.add("unread");
    }
    bookElement.appendChild(readElement);

    bookElement = document.createElement("button");
    bookElement.innerText = `Remove`;
    bookElement.className = "remove-button";
    newBook.appendChild(bookElement);

    if (this.size === 1) {
      const catRow = document.createElement("div");
      catRow.className = "category-row";
      cat.appendChild(catRow);
      catRow.appendChild(newBook);
    } else {
      const catRow = cat.lastChild;
      catRow.appendChild(newBook);
    }
  }

  appendElement(book) {
    if (this.size === 0) {
      this.head = book;
      this.tail = book;
    } else {
      this.tail.setNextElement(book);
      book.setPreviousElement(this.tail);
      this.tail = book;
    }
    const bookId = `${this.id}&${this.size}`;
    book.setId(bookId);
    this.size += 1;

    this.updateDisplayAdd(book);
  }

  updateDisplayRemove(book) {
    const removeBook = document.getElementById(book.getId());
    removeBook.parentNode.removeChild(removeBook);
  }

  removeElement(bookId) {
    let removeBook = this.head;
    while (removeBook.getId() !== bookId) {
      removeBook = removeBook.getNextElement();
    }
    if (this.size === 1) {
      this.head = null;
      this.tail = null;
    } else if (this.head === removeBook) {
      this.head = removeBook.getNextElement();
      this.head.setPreviousElement(null);
      removeBook.updateNextId();
    } else if (this.tail === removeBook) {
      this.tail = removeBook.getPreviousElement();
      this.tail.setNextElement(null);
    } else {
      removeBook.removeSelf();
    }
    this.updateDisplayRemove(removeBook);
    this.size -= 1;
  }

  removeSelf() {
    this.nextElement.setPreviousElement(this.previousElement);
    this.previousElement.setNextElement(this.nextElement);
  }
}
