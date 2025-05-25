debugger;
let balance = 0.0;
let multiplier = 0.00;
let interval = null;
let position = 0;
let crashed = false;
let autoRestartDelay = 3000;
let soundOn = true;

let betA = { amount: 0, placed: false, cashedOut: false };
let betB = { amount: 0, placed: false, cashedOut: false };

const plane = document.getElementById("plane");
const multiplierDisplay = document.getElementById("multiplier");
const crashDisplay = document.getElementById("crash-msg");
const statusText = document.getElementById("status");
const balanceEl = document.getElementById("balance");
const historyList = document.getElementById("history-list");

const soundToggleBtn = document.getElementById("sound-toggle");

//soundToggleBtn.onclick = () => {
//    soundOn = !soundOn;
//    soundToggleBtn.textContent = soundOn ? '🔊 Sound: ON' : '🔇 Sound: OFF';
//};


function placeBet(betObj, inputId, cancelBtn, cashoutBtn, placeBtn, BetType) {
    const amount = parseFloat(document.getElementById(inputId).value);
    if (isNaN(amount) || amount <= 0 || amount > balance) {
        //alert("Invalid bet or insufficient balance.");
        return;
    }
    betObj.amount = amount;
    betObj.placed = true;
    betObj.cashedOut = false;
    placeBtn.disabled = true;
    cancelBtn.disabled = true;
    cashoutBtn.disabled = false;
    /*  playSound(betSound);*/
    statusText.textContent = "Bet placed.";
    //bet lagne ka status send to handler
    let RoundNo = document.getElementById("Roundno").textContent.trim();
    let Memid = document.getElementById("userId").textContent.trim();

    let formData = new FormData();
    formData.append("action", "placeBet");
    formData.append("betAmount", betObj.amount);
    formData.append("betType", BetType);
    formData.append("RoundNo", RoundNo);
    formData.append("Memid", Memid);
    const liveMultiplier = parseFloat(document.getElementById("multiplier").textContent.replace("x", ""));
    formData.append("multiplier", liveMultiplier.toFixed(2));

    $.ajax({
        url: 'BetPlayHistoryUpdate.ashx',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Update balance from response
            //balance = response.balance; // Get new balance from server response
            //document.getElementById("WalletBalnc").textContent = balance.toFixed(2);
            //playSound(betSound);
            statusText.textContent = "Bet placed.";
        },
        error: function (xhr, status, error) {
            console.log("Error placing bet:", error);
        }
    });
}

function cancelBet(betObj, placeBtn, cancelBtn, cashoutBtn, BetType) {
    betObj.placed = false;
    placeBtn.disabled = false;
    cancelBtn.disabled = true;
    cashoutBtn.disabled = true;
    statusText.textContent = "Bet canceled.";

    let RoundNo = document.getElementById("Roundno").textContent.trim();
    let Memid = document.getElementById("userId").textContent.trim();
    let formData = new FormData();
    formData.append("action", "CancelBet");
    formData.append("betAmount", betObj.amount);
    formData.append("betType", BetType);
    formData.append("RoundNo", RoundNo);
    formData.append("Memid", Memid);

    $.ajax({
        url: 'BetPlayHistoryUpdate.ashx',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Update balance from response
            balance = response.balance; // Get new balance from server response
            document.getElementById("WalletBalnc").textContent = balance.toFixed(2);
            //playSound(betSound);
            statusText.textContent = "Bet placed.";
        },
        error: function (xhr, status, error) {
            console.log("Error placing bet:", error);
        }
    });
}

