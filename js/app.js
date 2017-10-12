// Create Grid of cards (16 cards)
let card_list = ["paper-plane-o", "paper-plane-o", "diamond", "diamond", "anchor", "anchor", "bolt", "bolt", "cube", "cube",
                "leaf", "leaf", "bicycle", "bicycle", "bomb", "bomb"],
    $deck = jQuery('.deck'),
    opened = [],
    match = 0,
    moves = 0,
    $moveNum = $('.moves'),
    $ratingStars = $('i'),
    $restart = $('.restart'),
    delay = 800,
    gameCardsQTY = card_list.length / 2,
    rank3stars = gameCardsQTY + 4,
    rank2stars = gameCardsQTY + 10,
    rank1stars = gameCardsQTY + 18,
    timer, gameStarted, currentTime;

// Start the Game!
function startGame() {
    // create a deck.
    // use function shuffle on cards.
    var cards = shuffle(card_list);
    // empty the deck
    $deck.empty();
    // reset timer
    clearInterval(timer);
    gameStarted = false;
    $(".clock").text('0:00');
    match = 0;
    // set moves to zero
    moves = 0;
    $moveNum.text('0');
    // reset stars
    $ratingStars.removeClass('fa-star-o').addClass('fa-star');
    // create deck as html and append to class deck
    for (var i = 0; i < cards.length; i++) {
        $deck.append('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>');
    }
    // start listener.
    cardEventListener();
}

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

// Set Rating (stars) and final Score
function setRating(moves) {
  var rating = 3;
  if (moves > rank3stars && moves < rank2stars) {
    $ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
    rating = 2;
  } else if (moves > rank2stars && moves < rank1stars) {
    $ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
    rating = 1;
  } else if (moves > rank1stars) {
    $ratingStars.eq(0).removeClass('fa-star').addClass('fa-star-o');
    rating = 0;
  } 
  return { score: rating };
};

// End Game using SweetAlert2
function endGame(moves, score, currentTime) {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Congratulations! Winner!',
    text: 'With ' + moves + ' Moves and ' + score + ' Stars and Time taken: ' + currentTime + '.\n',
    type: 'success',
    confirmButtonColor: '#02ccba',
    confirmButtonText: 'Play again!'
  }).then(function(isConfirm) {
    if (isConfirm) {
      startGame();
    }
  })
}

// Restart Game using SweetAlert2
$restart.on('click', function() {
     swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        title: 'Are you sure?',
        text: "Your progress will be Lost!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#02ccba',
        cancelButtonColor: '#f95c3c',
        confirmButtonText: 'Yes, Restart Game!'
    }).then(function(isConfirm) {
        if (isConfirm) {
            startGame();
        }
    })
    
});

// Timer function
const gameTimer = () => {

    let startTime = new Date().getTime();

    // Update the timer every second
    timer = setInterval(function() {

      var now = new Date().getTime();

      // Find the time elapsed between now and start
      var elapsed = now - startTime;

      // Calculate minutes and seconds
      let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

      // Add starting 0 if seconds < 10
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      currentTime = minutes + ':' + seconds;

      // Update clock on game screen and modal
      $(".clock").text(currentTime);
    }, 750);

  };

// Card Event Listener that waits for clicks
let cardEventListener = function() {
    // Card flip

    // Find class card without class match and open. Listen for click
    $deck.find('.card:not(".match, .open")').on('click', function() {
        if($('.show').length > 1) { return true; }
        // check for first click to start timer
        // Start timer on first click
        if (!gameStarted) {
            // start timer!
            gameTimer();
            gameStarted = true;
        }

        let $this = $(this),
            card = $this.html();

        $this.addClass('open show no-clicks');
        opened.push(card);
        
        // Compare with opened card
        if (opened.length > 1) {
            if (card === opened[0]) {
              $deck.find('.open').addClass('match no-clicks animated infinite rubberBand');
              setTimeout(function() {
                $deck.find('.match').removeClass('open show animated infinite rubberBand');
              }, delay);
              match++;
            } else {
              $deck.find('.open').addClass('no-clicks notmatch animated infinite wobble');
              setTimeout(function() {
                $deck.find('.open').removeClass('animated infinite wobble');
              }, delay / 1.5);
              setTimeout(function() {
                $deck.find('.open').removeClass('open show no-clicks notmatch animated infinite wobble');
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
                clearInterval(timer);
                endGame(moves, score, currentTime);
            }, 500);
        }
        
    });

};
// Start the game!
startGame();