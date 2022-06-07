'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-05-27T17:01:17.194Z',
    '2022-06-01T23:36:17.929Z',
    '2022-06-05T10:51:36.790Z',
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

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions
const now = new Date();

const formatDate =function(date,locale){
  const calcDayPassed =(date1,date2)=>Math.round(Math.abs(date1-date2)/(1000 * 60 * 60 *24));

  const daysPassed =calcDayPassed(new Date(),date);
  console.log(daysPassed);

  if(daysPassed <1)return `Today`;
  if(daysPassed ===2)return  `Yesterday`;
  if(daysPassed <=7) return `${daysPassed} days ago`

    // const day =`${date.getDate()}`.padStart(2,0);
    // const month=`${date.getMonth()+1}`.padStart(2,0);
    // const year =date.getFullYear();

    const localDateFormate =Intl.DateTimeFormat(locale).format(date);

    return `${localDateFormate}`;
}

const currencyDisplayer=function(value,locale,currency){
  return Intl.NumberFormat(locale,
    {style:'currency',
    currency:currency}).format(value);
}

const displayMovements=function(acct,sort=false){
  containerMovements.innerHTML="";

  //sort will mutate the array so use slice to make a shallow copy!
  const mov =sort ? acct.movements.slice().sort((a,b)=>a-b):acct.movements;

  mov.forEach((m,i)=>{
    const type =m > 0 ? 'deposit':'withdrawal';
    const date= new Date(acct.movementsDates[i]);
    
    const displayDate =formatDate(date,acct.locale);
    const html =`
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${currencyDisplayer(m,acct.locale,acct.currency)}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin',html)
  });
};



//show account balance:
const displayBalance =function(acct){
//movements: [200, 450, -400, 3000, -650, -130, 70, 1300]
acct.balance=acct.movements.reduce((acc,mov)=> acc+mov,0);
labelBalance.textContent=`${currencyDisplayer(acct.balance,acct.locale,acct.currency)}`;
}


//create user name initial
const createUsername = function(accts){
  accts.forEach(acct=>{
    acct.username = acct.owner.toLowerCase().split(' ').map(name=>name[0]).join('');
  })
}

createUsername(accounts);

//show bank movements summary
const displaySummary =function(acct){
 const sumIn= acct.movements.filter(mov=>mov>0).reduce((acc,mov)=>acc+mov,0);
 labelSumIn.textContent=`${currencyDisplayer(sumIn,acct.locale,acct.currency)}`;

 const sumOut=acct.movements.filter(mov=>mov<0).reduce((acc,mov)=>acc+mov,0);
 labelSumOut.textContent=`${currencyDisplayer(sumOut,acct.locale,acct.currency)}`;

 const interest =acct.movements
 .filter(mov=>mov>0)
 .map(deposit=>deposit*acct.interestRate/100)
 .filter(int=>int>1)
 .reduce((acc,int)=>acc+int,0);
labelSumInterest.textContent=`${currencyDisplayer(interest,acct.locale,acct.currency)}`;
}

//function display account UI
const displayAccountUI =function(acct){
  displayMovements(acct);
  displayBalance(acct);
  displaySummary(acct);
}

let currentAccount;
currentAccount= accounts[0];
displayAccountUI(currentAccount);
containerApp.style.opacity=100;
//the login function

//show current time when logged in successfully

// const day =`${now.getDate()}`.padStart(2,0);
// const month=`${now.getMonth()+1}`.padStart(2,0);
// const year =now.getFullYear();
// const hour =`${now.getHours()}`.padStart(2,0);
// const min =`${now.getMinutes()}`.padStart(2,0);



btnLogin.addEventListener('click',e=>{
  e.preventDefault();
  currentAccount=accounts.find(acc=>acc.username===inputLoginUsername.value);

  if(currentAccount?.pin===(+inputLoginPin.value)){
    labelWelcome.textContent=`Welcome back, ${currentAccount.owner.split(' ')[0]}!`;
    containerApp.style.opacity =100;
    inputLoginUsername.value= inputLoginPin.value="";
    //the pin input will lose it's focus
    inputLoginPin.blur();
    displayAccountUI(currentAccount);
    
    labelDate.textContent=new Intl.DateTimeFormat(currentAccount.locale).format(now);
  }  
})

//transfer function
btnTransfer.addEventListener('click',e=>{
  e.preventDefault();
  const receiver = inputTransferTo.value;
  const amount=+(inputTransferAmount.value);
  
  const rAcct =accounts.find(acc=>acc.username===receiver);
  inputTransferAmount.value =inputTransferTo.value="";

  if(rAcct && receiver!==currentAccount.username && currentAccount.balance>=amount && amount >0){
    console.log('valid transfer')
    currentAccount.movements.push(-amount);
    rAcct.movements.push(amount);

    currentAccount.movementsDates.push(now.toISOString());
    rAcct.movementsDates.push(now.toISOString());

    displayAccountUI(currentAccount);

  }else {console.log("invalid")}
})
//request loan
btnLoan.addEventListener('click',e=>{
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if(amount>0 && currentAccount.movements.some(mov=>mov>=amount*0.1)){
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(now.toISOString());
    displayAccountUI(currentAccount);
  }
  else{
    alert("You can't borrow that much money!")
  }
  inputLoanAmount.value="";
})


//close account
btnClose.addEventListener('click',e=>{
  e.preventDefault();
 let inputUser =inputCloseUsername.value;
 let inputPin = +(inputClosePin.value);

 if(inputUser===currentAccount.username && inputPin===currentAccount.pin){
 const index= accounts.findIndex(acct=>acct.username === inputUser);
 accounts.splice(index,1);
 containerApp.style.opacity =0;
 }
 inputCloseUsername.value="";
 inputClosePin.value="";
})

//sort movements function

let isSorted = false;
btnSort.addEventListener('click',e=>{
  e.preventDefault();
  displayMovements(currentAccount,!isSorted);
  isSorted =!isSorted;
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
console.log(new Date()-new Date('2021 Dec 02'))