function cashout(betObj, label, placeBtn, cancelBtn, cashoutBtn, BetType) {
    if (betObj.placed && !crashed && !betObj.cashedOut) {
        const win = betObj.amount * multiplier;
        balance += win;
        document.getElementById("WalletBalnc").textContent = balance.toFixed(2);
        addHistory(true, multiplier, win, label);
        betObj.placed = false;
        betObj.cashedOut = true;
        placeBtn.disabled = false;
        cancelBtn.disabled = true;
        cashoutBtn.disabled = true;
        statusText.textContent = `${label} cashed out @ ${multiplier.toFixed(2)}x - Won $${win.toFixed(2)}`;
        //playSound(cashoutSound);

        let RoundNo = document.getElementById("Roundno").textContent.trim();
        let Memid = document.getElementById("userId").textContent.trim();
        let formData = new FormData();
        formData.append("action", "CashoutBet");
        formData.append("betAmount", betObj.amount);
        formData.append("betType", BetType);
        formData.append("RoundNo", RoundNo);
        formData.append("Memid", Memid);
        formData.append("multiplier", multiplier.toFixed(2));

        $.ajax({
            url: 'BetPlayHistoryUpdate.ashx',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                // Update balance from response
                balance = response.balance; // Get new balance from server response
                document.getElementById("WalletBalnc").textContent = balance.toFixed(2);
                //playSound(betSound);
                statusText.textContent = "Bet placed.";
            },
            error: function (xhr, status, error) {
                console.log("Error placing bet:", error);
            }
        });
    }
}

function addHistory(won, mult, amount, label) {
    const entry = document.createElement("div");
    entry.className = `history-entry ${won ? 'win' : 'loss'}`;
    entry.textContent = `${label} ${won ? 'Win' : 'Loss'} @ ${mult.toFixed(2)}x - $${amount.toFixed(2)}`;
    historyList.prepend(entry);
}

let lastCrashMultiplier = 0;//store Crash Multier value
function crash() {

    crashed = true;
    clearInterval(interval);
    crashDisplay.style.display = "block";
    //playSound(crashSound);
    lastCrashMultiplier = (Math.floor(multiplier * 100) / 100).toFixed(2);
    //send Crash value in handler
    sendCrashMultiplierToServer(lastCrashMultiplier);
    //updateRoundInfo();
    if (betA.placed && !betA.cashedOut) {
        balance -= betA.amount;
        document.getElementById("WalletBalnc").textContent = balance.toFixed(2);
        addHistory(false, multiplier, betA.amount, "Bet A");
    }
    if (betB.placed && !betB.cashedOut) {
        balance -= betB.amount;
        document.getElementById("WalletBalnc").textContent = balance.toFixed(2);
        addHistory(false, multiplier, betB.amount, "Bet B");
    }

    resetBets();
    setTimeout(() => startGame(), autoRestartDelay);
}

function resetBets() {
    [betA, betB].forEach(bet => {
        bet.placed = false;
        bet.cashedOut = false;
    });

    document.getElementById("placeBetA").disabled = false;
    document.getElementById("placeBetB").disabled = false;
    document.getElementById("cancelBetA").disabled = true;
    document.getElementById("cancelBetB").disabled = true;
    document.getElementById("cashoutA").disabled = true;
    document.getElementById("cashoutB").disabled = true;
}

