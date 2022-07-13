const newBookBut = document.querySelector('.new-but');
const formTemplate = document.querySelector('.template-container')
const cancelBut = document.querySelector('.cancel-button');
const acceptBut = document.querySelector('.accept-button');
const form = document.querySelector('form');
const inputs = document.querySelectorAll('form input');
const shelf = [];

newBookBut.addEventListener('click', newBookActive);
cancelBut.addEventListener('click', cancelUiForm);
acceptBut.addEventListener('click', acceptUiForm);
form.addEventListener('submit', acceptForm);

function acceptForm(e){
    const newBook = new BookTemplate(e.target.title.value, e.target.author.value, e.target.pages.value, false);
    createBookElement(newBook);
    shelf.push(newBook);
    e.preventDefault();
    cancelUiForm(e);
}

function acceptUiForm(){
    console.log('clicking accept');
}

function newBookActive() {
    formTemplate.setAttribute('style', 'display: block');
};

function cancelUiForm(e) {
    inputs.forEach(x => x.value = '');
    formTemplate.setAttribute('style', 'display: none');
    e.stopPropagation();
    e.preventDefault();
}

function BookTemplate(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.uid = generateId();
}

function deleteBook(book){
    //removing from shelf array
    const bookElem = shelf.find(x => x.uid == book.getAttribute('data-uid'));
    const index = shelf.indexOf(bookElem);
    shelf.splice(index, 1);
    //removing from html
    book.remove();
}

function readIndicator(e, book){
    const bookElem = shelf.find(x => x.uid == book.getAttribute('data-uid'));
    const index = shelf.indexOf(bookElem);
    let read = shelf[index].read;

    read ? toggleRead() : toggleUnread();

    function toggleRead(){
        shelf[index].read = false;
        e.target.setAttribute('style', 'background-color: #FF5733; width: 68px;');
        e.target.textContent = 'unread';
    }

    function toggleUnread(){
        e.target.setAttribute('style', 'background-color: #A2FF33; width: 49px;');
        shelf[index].read = true;
        e.target.textContent = 'read';
    }
}


function createBookElement(bookObj){
    const container = document.createElement('div');
    const textContainer = document.createElement('div');
    const butContainer = document.createElement('div');
    container.setAttribute('class', 'book1');
    container.setAttribute('data-uid', bookObj.uid);
    textContainer.setAttribute('id', 'text-container');
    butContainer.setAttribute('id', 'but-container');

    //generate text elements
    for(let i = 0; i < 3; i++ ){
        const text = document.createElement('p');
        switch(i){
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

    //generate button elements
    for(let i = 0; i < 2; i++){
        const but = document.createElement('button');

        switch(i){
            case 0 :
                but.setAttribute('class','book-status');
                but.textContent = 'unread';
                but.addEventListener('click', (e) => { // make button active to user
                    readIndicator(e, container);
                });
                break;
            case 1 :
                but.setAttribute('class', 'delete');
                but.textContent = "X";
                but.addEventListener('click', () => { // make button active to user
                    deleteBook(container); 
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

function generateId (){
    const id = Math.floor(Math.random() * 1000);
   if (shelf.every(x => x.uid != id)){
    return id;
   }

   return generateId();
}

