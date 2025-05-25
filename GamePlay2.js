class CrashGame {
    constructor() {
        // Game state
        this.balance = 1000;
        this.multiplier = 1.00;
        this.interval = null;
        this.position = 0;
        this.crashed = false;
        this.autoRestartDelay = 3000;
        this.soundOn = true;
        this.lastCrashMultiplier = 0;

        // Bets with all related element IDs
        this.bets = {
            A: {
                amount: 0,
                placed: false,
                cashedOut: false,
                inputId: "betInputA",
                placeBtnId: "placeBetA",
                cancelBtnId: "cancelBetA",
                cashoutBtnId: "cashoutA",
                label: "Bet A",
                type: "A"
            },
            B: {
                amount: 0,
                placed: false,
                cashedOut: false,
                inputId: "betInputB",
                placeBtnId: "placeBetB",
                cancelBtnId: "cancelBetB",
                cashoutBtnId: "cashoutB",
                label: "Bet B",
                type: "B"
            }
        };

        // DOM elements
        this.domElements = {
            plane: document.getElementById("plane"),
            multiplierDisplay: document.getElementById("multiplier"),
            crashDisplay: document.getElementById("crash-msg"),
            statusText: document.getElementById("status"),
            balanceEl: document.getElementById("balance"),
            historyList: document.getElementById("history-list"),
            soundToggleBtn: document.getElementById("sound-toggle"),
            walletBalance: document.getElementById("WalletBalnc")
        };

        // Sound elements
        this.sounds = {
            cashout: document.getElementById("cashoutSound"),
            crash: document.getElementById("crashSound"),
            bet: document.getElementById("betSound")
        };

        // Initialize game
        this.setupEventListeners();
        this.startGame();
    }

    /* ========== CORE GAME FUNCTIONS ========== */

    startGame() {
        this.resetGameState();
        this.updateUI();
        this.domElements.statusText.textContent = "Round started...";

        this.interval = setInterval(() => {
            this.updateGameState();

            if (this.checkCrashCondition()) {
                this.crash();
            }
        }, 100);
    }

    resetGameState() {
        clearInterval(this.interval);
        this.multiplier = 1.00
        this.position = 0;
        this.crashed = false;
        this.domElements.crashDisplay.style.display = "none";
    }

    updateGameState() {
        this.multiplier = parseFloat((this.multiplier + 0.05).toFixed(2));
        this.position += (window.innerWidth * 0.01); // Responsive movement
        this.updateUI();
    }

    checkCrashCondition() {
        const randomCrash = Math.random() < 0.01 || this.position > window.innerWidth - 100;
        return randomCrash && !this.crashed;
    }

    crash() {
        this.crashed = true;
        clearInterval(this.interval);

        this.lastCrashMultiplier = parseFloat(this.multiplier.toFixed(2));
        this.sendCrashMultiplierToServer(this.lastCrashMultiplier);
        this.playSound(this.sounds.crash);

        this.processBetsAfterCrash();
        this.updateUI();

        setTimeout(() => this.startGame(), this.autoRestartDelay);
    }

    processBetsAfterCrash() {
        Object.values(this.bets).forEach(bet => {
            if (bet.placed && !bet.cashedOut) {
                this.balance -= bet.amount;
                this.addHistory(false, this.multiplier, bet.amount, bet.label);
            }
        });

        this.resetBets();
    }

    /* ========== BET MANAGEMENT ========== */

    placeBet(betType) {
        const bet = this.bets[betType];
        const amount = parseFloat(document.getElementById(bet.inputId).value);

        if (!this.validateBet(amount)) return;

        bet.amount = amount;
        bet.placed = true;
        bet.cashedOut = false;

        this.playSound(this.sounds.bet);
        this.domElements.statusText.textContent = `${bet.label} placed.`;
        this.updateButtonStates(betType);

        this.sendBetToServer(bet.amount, bet.type, "placeBet");
    }

    cancelBet(betType) {
        const bet = this.bets[betType];
        bet.placed = false;
        this.domElements.statusText.textContent = `${bet.label} canceled.`;
        this.updateButtonStates(betType);

        this.sendBetToServer(bet.amount, bet.type, "cancelBet");
    }

    cashout(betType) {
        const bet = this.bets[betType];
        if (!bet.placed || this.crashed || bet.cashedOut) return;

        const win = bet.amount * this.multiplier;
        this.balance += win;
        bet.cashedOut = true;

        this.addHistory(true, this.multiplier, win, bet.label);
        this.domElements.statusText.textContent =
            `${bet.label} cashed out @ ${this.multiplier.toFixed(2)}x - Won $${win.toFixed(2)}`;
        this.playSound(this.sounds.cashout);
        this.updateButtonStates(betType);

        this.sendBetToServer(bet.amount, bet.type, "cashoutBet", this.multiplier);
    }

    resetBets() {
        Object.values(this.bets).forEach(bet => {
            bet.placed = false;
            bet.cashedOut = false;
        });
        this.updateAllButtonStates();
    }

    /* ========== HELPER FUNCTIONS ========== */

    validateBet(amount) {
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid bet amount.");
            return false;
        }
        if (amount > this.balance) {
            alert("Insufficient balance.");
            return false;
        }
        return true;
    }

    updateUI() {
        this.domElements.multiplierDisplay.textContent = this.multiplier.toFixed(2) + "x";
        this.domElements.plane.style.left = this.position + "px";
        this.domElements.crashDisplay.style.display = this.crashed ? "block" : "none";
        this.domElements.walletBalance.textContent = this.balance.toFixed(2);
    }

    updateButtonStates(betType) {
        const bet = this.bets[betType];
        document.getElementById(bet.placeBtnId).disabled = bet.placed;
        document.getElementById(bet.cancelBtnId).disabled = !bet.placed || bet.cashedOut;
        document.getElementById(bet.cashoutBtnId).disabled = !bet.placed || bet.cashedOut || this.crashed;
    }

    updateAllButtonStates() {
        Object.keys(this.bets).forEach(betType => this.updateButtonStates(betType));
    }

    addHistory(won, mult, amount, label) {
        const entry = document.createElement("div");
        entry.className = `history-entry ${won ? 'win' : 'loss'}`;
        entry.textContent = `${label} ${won ? 'Win' : 'Loss'} @ ${mult.toFixed(2)}x - $${amount.toFixed(2)}`;
        this.domElements.historyList.prepend(entry);
    }

    playSound(sound) {
       // if (this.soundOn && sound) sound.play();
    }

    /* ========== SERVER COMMUNICATION ========== */

    sendBetToServer(amount, betType, action, multiplier = null) {
        const formData = new FormData();
        formData.append("action", action);
        formData.append("betAmount", amount);
        formData.append("betType", betType);
        formData.append("RoundNo", document.getElementById("Roundno").textContent.trim());
        formData.append("Memid", document.getElementById("userId").textContent.trim());

        if (multiplier) {
            formData.append("multiplier", multiplier.toFixed(2));
        }

        $.ajax({
            url: 'BetPlayHistoryUpdate.ashx',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: (response) => {
                if (response && response.balance !== undefined) {
                    this.balance = response.balance;
                    this.updateUI();
                }
            },
            error: (xhr, status, error) => {
                console.error("Error:", error);
                this.domElements.statusText.textContent = "Operation failed. Please try again.";
            }
        });
    }

    sendCrashMultiplierToServer(multiplierValue) {
        const formData = new FormData();
        formData.append("action", "crashMultiplier");
        formData.append("multiplier", multiplierValue);

        fetch('BetPlayHistoryUpdate.ashx', {
            method: 'POST',
            body: formData
        }).catch(error => console.error("Error sending crash multiplier:", error));
    }

    /* ========== EVENT LISTENERS ========== */

    setupEventListeners() {
        // Sound toggle
        this.domElements.soundToggleBtn.onclick = () => {
            this.soundOn = !this.soundOn;
            this.domElements.soundToggleBtn.textContent =
                this.soundOn ? '🔊 Sound: ON' : '🔇 Sound: OFF';
        };

        // Bet controls
        Object.entries(this.bets).forEach(([betType, bet]) => {
            document.getElementById(bet.placeBtnId).onclick = () => this.placeBet(betType);
            document.getElementById(bet.cancelBtnId).onclick = () => this.cancelBet(betType);
            document.getElementById(bet.cashoutBtnId).onclick = () => this.cashout(betType);
        });
    }
}

// Initialize the game when the script loads
document.addEventListener('DOMContentLoaded', () => {
    new CrashGame();
});