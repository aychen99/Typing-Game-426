const $root = $("#root")

function hello() {
  console.log("hello")
}

function setupView() {
  $root.append(renderTypingSection())

  $("#typing-section > .container").append(renderTypingBox())
  $("#typing-section > .container").append(renderStopwatch())
}

function renderTypingSection() {
  let typingSection = `
  <section class="section" id="typing-section">
    <div class="container">
      <h3 class="title is-3 is-centered">WELCOME TO BLAZE TYPING 426</h3>
      <h5 class="subtitle is-5 is-centered" id="home-prompt">Type the following text:</h5>
    </div>
  </section>
  `

  return typingSection
}

function renderTypingBox() {
  let typingBox = `
  <div id="typing-box">
    <p id="typing-text">Gr8 b8, m8. I rel8, str8 appreci8, and congratul8. I r8 this b8 an 8/8. Plz no h8, I’m str8 ir8. Cre8 more, can’t w8. We should convers8, I won’t ber8, my number is 8888888, ask for N8. No calls l8 or out of st8. If on a d8, ask K8 to loc8. Even with a full pl8, I always have time to communic8 so don’t hesit8</p>
  `

  typingBox += '</div>'

  return typingBox
}

function renderStopwatch() {
  let stopwatch = `
  <p class="is-centered" id="stopwatch"><b>Time Elapsed: 1:46</b></p>
  `

  return stopwatch
}

function renderTypingStats() {
  
}

$(function() {
  console.log("everything has loaded")
  setupView()
})