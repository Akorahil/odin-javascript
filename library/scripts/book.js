class Book {
  constructor() {
    this.id = "";

    this.nextElement = null;
    this.previousElement = null;

    this.category = "";
    this.author = "";
    this.title = "";
    this.pages = "";
    this.read = false;
  }

  /* Getter and setters */

  setCategory(newCategory) {
    this.category = newCategory;
  }

  getCategory() {
    return this.category;
  }

  setAuthor(newAuthor) {
    this.author = newAuthor;
  }

  getAuthor() {
    return this.author;
  }

  setTitle(newTitle) {
    this.title = newTitle;
  }

  getTitle() {
    return this.title;
  }

  setPages(newPages) {
    this.pages = newPages;
  }

  getPages() {
    return this.pages;
  }

  setRead(newRead) {
    this.read = newRead;
  }

  getRead() {
    return this.read;
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

  /* Remove node function */

  removeSelf() {
    this.nextElement.setPreviousElement(this.previousElement);
    this.previousElement.setNextElement(this.nextElement);
    this.updateNextId();
  }

  /* Update id for all books following this one */
  updateNextId() {
    let nextBook = this.nextElement;
    let nextId = this.id;
    while (nextBook != null) {
      const bookElementId = nextBook.getId();
      const bookElement = document.getElementById(bookElementId);
      bookElement.setAttribute("id", nextId);
      nextBook.setId(nextId);
      nextId = nextBook.getId();
      nextBook = nextBook.getNextElement();
    }
  }
}
