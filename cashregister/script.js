let price = 19.5;
let cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];

document.getElementById('purchase-btn').addEventListener('click', handlePurchase);

function handlePurchase() {
    const cashInput = document.getElementById('cash').value;
    const cash = parseFloat(cashInput);
    const changeDueElement = document.getElementById('change-due');

    if (isNaN(cash)) {
        alert('Please enter a valid number for cash.');
        return;
    }

    const priceCents = Math.round(price * 100);
    const cashCents = Math.round(cash * 100);
    const changeDueCents = cashCents - priceCents;

    if (changeDueCents < 0) {
        alert('Customer does not have enough money to purchase the item');
        return;
    } else if (changeDueCents === 0) {
        changeDueElement.textContent = 'No change due - customer paid with exact cash';
        return;
    }

    let totalCidCents = 0;
    const cidInCents = cid.map(entry => {
        const amountCents = Math.round(entry[1] * 100);
        totalCidCents += amountCents;
        return [entry[0], amountCents];
    });

    if (totalCidCents < changeDueCents) {
        updateStatus('INSUFFICIENT_FUNDS', []);
        return;
    }

    const cidCopy = cidInCents.map(entry => [...entry]);
    let remainingChangeDue = changeDueCents;

    const denominations = [
        { name: 'ONE HUNDRED', value: 10000 },
        { name: 'TWENTY', value: 2000 },
        { name: 'TEN', value: 1000 },
        { name: 'FIVE', value: 500 },
        { name: 'ONE', value: 100 },
        { name: 'QUARTER', value: 25 },
        { name: 'DIME', value: 10 },
        { name: 'NICKEL', value: 5 },
        { name: 'PENNY', value: 1 }
    ];

    const changeBreakdown = [];
    for (const denom of denominations) {
        const cidEntry = cidCopy.find(e => e[0] === denom.name);
        if (!cidEntry) continue;

        const availableCents = cidEntry[1];
        const value = denom.value;

        const maxCount = Math.floor(remainingChangeDue / value);
        const availableCount = Math.floor(availableCents / value);
        const countToUse = Math.min(maxCount, availableCount);

        if (countToUse > 0) {
            const takenCents = countToUse * value;
            changeBreakdown.push([denom.name, takenCents / 100]);
            remainingChangeDue -= takenCents;
            cidEntry[1] -= takenCents;
        }

        if (remainingChangeDue === 0) break;
    }

    if (remainingChangeDue > 0) {
        updateStatus('INSUFFICIENT_FUNDS', []);
        return;
    }

    if (totalCidCents === changeDueCents) {
        const closedBreakdown = cid.filter(entry => entry[1] > 0);
        updateStatus('CLOSED', closedBreakdown);
    } else {
        updateStatus('OPEN', changeBreakdown);
    }
}

function formatCurrency(amount) {
    let value = amount.toFixed(2);
    let parts = value.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1].replace(/0+$/, '');
    return decimalPart === '' ? integerPart : `${integerPart}.${decimalPart}`;
}

function updateStatus(status, breakdown) {
    let statusText = `Status: ${status}`;
    if (status === 'OPEN' || status === 'CLOSED') {
        breakdown.forEach(entry => {
            statusText += ` ${entry[0]}: $${formatCurrency(entry[1])}`;
        });
    }
    document.getElementById('change-due').textContent = statusText;
}