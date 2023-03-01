class library {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  getSize() {
    return this.size;
  }

  getHead() {
    return this.head;
  }

  getTail() {
    return this.tail;
  }

  updateDisplay(category) {
    const lib = document.getElementById("myLibrary");
    const newCat = document.createElement("div");
    newCat.className = "category";
    newCat.setAttribute("id", category.getId());

    const catTitle = document.createElement("h3");
    catTitle.innerText = category.getId();

    newCat.appendChild(catTitle);
    lib.appendChild(newCat);
  }

  appendElement(newBook) {
    /* Library is empty */
    if (this.size === 0) {
      this.head = new Category();
      this.head.setId(newBook.getCategory());
      this.tail = this.head;

      this.updateDisplay(this.head);
      this.head.appendElement(newBook);
      this.size += 1;

      /* Library has at least one category */
    } else {
      const categoryName = newBook.getCategory();
      let currentElement = this.head;

      /* Search for matching category, if non-existant create it */
      while (currentElement.getId() !== categoryName) {
        if (currentElement.getNextElement() !== null) {
          currentElement = currentElement.getNextElement();
        } else {
          currentElement.setNextElement(new Category());
          currentElement = currentElement.getNextElement();
          currentElement.setId(categoryName);

          this.updateDisplay(currentElement);
          if (this.size === 1) {
            this.tail = currentElement;
          }
          this.size += 1;
        }
      }
      currentElement.appendElement(newBook);
    }
  }

  updateDisplayRemove(category) {
    const removeCategory = document.getElementById(category.getId());
    removeCategory.parentNode.removeChild(removeCategory);
  }

  removeElement(bookId) {
    const categoryId = bookId.split("&");
    let currentElement = this.head;

    while (currentElement.getId() !== categoryId[0]) {
      currentElement = currentElement.getNextElement();
    }
    currentElement.removeElement(bookId);

    /* If the category is empty remove it */
    const categorySize = currentElement.getSize();
    if (categorySize === 0) {
      if (this.size === 1) {
        this.head = null;
        this.tail = null;
      } else if (this.head === currentElement) {
        this.head = currentElement.getNextElement();
        this.head.setPreviousElement(null);
      } else if (this.tail === currentElement) {
        this.tail = currentElement.getPreviousElement();
        this.tail.setNextElement(null);
      } else {
        currentElement.removeSelf();
      }
      this.updateDisplayRemove(currentElement);
      this.size -= 1;
    }
  }
}
