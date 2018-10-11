socket = io.connect("https://messaging-lblzvbchns.now.sh/");

var message = document.getElementById("message")
var btn = document.getElementById("send")
var senderName = document.getElementById("handle")
var messages = document.getElementById("output")
var key = document.getElementById("key")

message.addEventListener("keypress",function(evnt) {
    if (evnt.keyCode == 13) {
        btn.click()
    }
})

btn.addEventListener("click", function() {
    if (senderName.value.toLowerCase().includes("moorad")) {
        messages.innerHTML+="<p><strong class='error'>You Don't Have Admin Access to use the name Moorad</strong></p>"
    }
    else if (message.value != "" && senderName.value != "") {
    socket.emit("chat", {
        name:senderName.value,
        message:message.value
    })
    message.value = ""
} else {
    messages.innerHTML+='<p><strong class="error">Your Name/Message Input Field is empty</strong></p>'
} 
})

socket.on("chat",function(data) {
    if (data.admin) {
        messages.innerHTML+="<p><strong style='color:#ff751a'>"+data.name+": </strong>"+data.message+"</p>"
    } else {
    messages.innerHTML+="<p><strong>"+data.name+": </strong>"+data.message+"</p>"
    }
    document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight
    
})


socket.on("online", function(connections) {
    document.getElementById('online').innerText = "Online: "+connections
})

key.addEventListener("click",function() {
    password = prompt("Admin Access Code: ")
    if (password != null) {
    socket.emit("password",password)
    }   
})
