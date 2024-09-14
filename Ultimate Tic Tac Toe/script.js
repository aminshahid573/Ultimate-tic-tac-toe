document.addEventListener('DOMContentLoaded', function() {
    const playerX = localStorage.getItem('playerX') || 'Player X';
    const playerO = localStorage.getItem('playerO') || 'Player O';
    
    let currentPlayer = 'X';
    let gameBoard = Array(9).fill(null).map(() => Array(9).fill(null));
    let mainBoardWins = Array(9).fill(null);
    let activeBoard = -1; // Indicates which small board is active (-1 means any)
    
    const currentTurnDisplay = document.getElementById('currentTurn');
    const mainBoardDiv = document.getElementById('mainBoard');
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
      <div class="popup-content">
        <h2 id="popupMessage"></h2>
        <button id="closePopup">OK</button>
      </div>
    `;
    document.body.appendChild(popup);
  
    // Close popup
    document.getElementById('closePopup').addEventListener('click', function() {
      popup.classList.remove('active');
    });
  
    // Initialize the 3x3 main board with 9 sub-boards
    function initGame() {
      for (let i = 0; i < 9; i++) {
        const subBoard = document.createElement('div');
        subBoard.classList.add('sub-board');
        subBoard.dataset.boardIndex = i;
        
        // Create the 9 cells inside each sub-board
        for (let j = 0; j < 9; j++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          cell.dataset.cellIndex = j;
          cell.dataset.boardIndex = i;
          cell.addEventListener('click', handleCellClick);
          subBoard.appendChild(cell);
        }
        mainBoardDiv.appendChild(subBoard);
      }
      updateTurnDisplay();
      highlightActiveBoard(); // Highlight the initial active board
    }
  
    // Update the turn display
    function updateTurnDisplay() {
      currentTurnDisplay.textContent = `${currentPlayer === 'X' ? playerX : playerO}'s turn (Playing as ${currentPlayer})`;
    }
  
    // Handle cell click event
    function handleCellClick(event) {
      const boardIndex = parseInt(event.target.dataset.boardIndex);
      const cellIndex = parseInt(event.target.dataset.cellIndex);
      
      if (mainBoardWins[boardIndex] || gameBoard[boardIndex][cellIndex]) {
        // If the sub-board is already won or the cell is taken, return
        return;
      }
  
      // Check if the player is allowed to play in this sub-board
      if (activeBoard !== -1 && activeBoard !== boardIndex) {
        alert("You must play in the highlighted board!");
        return;
      }
  
      // Mark the cell
      event.target.textContent = currentPlayer;
      gameBoard[boardIndex][cellIndex] = currentPlayer;
  
      // Check if the current sub-board is won
      if (checkWin(gameBoard[boardIndex])) {
        mainBoardWins[boardIndex] = currentPlayer;
        markBoardWon(boardIndex, currentPlayer);
      }
  
      // Check if the overall game is won
      if (checkWin(mainBoardWins)) {
        showPopup(`${currentPlayer === 'X' ? playerX : playerO} wins the game!`);
        return;
      }
  
      // Switch player
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      
      // Set the next active board
      if (!mainBoardWins[cellIndex]) {
        activeBoard = cellIndex;
      } else {
        activeBoard = -1; // Any board is available if the required board is won or full
      }
  
      highlightActiveBoard(); // Highlight the new active board
      updateTurnDisplay();
    }
  
    // Check if a board (small or main) is won
    function checkWin(board) {
      const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
      ];
  
      for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return true;
        }
      }
      return false;
    }
  
    // Mark the sub-board as won with large X or O
    function markBoardWon(boardIndex, player) {
      const subBoard = document.querySelector(`.sub-board[data-board-index="${boardIndex}"]`);
      subBoard.classList.add('won');
      subBoard.innerHTML = `<span>${player}</span>`;
    }
  
    // Highlight the active board
    function highlightActiveBoard() {
      const allBoards = document.querySelectorAll('.sub-board');
      
      // Remove highlight from all sub-boards
      allBoards.forEach(board => {
        board.classList.remove('highlight');
      });
  
      // Highlight the active board
      if (activeBoard !== -1) {
        const activeSubBoard = document.querySelector(`.sub-board[data-board-index="${activeBoard}"]`);
        activeSubBoard.classList.add('highlight');
      }
    }
  
    // Display a popup with the game announcement
    function showPopup(message) {
      document.getElementById('popupMessage').textContent = message;
      popup.classList.add('active');
    }
  
    // Restart the game
    document.getElementById('restartGame').addEventListener('click', function() {
      mainBoardDiv.innerHTML = '';
      gameBoard = Array(9).fill(null).map(() => Array(9).fill(null));
      mainBoardWins = Array(9).fill(null);
      currentPlayer = 'X';
      activeBoard = -1;
      initGame();
    });
  
    // Initialize the game on load
    initGame();
  });
  