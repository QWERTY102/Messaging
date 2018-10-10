socket = io.connect("https://messaging-smimciwnjn.now.sh/");

var message = document.getElementById("message")
var btn = document.getElementById("send")
var senderName = document.getElementById("handle")
var messages = document.getElementById("output")

btn.addEventListener("click", function() {
    socket.emit("chat", {
        name:senderName.value,
        message:message.value
    })
    message.value = "";
})

messages.onkeypressed = function(e) {
if (e.keyCode == 13) {
        btn.click();
    }
}

socket.on("chat",function(data) {
    messages.innerHTML+="<p><strong>"+data.name+": </strong>"+data.message+"</p>"
})