let lastMultiplier = null;
function startGame() {
    multiplier = 0.00;
    position = 0;
    crashed = false;
    crashDisplay.style.display = "none";
    multiplierDisplay.textContent = "0.00x";
    plane.style.left = "0px";
    statusText.textContent = "Round started...";
    updateRoundInfo();
    ///bet Place Time 

    document.getElementById("placeBetA").disabled = false;
    document.getElementById("placeBetB").disabled = false;
    document.getElementById("cancelBetA").disabled = true;
    document.getElementById("cancelBetB").disabled = true;
    document.getElementById("cashoutA").disabled = true;
    document.getElementById("cashoutB").disabled = true;
    let countdown = 5;
    const countdownInterval = setInterval(() => {
        statusText.textContent = `Round starts in ${countdown--}...`;
        if (countdown < 0) {
            clearInterval(countdownInterval);

            statusText.textContent = "Round started!";

            interval = setInterval(() => {
                multiplier = parseFloat((multiplier + 0.05).toFixed(2));
                position += 6;
                multiplierDisplay.textContent = multiplier + "x";
                plane.style.left = position + "px";

                if (multiplier <= 0 && lastMultiplier !== multiplier) {
                    lastMultiplier = multiplier;
                    setMultiplierCookie(lastMultiplier); // Cookie mein store karna
                    sendMultiplierToServer(lastMultiplier); // Server ko bhejna
                }

                const randomCrash = Math.random() < 0.01 || position > window.innerWidth - 100;
                if (randomCrash && !crashed) crash();
            }, 100);
        }
    },
        1000);
}
// Event Listeners for Bet A
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("placeBetA").onclick = () =>
        placeBet(betA, "betInputA", cancelBetA, cashoutA, placeBetA, "Bet_A");

    // Event Listeners for Bet B
    document.getElementById("placeBetB").onclick = () =>
        placeBet(betB, "betInputB", cancelBetB, cashoutB, placeBetB, "Bet_B");

    document.getElementById("cashoutB").onclick = () =>
        cashout(betB, "Bet B", placeBetB, cancelBetB, cashoutB, "CashOutBet_A");

    document.getElementById("cancelBetA").onclick = () =>
        cancelBet(betA, placeBetA, cancelBetA, cashoutA, "CancleBet_A");

    document.getElementById("cashoutA").onclick = () =>
        cashout(betA, "Bet A", placeBetA, cancelBetA, cashoutA, "CashOutBet_A");



    document.getElementById("cancelBetB").onclick = () =>
        cancelBet(betB, placeBetB, cancelBetB, cashoutB, "CancleBet_A");
});
// Start first round
startGame();

///for start game ke liye (0)X multi ki value sent in handler
function sendMultiplierToServer(multiplierValue) {
    const formData = new FormData();
    formData.append("action", "BetStart");
    formData.append("multiplier", multiplierValue);

    fetch('BetPlayHistoryUpdate.ashx', {
        method: 'POST',
        body: formData
    })
}


function setMultiplierCookie(multiplierValue) {
    const cookieName = 'multiplier';
    const cookieValue = multiplierValue;
    const path = '/'; // Cookie ko site ke root path par set karein
    // Session cookie 
    document.cookie = `${cookieName}=${cookieValue}; path=${path}; SameSite=Lax`;
}

////Jab plan crash ho jaye to crash ka status handler beja 
function sendCrashMultiplierToServer(multiplierValue, RoundStatus) {
    let roundNo = $('#Roundno').text().trim();
    let roundStatus = (crashDisplay.style.display === "block") ? "CloseRound" : "Running";

    $.ajax({
        url: "BetHistoryUpdate.ashx",
        type: "POST",
        data: {
            action: "recordCrash",
            multiplier: multiplierValue,
            roundNo: roundNo,
            roundStatus: roundStatus
        },
        success: function (response) {
            // Server se response ko JSON format me convert karo (agar zarurat ho)
            let res = {};
            try {
                res = JSON.parse(response);
            } catch (e) {
                console.error("Invalid JSON from server:", response);
                return;
            }

            if (res.Rlt === "IsOk" && roundStatus === "CloseRound") {
                // Agar sab sahi gaya toh ye function call karo
                updateRoundInfo();
            }

        }
    });
}

///New Round generate krne ke liye 
function updateRoundInfo() {
    $.ajax({
        url: "StartNewRound.ashx",
        type: "GET",
        dataType: "json",
        success: function (Response) {
            debugger;
            if (Response.Success) {
                $('#Roundno').html(Response.RoundNo + '&emsp;');
                $('#userId').html(Response.UserId + '&emsp;');
                $('#WalletBalnc').html(Response.WalletBlnc + '&emsp;');
                $('#PendingBetA').html(Response.PendingBetA + '&emsp;');
                $('#PendingBetB').html(Response.PendingBetB + '&emsp;');

                document.getElementById("cashoutA").disabled = (Response.PendingBetA == 0);
                document.getElementById("cashoutB").disabled = (Response.PendingBetB == 0);
            }
            else {
                //debugger
                /* alert("My handler me fault"+Response.error);*/
                window.location.href = "SignIn.aspx";
            }
        },
        error: function (xhr, status, error) {
            console.log('my page Error' + error);
            console.log('my page Error' + error);
        }
    });
}