window.onload = () => {
  const myInput = document.getElementById("dummyKeyboard");
  myInput.onpaste = (e) => e.preventDefault();
};
const COMMANDS = {
  help: 'Supported commands: <span class="code">about</span>, <span class="code">experience</span>, <span class="code">education</span>, <span class="code">skills</span>, <span class="code">acknowledges</span>, <span class="code">contact</span>, <span class="code">resume</span>',
  about:
    "Hello 👋<br>I'm Haridev P.<br> A 18 years cybersecurity learner currently living in India.",
  skills:
    '<span class="code">Skill:</span> Ethical Hacking, Pen-Testing, coding,..<br>',
  education:
    "Amrita vishwa vidhyapeetham coimbatore -Btech cse ,First year ",
  resume: "<a href='./resume.pdf' class='success link'>resume.pdf</a>",
  experience: "No Experience😥",
  acknowledges:
    "<a href='https://g.dev/haridevp' class='success link' > Google developer <a>, <a href='https://developers.google.com/profile/badges/community/gdsc/2023/member' class='success link' > 23-24 GDSC member <a>,<a href='https://www.cloudskillsboost.google/public_profiles/f46d3136-3f2c-452a-bf06-914d0f5854af/badges/5435237' class='success link' > Build and Secure Networks in Google Cloud <a>,<a href='https://www.cloudskillsboost.google/public_profiles/f46d3136-3f2c-452a-bf06-914d0f5854af/badges/5434168' class='success link' >  Infrastructure Tasks in Google Cloud <a>,<a href='https://www.cloudskillsboost.google/public_profiles/f46d3136-3f2c-452a-bf06-914d0f5854af/badges/5433844' class='success link'> Create and Manage Cloud Resources </a>,<a href='https://www.cloudskillsboost.google/public_profiles/f46d3136-3f2c-452a-bf06-914d0f5854af/badges/5435731' class='success link' > Perform Foundational Data, ML, and AI Tasks in Google Cloud <a> ",
  contact:
    "You can contact me on any of following links:<br><a href='https://t.me/Haridevp' class='success link'>Telegram</a>, <a href='https://www.instagram.com/_.haridev__/' class='success link'>Instagram</a>, <a href='https://www.twitter.com/Haridev__P/' class='success link'>Twitter</a>",
};

const userInput = document.getElementById("userInput");
const terminalOutput = document.getElementById("terminalOutput");
const inputfield = document.getElementById("dummyKeyboard");

inputfield.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    let input = e.target.value;
    input = input.toLowerCase();
    if (input.length === 0) {
      return;
    }
    let output;
    output = `<div class="terminal-line"><span class="success">➜</span> <span class="directory">~</span> ${input}</div>`;
    if (!COMMANDS.hasOwnProperty(input)) {
      output += `<div class="terminal-line">no such command: ${input}</div>`;
      console.log("Oops! no such command");
    } else {
      output += COMMANDS[input];
    }
    terminalOutput.innerHTML = `${terminalOutput.innerHTML}<div class="terminal-line">${output}</div>`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    e.target.value = "";
  }
});
