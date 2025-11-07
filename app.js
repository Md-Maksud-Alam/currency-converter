
const baseUrl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdownSel = document.querySelectorAll(".dropdown select");
const btn = document.getElementById("convertBtn");
const resetBtn = document.getElementById("resetBtn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapIcon = document.getElementById("swap");
const amountInput = document.getElementById("amount");
const spinner = document.getElementById("spinner");

// Populate dropdowns
for (let select of dropdownSel) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") newOption.selected = "selected";
    else if (select.name === "to" && currCode === "INR") newOption.selected = "selected";

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => updateFlag(evt.target));
}

// Update flag image
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Fetch and update rate with loading animation
const updateExchangeRate = async () => {
  let amtVal = amountInput.value;
  if (amtVal === "" || amtVal < 0) {
    amtVal = 0;
    amountInput.value = "0";
  }

  // Show spinner & hide message
  spinner.style.display = "block";
  msg.classList.remove("show");
  msg.textContent = "Fetching latest rates...";

  const url = `${baseUrl}/${fromCurr.value.toLowerCase()}.json`;

  try {
    let response = await fetch(url);
    let data = await response.json();
    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    let result = amtVal * rate;

    // Simulate small delay for smooth animation
    setTimeout(() => {
      spinner.style.display = "none";
      msg.textContent = `${amtVal} ${fromCurr.value} = ${result.toFixed(2)} ${toCurr.value}`;
      msg.classList.add("show");
    }, 800);
  } catch (error) {
    spinner.style.display = "none";
    msg.textContent = "Error fetching exchange rate!";
    msg.classList.add("show");
  }
};

// Convert button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Swap currencies
swapIcon.addEventListener("click", () => {
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

// Reset button
resetBtn.addEventListener("click", async () => {
  amountInput.value = "0";
  fromCurr.value = "USD";
  toCurr.value = "INR";
  updateFlag(fromCurr);
  updateFlag(toCurr);

  spinner.style.display = "block";
  msg.classList.remove("show");

  const url = `${baseUrl}/usd.json`;
  let response = await fetch(url);
  let data = await response.json();
  let rate = data.usd["inr"];
  let result = 0 * rate;

  setTimeout(() => {
    spinner.style.display = "none";
    msg.textContent = `0 USD = ${result.toFixed(2)} INR`;
    msg.classList.add("show");
  }, 800);
});

// Auto update on page load
window.addEventListener("load", () => updateExchangeRate());


