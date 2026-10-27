"use strict";

function clearElement(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
}

function addLine(boxId, text, className = "") {
    const box = document.getElementById(boxId);

    const line = document.createElement("p");
    line.textContent = text;
    if (className) line.className = className;
    box.append(line);
}

function showLines(boxId, lines, className = "") {
    clearElement(document.getElementById(boxId));

    for (const text of lines) {
        addLine(boxId, text, className);
    }
}

function toNumber(text) {
    return text.trim() === "" ? NaN : Number(text);
}

// Перевірка введення (при помилці prompt з'являється знову, «Скасувати» повертає null)

// Тільки літери, апостроф або дефіс, не менше 2 символів
function requestName(message) {
    const validName = /^[A-Za-zА-Яа-яІіЇїЄєҐґ'’-]{2,}$/;
    let text = prompt(message);

    while (text !== null && !validName.test(text.trim())) {
        text = prompt("Помилка! Тільки букви, апостроф чи дефіс, не менше 2 символів.\n" + message);
    }

    return text === null ? null : text.trim();
}

// Тільки літери та пробіли (одне або кілька слів), без цифр
function requestWords(message) {
    const validWords = /^[A-Za-zА-Яа-яІіЇїЄєҐґ'’\- ]{2,}$/;
    let text = prompt(message);

    while (text !== null && !validWords.test(text.trim())) {
        text = prompt("Помилка! Тільки букви та пробіли, без цифр, не менше 2 символів.\n" + message);
    }

    return text === null ? null : text.trim();
}

// Будь-який непорожній текст
function requestText(message) {
    let text = prompt(message);

    while (text !== null && text.trim() === "") {
        text = prompt("Помилка! Поле не може бути пустим.\n" + message);
    }

    return text === null ? null : text.trim();
}

// Ціле число в межах [min, max]
function requestInteger(message, min = -Infinity, max = Infinity) {
    let rangeText = "будь-яке";
    if (min !== -Infinity && max !== Infinity) rangeText = `від ${min} до ${max}`;
    else if (min !== -Infinity) rangeText = `не менше ${min}`;
    else if (max !== Infinity) rangeText = `не більше ${max}`;

    let text = prompt(message);

    while (text !== null) {
        const value = toNumber(text);
        if (Number.isInteger(value) && value >= min && value <= max) return value;
        text = prompt(`Помилка! Потрібне ціле число (${rangeText}).\n` + message);
    }

    return null;
}

// Будь-яке число, більше min (або не менше min, якщо allowMin = true)
function requestNumber(message, min = -Infinity, allowMin = true) {
    let rangeText = "";
    if (min !== -Infinity) rangeText = allowMin ? ` не менше ${min}` : ` більше ${min}`;

    let text = prompt(message);

    while (text !== null) {
        const value = toNumber(text);
        if (Number.isFinite(value) && (allowMin ? value >= min : value > min)) return value;
        text = prompt(`Помилка! Потрібне число${rangeText}.\n` + message);
    }

    return null;
}

// Відсоток 0–100; порожнє поле — значення за замовчуванням (undefined)
function requestPercent(message) {
    let text = prompt(message, "10");

    while (text !== null) {
        if (text.trim() === "") return undefined;

        const value = toNumber(text);
        if (Number.isFinite(value) && value >= 0 && value <= 100) return value;

        text = prompt("Помилка! Потрібне число від 0 до 100.\n" + message, "10");
    }

    return null;
}

// Один символ (не пробіл) або done
function requestSymbol(message) {
    let text = prompt(message);

    while (text !== null && text !== "done" && ([...text].length !== 1 || text.trim() === "")) {
        text = prompt("Помилка! Потрібен рівно один символ (не пробіл) або done.\n" + message);
    }

    return text;
}

// Завдання 1
function getFullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
}

function showGreeting(fullName, age) {
    const text = `Hello, ${fullName}! You are ${age} years old.`;
    console.log(text);
    showLines("box1", [text]);
}

function task1Run() {
    const firstName = requestName("Введіть ім'я:");
    if (firstName === null) return;

    const lastName = requestName("Введіть прізвище:");
    if (lastName === null) return;

    const age = requestInteger("Введіть вік:", 1, 120);
    if (age === null) return;

    const fullName = getFullName(firstName, lastName);
    showGreeting(fullName, age);
}

// Завдання 2
function getStudentInfo() {
    const name = requestName("Введіть ім'я студента:");
    if (name === null) return null;

    const score = requestInteger("Введіть бал (0–12):", 0, 12);
    if (score === null) return null;

    return { name: name, score: score };
}

function checkGrade(score) {
    if (score >= 10) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 4) return "Satisfactory";
    return "Fail";
}

function showStudentResult(name, grade) {
    console.log(`Student: ${name}, Grade: ${grade}`);
    showLines("box2", [`Student: ${name}`, `Grade: ${grade}`]);
}

function task2Run() {
    const student = getStudentInfo();
    if (student === null) return;

    const grade = checkGrade(student.score);
    showStudentResult(student.name, grade);
}

// Завдання 3
function calculateTip(amount, percent = 10) {
    return amount * percent / 100;
}

function showTipResult(amount, tip, percent) {
    const total = amount + tip;
    const lines = [
        `Bill: ${Number(amount.toFixed(2))} грн`,
        `Tip (${percent}%): ${Number(tip.toFixed(2))} грн`,
        `Total: ${Number(total.toFixed(2))} грн`
    ];
    console.log(lines.join(", "));
    showLines("box3", lines);
}

