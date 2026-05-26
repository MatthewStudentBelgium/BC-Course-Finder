const chatEndpoint = "https://bc-course-finder.onrender.com/chat";
const firebaseConfig = {
  apiKey: "AIzaSyAmyIIEYxQwYt__AKr1CvJ7IPt8AIyHGRc",
  authDomain: "bc-course-finder-d7efc.firebaseapp.com",
  projectId: "bc-course-finder-d7efc",
  storageBucket: "bc-course-finder-d7efc.firebasestorage.app",
  messagingSenderId: "328278047106",
  appId: "1:328278047106:web:1c821ef9353def2152f79b",
  measurementId: "G-X3QJY1GG30"
};

function getFirebaseAuth() {
  if (!window.firebase || !firebase.apps) {
    return null;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  return firebase.auth();
}

function getKnowledgeBase() {
  return window.BC_KNOWLEDGE_BASE || {};
}

function formatReply(text) {
  return (text || "")
    .replace(/\*\*/g, "")
    .replace(/\n/g, "<br>")
    .replace(/- /g, "&bull; ");
}

function qualificationList() {
  const kb = getKnowledgeBase();
  return Object.values(kb.qualifications || {});
}

function buildLocalReply(message) {
  const lowerMessage = message.toLowerCase();
  const kb = getKnowledgeBase();
  const qualifications = qualificationList();

  if (!kb.institution) {
    return "Belgium Campus Guidance<br>&bull; I can help with Belgium Campus IT qualifications, subject choices and APS guidance.";
  }

  if (lowerMessage.includes("aps")) {
    return [
      "APS Guidance",
      "Use the APS checker in the student dashboard for a qualification estimate.",
      kb.apsGuidance.disclaimer,
      "General guide: Diploma route from about 19 APS, BIT degree route from about 23 APS, BComp route from about 26 APS. Subject and NSC endorsement rules still apply."
    ].join("<br>&bull; ");
  }

  const matchedQualification = qualifications.find((qualification) => {
    const name = qualification.name.toLowerCase();
    const shortName = (qualification.shortName || "").toLowerCase();
    return lowerMessage.includes(name) || lowerMessage.includes(shortName.toLowerCase());
  });

  if (matchedQualification) {
    return [
      matchedQualification.name,
      `NQF Level ${matchedQualification.nqfLevel}`,
      `Duration: ${matchedQualification.duration}`,
      `Admission: ${matchedQualification.admission.join("; ")}`,
      `Career paths: ${matchedQualification.careers.join(", ")}`
    ].join("<br>&bull; ");
  }

  if (lowerMessage.includes("bridging") || lowerMessage.includes("math")) {
    const bridging = kb.subjectGuidance.mathsVsMathLit.bridgingCourse;
    return [
      "Mathematics Guidance",
      ...kb.subjectGuidance.mathsVsMathLit.maths,
      ...kb.subjectGuidance.mathsVsMathLit.mathLit,
      ...bridging.requirements
    ].join("<br>&bull; ");
  }

  return [
    "Belgium Campus IT Study Options",
    `${kb.institution.name} offers local guidance in this app for Diploma in IT, Bachelor of Information Technology and Bachelor of Computing.`,
    `Campuses listed locally: ${kb.institution.campuses.map((campus) => campus.name).join(", ")}.`,
    `Intakes listed locally: ${kb.institution.intakes.join(", ")}.`,
    "Ask about a qualification, Mathematics requirements, APS, careers or bridging options."
  ].join("<br>&bull; ");
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");

  if (!input || !chatbox) return;

  const message = input.value.trim();

  if (message === "") return;

  chatbox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
  input.value = "";
  chatbox.scrollTop = chatbox.scrollHeight;

  chatbox.innerHTML += `<p id="typing"><strong>BC CourseFinder&trade;:</strong> Thinking...</p>`;
  chatbox.scrollTop = chatbox.scrollHeight;

  try {
    const response = await fetch(chatEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();
    const typingMessage = document.getElementById("typing");

    if (typingMessage) {
      typingMessage.remove();
    }

    if (!response.ok) {
      chatbox.innerHTML += `<p><strong>BC CourseFinder&trade;:</strong> ${data.reply || "Something went wrong."}</p>`;
      chatbox.scrollTop = chatbox.scrollHeight;
      return;
    }

    chatbox.innerHTML += `<p><strong>BC CourseFinder&trade;:</strong> ${formatReply(data.reply)}</p>`;
    chatbox.scrollTop = chatbox.scrollHeight;
  } catch (error) {
    const typingMessage = document.getElementById("typing");

    if (typingMessage) {
      typingMessage.remove();
    }

    chatbox.innerHTML += `<p><strong>BC CourseFinder&trade;:</strong> ${buildLocalReply(message)}</p>`;
    chatbox.scrollTop = chatbox.scrollHeight;
    console.error(error);
  }
}

function askQuickQuestion(question) {
  const input = document.getElementById("userInput");

  if (!input) return;

  input.value = question;
  sendMessage();
}

function openQR() {
  const qrModal = document.getElementById("qrModal");

  if (qrModal) {
    qrModal.style.display = "flex";
  }
}

function closeQR() {
  const qrModal = document.getElementById("qrModal");

  if (qrModal) {
    qrModal.style.display = "none";
  }
}

function apsPoints(mark) {
  const numericMark = Number(mark);

  if (Number.isNaN(numericMark)) return 0;
  if (numericMark >= 80) return 7;
  if (numericMark >= 70) return 6;
  if (numericMark >= 60) return 5;
  if (numericMark >= 50) return 4;
  if (numericMark >= 40) return 3;
  if (numericMark >= 30) return 2;
  return 1;
}

function calculateAps() {
  const form = document.getElementById("apsForm");
  const result = document.getElementById("apsResult");

  if (!form || !result) return;

  const marks = Array.from(form.querySelectorAll("[data-aps-mark]")).map((input) => Number(input.value));
  const english = Number(document.getElementById("englishMark").value);
  const maths = Number(document.getElementById("mathsMark").value);
  const mathsType = document.getElementById("mathsType").value;
  const apsTotal = marks.reduce((total, mark) => total + apsPoints(mark), 0);
  const hasDegreeSubjectAccess = english >= 50 && mathsType === "pure" && maths >= 50;
  const hasDiplomaSubjectAccess = english >= 40;
  const qualifications = qualificationList();
  const eligible = [];
  const almost = [];

  qualifications.forEach((qualification) => {
    const needsBachelor = qualification.endorsementRequired === "Bachelor";
    const apsPasses = apsTotal >= qualification.apsGuide;
    const subjectPasses = needsBachelor ? hasDegreeSubjectAccess : hasDiplomaSubjectAccess;

    if (apsPasses && subjectPasses) {
      eligible.push(qualification.name);
    } else if (apsTotal >= qualification.apsGuide - 2 || subjectPasses) {
      almost.push(qualification.name);
    }
  });

  const bridgingMessage =
    mathsType === "pure" && maths < 50
      ? "Your pure Mathematics mark is below 50%, so ask Belgium Campus about the Mathematics Bridging Course."
      : mathsType === "literacy"
        ? "Mathematical Literacy may limit degree entry. Ask Belgium Campus about diploma routes and bridging options."
        : "Your Mathematics entry mark supports degree consideration, subject to final admission checks.";

  result.innerHTML = `
    <h3>Your APS estimate: ${apsTotal}</h3>
    <p>${getKnowledgeBase().apsGuidance.disclaimer}</p>
    <p><strong>Likely options:</strong> ${eligible.length ? eligible.join(", ") : "No direct match from the local guide yet."}</p>
    <p><strong>Close options to discuss:</strong> ${almost.length ? almost.join(", ") : "None based on the marks entered."}</p>
    <p>${bridgingMessage}</p>
  `;
}

function renderCampusInformation() {
  const holder = document.getElementById("campusInfo");
  const kb = getKnowledgeBase();

  if (!holder || !kb.institution) return;

  holder.innerHTML = `
    <div class="info-grid">
      ${qualificationList()
        .map(
          (qualification) => `
            <article class="info-card">
              <h3>${qualification.name}</h3>
              <p>NQF ${qualification.nqfLevel} &middot; ${qualification.duration} &middot; ${qualification.credits} credits</p>
              <p><strong>Admission:</strong> ${qualification.admission.join("; ")}</p>
              <p><strong>Careers:</strong> ${qualification.careers.slice(0, 4).join(", ")}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function populateLoggedInStudent() {
  const studentEmail = document.getElementById("studentEmail");

  if (!studentEmail) return;

  studentEmail.textContent = localStorage.getItem("bcStudentEmail") || "Logged-in student";
}

function initAccountMenu() {
  const email = localStorage.getItem("bcStudentEmail");
  const accountMenus = document.querySelectorAll("[data-account-menu]");
  const accountEmails = document.querySelectorAll("[data-account-email]");
  const authLinks = document.querySelectorAll("[data-auth-link]");
  const logoutButtons = document.querySelectorAll("[data-logout-button]");

  accountEmails.forEach((accountEmail) => {
    accountEmail.textContent = email || "Guest";
  });

  authLinks.forEach((authLink) => {
    authLink.textContent = email ? "Student Hub" : "Login";
    authLink.href = email ? "studentDashboard.html" : "studentLogin.html";
  });

  accountMenus.forEach((accountMenu) => {
    const toggle = accountMenu.querySelector("[data-account-toggle]");

    if (!toggle) return;

    toggle.textContent = email ? `Logged in as ${email}` : "Account";
    accountMenu.classList.toggle("is-guest", !email);

    toggle.addEventListener("click", function () {
      accountMenu.classList.toggle("is-open");
    });
  });

  logoutButtons.forEach((logoutButton) => {
    logoutButton.addEventListener("click", function () {
      const auth = getFirebaseAuth();

      localStorage.removeItem("bcStudentEmail");
      localStorage.removeItem("bcStudentName");

      if (auth) {
        auth.signOut().finally(() => {
          window.location.href = "coursefinder.html";
        });
        return;
      }

      window.location.href = "coursefinder.html";
    });
  });

  document.addEventListener("click", function (event) {
    accountMenus.forEach((accountMenu) => {
      if (!accountMenu.contains(event.target)) {
        accountMenu.classList.remove("is-open");
      }
    });
  });
}

function createSalt() {
  const values = new Uint8Array(16);

  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(values);
  } else {
    values.forEach((value, index) => {
      values[index] = Math.floor(Math.random() * 256);
    });
  }

  return Array.from(values, (value) => value.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password, salt) {
  const value = `${salt}:${password}`;

  if (window.crypto && window.crypto.subtle) {
    const encodedValue = new TextEncoder().encode(value);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", encodedValue);
    return Array.from(new Uint8Array(hashBuffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return String(hash);
}

function setActiveStudent(account) {
  localStorage.setItem("bcStudentEmail", account.email);
  localStorage.setItem("bcStudentName", account.fullName || account.email);
}

function initLoginForm() {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");
    const accounts = getLocalAccounts();
    const localAccount = accounts.find((account) => account.email === email);
    const auth = getFirebaseAuth();

    if (!password) {
      message.innerText = "Please enter your password.";
      return;
    }

    if (auth) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const matchingLocalAccount = accounts.find((account) => account.email === email);
          setActiveStudent({
            email,
            fullName: matchingLocalAccount ? matchingLocalAccount.fullName : email,
            uid: userCredential.user.uid
          });
          message.innerText = "Login successful. Redirecting...";
          window.location.href = "studentDashboard.html";
        })
        .catch((error) => {
          message.innerText = `Login failed: ${error.message}`;
        });
      return;
    }

    if (localAccount && localAccount.passwordHash && localAccount.passwordSalt) {
      const enteredHash = await hashPassword(password, localAccount.passwordSalt);

      if (enteredHash === localAccount.passwordHash) {
        setActiveStudent(localAccount);
        message.innerText = "Login successful. Redirecting...";
        window.location.href = "studentDashboard.html";
        return;
      }

      message.innerText = "Incorrect password. Please try again.";
      return;
    }

    message.innerText = localAccount
      ? "This account was created before password saving was enabled. Please create the account again."
      : "No local account found. Please create an account first.";
  });
}

function getLocalAccounts() {
  try {
    return JSON.parse(localStorage.getItem("bcStudentAccounts") || "[]");
  } catch (error) {
    return [];
  }
}

function saveLocalAccounts(accounts) {
  localStorage.setItem("bcStudentAccounts", JSON.stringify(accounts));
}

function initCreateAccountForm() {
  const createAccountForm = document.getElementById("createAccountForm");

  if (!createAccountForm) return;

  createAccountForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("newEmail").value.trim().toLowerCase();
    const password = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("createAccountMessage");
    const auth = getFirebaseAuth();

    if (password !== confirmPassword) {
      message.textContent = "Passwords do not match.";
      return;
    }

    if (password.length < 6) {
      message.textContent = "Password must be at least 6 characters.";
      return;
    }

    const accounts = getLocalAccounts();
    const existingAccount = accounts.find((account) => account.email === email);

    if (existingAccount) {
      message.textContent = "An account with this email already exists. Please login.";
      return;
    }

    let firebaseUser = null;

    if (auth) {
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        firebaseUser = userCredential.user;

        if (firebaseUser.updateProfile) {
          await firebaseUser.updateProfile({ displayName: fullName });
        }
      } catch (error) {
        message.textContent = `Account creation failed: ${error.message}`;
        return;
      }
    }

    const passwordSalt = auth ? null : createSalt();
    const passwordHash = auth ? null : await hashPassword(password, passwordSalt);
    const account = {
      fullName,
      email,
      uid: firebaseUser ? firebaseUser.uid : null,
      provider: auth ? "firebase" : "local",
      passwordSalt,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    accounts.push(account);

    saveLocalAccounts(accounts);
    setActiveStudent(account);
    message.textContent = "Account created. Redirecting...";
    window.location.href = "studentDashboard.html";
  });
}

function initPage() {
  const userInput = document.getElementById("userInput");
  const apsForm = document.getElementById("apsForm");

  if (userInput) {
    userInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
  }

  if (apsForm) {
    apsForm.addEventListener("submit", function (event) {
      event.preventDefault();
      calculateAps();
    });
  }

  initLoginForm();
  initCreateAccountForm();
  initAccountMenu();
  renderCampusInformation();
  populateLoggedInStudent();
}

document.addEventListener("DOMContentLoaded", initPage);
