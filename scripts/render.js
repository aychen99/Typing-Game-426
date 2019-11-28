const $root = $("#root")

function hello() {
  console.log("hello")
}

function setupInitView() {
  $root.append("<h1>TYPING GAME 426</h1>")
  $root.append('<p id="instructions"><b>Type the following text:</b></p>')

  renderTypingBox()
}

function renderTypingBox() {
  let typingBox = `
  <div id="typing-box">
    <p>Gr8 b8, m8. I rel8, str8 appreci8, and congratul8. I r8 this b8 an 8/8. Plz no h8, I’m str8 ir8. Cre8 more, can’t w8. We should convers8, I won’t ber8, my number is 8888888, ask for N8. No calls l8 or out of st8. If on a d8, ask K8 to loc8. Even with a full pl8, I always have time to communic8 so don’t hesit8</p>
  `

  typingBox += '</div>'

  $root.append(typingBox)
}

$(function() {
  console.log("everything has loaded")
  setupInitView()
})