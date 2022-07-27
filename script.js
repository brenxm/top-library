

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.id = this.generateId();
    }

    toggleRead(event) {
        if (this.read){
            this.read = false;
        }
        else {
            this.read = true;
        }
    }

    generateId() {
        return Math.floor(Math.random() * 20);
    }

    getBookId() {
        return this.id;
    }
}

class Library {
    constructor() {
        this.books = [];
    }

    addBook(newBook) {
        this.books.push(newBook)
    }

    removeBook(clickedElement) {
        const _books = this.books;
        const removingBook = _books.find(book => book.getBookId == clickedElement.getAttribute("data-uid"));
        const index = _books.indexOf(removingBook);
        _books.splice(index, 1);
        clickedElement.remove();
    }
}

const Controller = (() => {
    function acceptForm(e) {
        const newBook = new Book(e.target.title.value, e.target.author.value, e.target.pages.value, false);
        domManager.generateHtmlElement(newBook);
        shelf.addBook(newBook);
        cancelUiForm(e);
        e.preventDefault();
    };

    function acceptUiForm() {
    };

    function newBookActive() {
        formTemplate.setAttribute('style', 'display: block');
    };

    function cancelUiForm(e) {
        inputs.forEach(x => x.value = '');
        formTemplate.setAttribute('style', 'display: none');
        e.stopPropagation();
        e.preventDefault();
    }

    function readIndicator(e, book) {
        const bookElem = shelf.books.find(x => x.id == book.getAttribute('data-uid'));
        bookElem.toggleRead(e);
        domManager.setUiIndicator(e, bookElem.read);
    }

    return { acceptForm, acceptUiForm, newBookActive, readIndicator, cancelUiForm };
})();

const domManager = (()=>{
    function generateHtmlElement(bookObj) {
        const container = document.createElement('div');
        const textContainer = document.createElement('div');
        const butContainer = document.createElement('div');
        container.setAttribute('class', 'book1');
        container.setAttribute('data-uid', bookObj.id);
        textContainer.setAttribute('id', 'text-container');
        butContainer.setAttribute('id', 'but-container');

        for (let i = 0; i < 3; i++) {
            const text = document.createElement('p');
            switch (i) {
                case 0:
                    text.textContent = bookObj.title;
                    break;
                case 1:
                    text.textContent = `by ${bookObj.author}.`;
                    break;
                case 2:
                    text.textContent = `${bookObj.pages} pages.`;
                    break;
            }
            textContainer.appendChild(text);
        }

        for (let i = 0; i < 2; i++) {
            const but = document.createElement('button');

            switch (i) {
                case 0:
                    but.setAttribute('class', 'book-status');
                    but.textContent = 'unread';
                    but.addEventListener('click', (e) => {
                        Controller.readIndicator(e, container);
                    });
                    break;
                case 1:
                    but.setAttribute('class', 'delete');
                    but.textContent = "X";
                    but.addEventListener('click', () => {
                        shelf.removeBook(container);
                    });
                    break;
            }
            butContainer.appendChild(but);
        }

        container.appendChild(textContainer);
        container.appendChild(butContainer);
        const booksContainer = document.querySelector('.books-container');
        booksContainer.appendChild(container);
    }

    function setUiIndicator(e, bool) {
        if (bool) {
            e.target.setAttribute("id", "book-status--read");
            e.target.textContent = "read";
            return;
        }

        e.target.setAttribute("id", "book-status--unread");
        e.target.textContent = "unread";
    }

    return { generateHtmlElement, setUiIndicator }
})();



const shelf = new Library();

const newBookBut = document.querySelector('.new-but');
const formTemplate = document.querySelector('.template-container')
const cancelBut = document.querySelector('.cancel-button');
const acceptBut = document.querySelector('.accept-button');
const form = document.querySelector('form');
const inputs = document.querySelectorAll('form input');

newBookBut.addEventListener('click', Controller.newBookActive);
cancelBut.addEventListener('click', Controller.cancelUiForm);
acceptBut.addEventListener('click', Controller.acceptUiForm);
form.addEventListener('submit', Controller.acceptForm);