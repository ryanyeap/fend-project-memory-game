/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 // Create Grid of cards (16 cards)
var card_list = ["paper-plane-o", "paper-plane-o", "diamond", "diamond", "anchor", "anchor", "bolt", "bolt", "cube", "cube",
             "leaf", "leaf", "bicycle", "bicycle", "bomb", "bomb"],
    $deck = jQuery('.deck'),
    opened = [],
    match = 0,
    moves = 0,
    $scorePanel = $('#score-panel'),
    $moveNum = $('.moves'),
    $ratingStars = $('i'),
    $restart = $('.restart'),
    delay = 800,
    gameCardsQTY = card_list.length / 2,
    rank3stars = gameCardsQTY + 2,
    rank2stars = gameCardsQTY + 6,
    rank1stars = gameCardsQTY + 10;

function startGame() {
    // create a deck.
    // use function shuffle on cards.
    var cards = shuffle(card_list);
    $deck.empty();
    match = 0;
    moves = 0;
    $moveNum.text('0');
    // create deck as html and append to class deck
    for (var i = 0; i < cards.length; i++) {
        $deck.append('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>');
    }
    cardEventListener();
}

// Card Event Listener that waits for clicks
var cardEventListener = function() {
    // Card flip

    // Find class card without class match and open. Listen for click
    $deck.find('.card:not(".match, .open")').on('click', function() {
        //if($('.show').length > 1) { return true; }

        var $this = $(this),
            card = $this.html();
        //alert(card);
        $this.addClass('open show');
        opened.push(card);

        // Compare with opened card
        if (opened.length > 1) {
            if (card === opened[0]) {
              $deck.find('.open').addClass('match animated infinite rubberBand');
              setTimeout(function() {
                $deck.find('.match').removeClass('open show animated infinite rubberBand');
              }, delay);
              match++;
            } else {
              $deck.find('.open').addClass('notmatch animated infinite wobble');
              setTimeout(function() {
                $deck.find('.open').removeClass('animated infinite wobble');
              }, delay / 1.5);
              setTimeout(function() {
                $deck.find('.open').removeClass('open show notmatch animated infinite wobble');
              }, delay);
            }
            opened = [];
            moves++;
            setRating(moves);
            $moveNum.html(moves);
        }
        // End Game if match all cards
        if (gameCardsQTY === match) {
            setRating(moves);
            var score = setRating(moves).score;
            setTimeout(function() {
              endGame(moves, score);
            }, 500);
        }
    });

};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Start the game!
startGame();


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
