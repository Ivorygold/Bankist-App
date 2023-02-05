'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2023-01-26T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2023-01-24T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//instead of working with your data as global variable, parse it as a function

const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

const displayMovements = function (acc, sort = false) {
  //to override our hardcoded element
  containerMovements.innerHTML = '';
  //sorting
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);

    const html = ` 
      <div class="movements__row">
      <div class="movements__type 
      movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;
    //to display this on our html page we use insertADjacentHTML
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  //to display from a page to the other part of the page.
  labelBalance.textContent = `${acc.balance}€`;
};

//summary of account || sumIn
const calcDisplaySummary = function (accounts) {
  const incomes = accounts.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  //SumOut
  const out = accounts.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  //sumInterest
  const interest = accounts.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * accounts.interestRate) / 100)
    .filter(int => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//getting a userName
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);
//console.log(accounts);

const updateUI = function (acc) {
  //Display movement
  displayMovements(acc);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//Event Handler
//lOGIN DETAILS
let currentAccount;

//Fake always login
/*currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;*/

btnLogin.addEventListener('click', function (e) {
  //this prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and Massage
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //create current date
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    //clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //updateUI
    updateUI(currentAccount);
  } else {
    alert('You Inputted wrong username or pin!');
  }
});

//transfer box and its functions
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    //updateUI
    updateUI(currentAccount);
  }
  inputTransferTo.value = inputTransferAmount.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add the movement
    currentAccount.movements.push(amount);
    //add loan date
    currentAccount.movementsDates.push(new Date().toISOString());
    //update the Ui
    updateUI(currentAccount);
  } else {
    alert(
      `hello, ${
        currentAccount.owner.split(' ')[0]
      } you cant request a loan more than 10% of your total balance `
    );
  }
  inputLoanAmount.value = '';
});

//findindex method, we use split method to delete and use findIndex to locate the index to be deleted
//Close AccountBTN
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    //delete account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
///////////////////////////////////////s//////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//FOR OF EACH METHOD
/*
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`movement ${i + 1}:  you deposited ${movement}`);
  } else {
    console.log(`movement ${i + 1}: You Withdrew ${Math.abs(movement)}`);
  }
}

//FOREACH METHOD
//This is a higher order function an requires a callback function
console.log(`---FOREACH---`);

movements.forEach(function (movement, i, arr) {
  if (movement > 0) {
    console.log(`movement ${i + 1}: you deposited ${movement}`);
  } else {
    console.log(`movement ${i + 1}: You Withdrew ${Math.abs(movement)}`);
  }
});
//difference b/w forEach and for of each
// 1. you cant break out of forEach method. as such it must loop through all the entire array.
// however you can break out of a loop in for of each otherwise it depends on you

//Slice method
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2)); //this does not mutate the original array rather it prints a new array
console.log(arr.slice(2, 4)); //here means that the end parammeter is not inclusive
//we can use a negative number on it.
console.log(arr.slice(1, -1));
//to make a shallow copy of the original array, we can call the slice fun without any parameter
console.log(arr.slice()); // this can also be done using a spread operator
console.log([...arr]);

//SPLICE METHOD
//This work the same way as slice but it change the original array, so it mutate that array
//splice will delete from the original array ones called

//console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);

//REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
//REVERSE method does mutate the original version of array
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse()); //this actually reversed the original array and if we call on the original arr we will see that it has been mutated.
console.log(arr2);

//CONCAT METHOD
//THIS IS USED IN JOINING TWO DIFFERENT ARRAYS

const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

//JOIN METHOD
//this join all the letters together.

console.log(letters.join(' - '));

//the AT method
const Arr = [23, 11, 64];
console.log(Arr[0]);
console.log(Arr.at(0));

//GETTING THE LAST ARRAY ELEMENT
console.log(Arr[Arr.length - 1]);
console.log(Arr.slice(-1)[0]);
console.log(Arr.at(-1));

//the at method also works on string
console.log('udemba'.at(0));
console.log('udemba'.at(-1));

//forEach maps and set
//Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});
//map is associated with automatic return

//Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${_}: ${value}`);
});

//Code Challenge

/* JULIA and KATE are doing a study on dugs, so each of them asked 5 
dogs owners their dogs age, and stored the data in an array(one array 
for each). For now, they are just interested in knowing whether a dog is
an adult or a puppy. A dog is an adult if it is at least 3 years old, 
and its a puppy if its less than 3 years old.

Create a function "CheckDogs", which accepts 2 array of dogs ages 
('dogsJulia', and 'dogsKate'), AND DOES the following things;

1. julia found out that the owners of the first and the last two dogs
actually have cats,not dogs, so create a shallow copy of Julias array 
and remove the cat ages from that copied array(because its a bad 
practice to mutate function parameter)
2. create an array with both Julia corrected AND kATE's data
3. For each remaining dog, log to the console whether its an adult 
("Dogs number 1 is an adult, and is 5 years old") or a puppy 
("Dog number 2 is still a puppy")
4. run the function for both test datasets

Test data 1: Julia data [3,5,2,12,7], Kate's Data [4,1,15,8,3]
Test Data 2: julia data  [9,16,6,8,3], Kate's Data [10,5,6,1,4]


let dogsJulia = [3, 5, 2, 12, 7];
const dogsJulia1 = [9, 16, 6, 8, 3];
let juliaCorrected = [...dogsJulia, ...dogsJulia1];
juliaCorrected.slice();
juliaCorrected = juliaCorrected.slice(1, -2);
console.log(juliaCorrected);

const dogsKate = [9, 16, 6, 8, 3];
const dogsKate1 = [10, 5, 6, 1, 4];
let KateData = [...dogsKate, ...dogsKate1];

let dogData = [...juliaCorrected, ...KateData];
console.log(dogData);

dogData.forEach(function (dogData, i, arr) {
  if (dogData > 2) {
    console.log(
      `Dogs number ${i + 1} is an adult, and is ${dogData} years old`
    );
  } else {
    console.log(`Dog number ${i + 1} is still a puppy`);
  }
});

const eurToUsd = 1.1;
const movementsUSD = movements.map(function (mov) {
  return mov * eurToUsd;
});

console.log(movementsUSD);

//for of loop uses push
const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);

//Reduce Function
// the first parametter in the call back function is an accumulator
//accumulator is like a snowball in its effect.
console.log(movements);

/*const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`iteration ${i}: ${acc}`);
  return acc + cur;
}, 0);
console.log(balance);

//using Arrow fun
const balance = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance);

//using for of loop
let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

//Finding the Maximum Value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);

//chaining method
//find method
/*const firstWithdrawal = movements.find(mov => mov < 0);

console.log(movements);
console.log(firstWithdrawal);
console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

//equality
console.log(movements);
//includes()method
console.log(movements.includes(-130));
// some condition
// this returns a bullion if any variable that fullfil the conditions
console.log(movements.some(mov => mov === -130));
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

//every-condition
// this returns a bullion if every variable that fullfil the conditions
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//seperate callback
const deposit = mov => mov > 0;
console.log(movements.every(deposit)); //you call any of the function
console.log(movements.filter(deposit));

//flat and flatMap function
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());
//we can go dept more by intro dept using figures

//to calculate all the movements in the bank app
const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);
const overallBallance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overallBallance);

//using chaining method/flat
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

//flatMap
//this goes only one step deep
const overallBalance1 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance1);

// array fill and from
*/