function task3Run() {
    const amount = requestNumber("Введіть суму рахунку (грн):", 0, false);
    if (amount === null) return;

    const percent = requestPercent("Введіть відсоток чайових (порожнє поле — 10%):");
    if (percent === null) return;

    const tip = calculateTip(amount, percent);
    showTipResult(amount, tip, percent === undefined ? 10 : percent);
}

// Завдання 4
function startGreetingTimer(message, seconds, callback) {
    setTimeout(() => {
        addLine("box4", message, "ok");
        console.log(message);
        setTimeout(callback, 50);
    }, seconds * 1000);
}

function task4Run() {
    const message = requestText("Введіть повідомлення:");
    if (message === null) return;

    const seconds = requestNumber("Через скільки секунд його показати?", 0, false);
    if (seconds === null) return;

    const button = document.getElementById("start4");
    button.disabled = true;
    showLines("box4", [`Очікуємо ${seconds} с...`], "note");

    startGreetingTimer(message, seconds, () => {
        alert("Time is up!");
        button.disabled = false;
    });
}

// Завдання 5
function calculate(a, b, operation) {
    switch (operation) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            if (b === 0) return "Division by zero";
            return a / b;
        default:
            return "Invalid operation";
    }
}

function showCalculationResult() {
    const a = requestNumber("Введіть перше число:");
    if (a === null) return;

    const b = requestNumber("Введіть друге число:");
    if (b === null) return;

    const operation = prompt("Введіть операцію (+, -, *, /):");
    if (operation === null) return;

    const result = calculate(a, b, operation.trim());
    const isError = result === "Invalid operation" || result === "Division by zero";

    alert(result);
    showLines("box5", [`${a} ${operation.trim()} ${b} = ${result}`], isError ? "error" : "");
}

// Завдання 6
function createClickCounter() {
    let count = 0;

    return function () {
        count++;
        console.log(`Count: ${count}`);
        return count;
    };
}

const clickCounter = createClickCounter();

function task6Click() {
    const count = clickCounter();
    addLine("box6", `Кількість натискань: ${count}`);
}

// Завдання 7
function* randomGenerator(min, max) {
    while (true) {
        yield Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

let numberGenerator = null;

function task7Setup() {
    const min = requestInteger("Введіть нижню межу (ціле число):");
    if (min === null) return;

    const max = requestInteger(`Введіть верхню межу (ціле число, не менше ${min}):`, min);
    if (max === null) return;

    numberGenerator = randomGenerator(min, max);
    document.getElementById("next").disabled = false;
    showLines("out", [`Межі: від ${min} до ${max}. Натискайте «Next number»`], "note");
}

function task7Next() {
    const number = numberGenerator.next().value;
    console.log(number);
    showLines("out", [`Випадкове число: ${number}`]);
}

// Завдання 8
function* passwordGenerator() {
    let password = "";

    while (true) {
        const symbol = yield;
        if (symbol === "done") return password;
        password += symbol;
    }
}

function task8Run() {
    const generator = passwordGenerator();
    generator.next();

    while (true) {
        const symbol = requestSymbol("Введіть символ (або done для завершення):");
        if (symbol === null) {
            showLines("box8", ["Створення пароля скасовано"], "note");
            return;
        }

        const step = generator.next(symbol);
        if (step.done) {
            if (step.value === "") {
                showLines("box8", ["Пароль порожній, спробуйте ще раз"], "error");
                return;
            }

            console.log(step.value);
            showLines("box8", [`Пароль: ${step.value}`]);
            return;
        }
    }
}

// Завдання 9
function* chatBot() {
    const name = yield "Hi! What is your name?";
    const mood = yield `Nice to meet you, ${name}! How are you?`;

    if (["bad", "погано"].includes(mood.trim().toLowerCase())) {
        yield "Sorry to hear that. Goodbye!";
    } else {
        yield "Goodbye!";
    }
}

function task9Run() {
    const bot = chatBot();
    const lines = [];
    let step = bot.next();

    // перший крок — ім'я (тільки літери), другий — самопочуття (літери та пробіли)
    const requests = [requestName, requestWords];

    for (let i = 0; i < 2; i++) {
        lines.push(`Бот: ${step.value}`);

        const answer = requests[i](step.value);
        if (answer === null) {
            showLines("box9", ["Розмову скасовано"], "note");
            return;
        }

        lines.push(`Ви: ${answer}`);
        step = bot.next(answer);
    }

    lines.push(`Бот: ${step.value}`);
    console.log(lines);
    showLines("box9", lines);
}

// Завдання 10
let user = {
    name: "",

    say() {
        const text = `Hello, ${this.name}`;
        console.log(text);
        alert(text);
    }
};

function task10Setup() {
    const name = requestName("Введіть ваше ім'я:");
    if (name === null) return;

    user.name = name;

    // без bind: this буде кнопкою, а не об'єктом user
    document.getElementById("helloBroken").addEventListener("click", user.say);
    // з bind: this завжди дорівнює user
    document.getElementById("hello").addEventListener("click", user.say.bind(user));

    document.getElementById("helloBroken").disabled = false;
    document.getElementById("hello").disabled = false;
    document.getElementById("setup10").disabled = true;

    showLines("box10", [
        "Без bind метод втрачає this: він стає кнопкою, тому ім'я порожнє.",
        "З bind(user) метод завжди бачить правильний this."
    ], "note");
}
