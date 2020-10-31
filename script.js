const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const errorMsg = '<h2>Whoah! Something\'s wrong on our end!</h2><p>Please generate your quotes<span> <a href="https://quotes-generator.com/" target="_blank">elsewhere</a>!</span> ';
const createErrorLink = document.getElementById('create-error-link');

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

async function getQuote() {

    showLoadingSpinner();

    const proxyUrl = 'https://desolate-bastion-74248.herokuapp.com/'
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();

        if (data.quoteAuthor === '') {
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = data.quoteAuthor;
        }
        if (data.quoteText.length > 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText;

        removeLoadingSpinner();

        // When user clicks on 'Make Error Happen' link, call the createNewError function
        createErrorLink.addEventListener('click', createNewError);

        // Replaces the quote with the error message and removes the quotation mark, author and both buttons. Decreases font size.
        function createNewError() {
            quoteText.innerHTML = errorMsg;
            createErrorLink.classList.add('hidden');
            twitterBtn.classList.add('hidden');
            newQuoteBtn.classList.add('hidden');
            authorText.classList.add('hidden');
            quoteText.classList.add('smaller-font');
            document.querySelector('.quote-text i').classList.add('hidden');
            throw new Error(errorMsg);
        }

    } catch (error) {
        if (error) {
            quoteContainer.innerHTML = errorMsg;
        } else {
            getQuote();//recursive function
        }
    }
}

function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

getQuote();