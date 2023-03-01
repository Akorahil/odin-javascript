const bookAuthor = document.getElementById("Author");
const bookTitle = document.getElementById("Title");
const bookPages = document.getElementById("Pages");
const bookCategory = document.getElementById("Category");
const bookRead = document.getElementById("Read");

let switchStatus = false;

const myLibrary = new library();
const entryForm = document.getElementById("entryForm");

function addBook(title, author, pages, category, read) {
  const newBook = new Book();
  newBook.setTitle(title);
  newBook.setAuthor(author);
  newBook.setPages(pages);
  newBook.setCategory(category);
  newBook.setRead(read);

  myLibrary.appendElement(newBook);
}

document.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = bookTitle.value;
  const author = bookAuthor.value;
  const pages = bookPages.value;
  const category = bookCategory.value;
  const read = switchStatus;
  addBook(title, author, pages, category, read);
  entryForm.reset();
  switchStatus = false;
});

bookRead.addEventListener("click", (event) => {
  switchStatus = !switchStatus;
});

document.addEventListener("click", (event) => {
  const target = event.target.closest(".remove-button");
  if (target !== null) {
    const targetParent = target.parentElement;
    const bookId = targetParent.id;
    alert(bookId);
    myLibrary.removeElement(bookId);
  }
});

document.addEventListener("click", (event) => {
  const target = event.target.closest(".read-button");
  const targetInnerText = target.innerText;
  if (targetInnerText === "Read") {
    target.innerText = "Unread";
    target.classList.remove("read");
    target.classList.add("unread");
  } else {
    target.innerText = "Read";
    target.classList.remove("unread");
    target.classList.add("read");
  }
});
