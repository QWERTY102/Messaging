var socket = io.connect('https://messaging-xspnkaxksz.now.sh');
var name;
var nameWindow = document.querySelector('.online');
var imgBtn = document.querySelector('.imgBtn');
var gifDiv = document.querySelector('.gifs');
var sendBtn = document.querySelector('.send');
var input = document.querySelector('.tinput');
var ginput = document.querySelector('.ginput');
var gBtn = document.querySelector('.gsend');
var chatWindow = document.querySelector('.chat-window');
var nameInput = document.querySelector('.name-input');
var okButton = document.querySelector('.ok');
var nameContainer = document.querySelector('.name-container');
var server = 'https://messaging-xspnkaxksz.now.sh';
var sent = Date.now();

nameInput.addEventListener('keyup', (e) => {
	if (e.keyCode == 13) {
		name = nameInput.value;
		socket.emit('name', {name:name});
		nameContainer.style.display = 'none';
	}
});


okButton.addEventListener('click', () => {
	name = nameInput.value;
	socket.emit('name', {name:name});
	nameContainer.style.display = 'none';
});

imgBtn.addEventListener('click', () => {
	gifDiv.style.display = gifDiv.style.display == 'none' ? 'block' : 'none';
	chatWindow.style.paddingBottom = gifDiv.style.display == 'none' ? '6em' : '26em';
	chatWindow.scrollTo(0,chatWindow.scrollHeight);
});

input.addEventListener('keyup', (e) => {
	if (e.keyCode == 13) {
		socket.emit('messages', {
			name:name,
			message: input.value
		});
		input.value = '';
	}
});

ginput.addEventListener('keyup', (e) => {
	if (e.keyCode == 13) {
		gBtn.click();
	}
	
})

gBtn.addEventListener('click', () => {

	fetch(`${server}/gsearch?term=${ginput.value}`, {
		method: 'GET'
	}).then(res => res.json())
		.then(json => processImgsSearch(json.gifs));
});

sendBtn.addEventListener('click', () => {
	socket.emit('messages', {
		name:name,
		message: input.value
	});
	input.value = '';
});


function processImgsSearch(data) {
	var imgs = document.querySelectorAll('.send-img');
	var iter = imgs.length;
	for (var i = 0; i < iter; i++) {
		document.getElementsByClassName('send-img')[0].parentElement.removeChild(document.getElementsByClassName('send-img')[0]);
	}
	console.log(data);
	data.forEach((gif) => {
		var img = document.createElement('img');
		img.className = 'send-img';
		img.src = server+'/gif?id='+gif;
		img.onclick = function () {
			send(this);
		};
		gifDiv.appendChild(img);
	});
}

function processMessage(data) {
	var message = document.createElement('span');
	if (data.socket != socket.id) {
		var messagerName = document.createElement('h3');
		messagerName.innerHTML = `<strong>${data.name}</strong>`;
		message.appendChild(messagerName);	
	}
	message.innerHTML += data.message;
	message.className = data.socket == socket.id ? 'chat-message self' : 'chat-message';
	chatWindow.appendChild(message);
	scrollDown();
	console.log(socket.id);
}

function processImgs(data) {
	var URL = data.img;
	var container = document.createElement('span');
	if (data.socket != socket.id) {
		var messagerName = document.createElement('h3');
		messagerName.className = 'imgname';
		messagerName.innerHTML = `<strong>${data.name}</strong>`;
		container.appendChild(messagerName);	
	}
	container.className = data.socket == socket.id ? 'chat-img selfimg' : 'chat-img';
	var img = document.createElement('img');
	img.src = URL;
	container.appendChild(img);
	chatWindow.appendChild(container);
	scrollDown();
}

function send(element) {
	var URL = element.src;
	console.log(URL);
	if (Date.now() - sent > 1800) {
		sent = Date.now();
		console.log(sent);
		socket.emit('img', {
			name:name,
			img: URL
		});
		scrollDown();
	}
}

function showNames(namesArray) {
	var len = nameWindow.querySelectorAll('h1').length;
	var elements = nameWindow.getElementsByTagName('h1');
	console.log(elements);
	for (var i = 0;i < len;i ++) {
		elements[0].parentNode.removeChild(elements[0]);
	}
	namesArray.forEach((name) => {
		var element = document.createElement('h1');
		element.innerHTML = name.name;
		nameWindow.appendChild(element);
	});
}

function scrollDown() {
	chatWindow.scrollTo(0,chatWindow.scrollHeight);
}

socket.on('messages', (data) => {
	processMessage(data);
});


socket.on('img', (data) => {
	processImgs(data);
});


socket.on('name', (data) => {
	showNames(data);
});

