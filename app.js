// Initialize Firebase
var config = {
    apiKey: "AIzaSyDiLhM-eNlinVjxUqZ5u_kiIowI105EcDQ",
    authDomain: "chattychatpk.firebaseapp.com",
    databaseURL: "https://chattychatpk.firebaseio.com",
    projectId: "chattychatpk",
    storageBucket: "",
    messagingSenderId: "90533697446"
};
firebase.initializeApp(config);

/* =================================================================================== */

const auth = firebase.auth()
const firebaseDb = firebase.database()
let user;

/* =================================================================================== */

// signup function
function signUp() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var pass = document.getElementById('pwd').value;

    console.log(email, name, pass)

    if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
        swal({
            title: "Warning!",
            text: "Please enter you email address. example@gmail.com",
            icon: "warning",
        });
    }
    if (name === '' || name === " ") {
        swal({
            title: "Warning!",
            text: "Please enter you name.",
            icon: "warning",
        });
    }
    else if (pass.length < 6) {
        swal({
            title: "Warning!",
            text: "Please enter atleast 6 number",
            icon: "warning",
        });
    } else {
        auth.createUserWithEmailAndPassword(email, pass)
            .then((data) => {
                var uid = data.user.uid;
                var objData = {
                    email: email,
                    name: name
                }
                firebaseDb.ref("users/" + uid + '/').set(objData)
                    .then(() => {
                        swal({
                            title: "Success!",
                            text: "congratulations",
                            icon: "success",
                        });
                        location = 'login.html'
                    })
            })
            .catch((error) => {
                // Handle Errors here.
                swal({
                    title: "Warning!",
                    text: error.message,
                    icon: "warning",
                });
                // ...
            });
    }

}
// signup function

/* =================================================================================== */

// login function
function logIn() {
    var email = document.getElementById('userEmail').value;
    var password = document.getElementById('userPwd').value;

    console.log(email)
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById('error').style.display = 'none'
            console.log("success")
            location = 'users.html'
        })
        .catch((error) => {
            // Handle Errors here.
            document.getElementById('error').innerText = error.message
            // ...
        });
}
// login function

/* =================================================================================== */

// get all users
function getAllUsers() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            let usersArray = []
            firebaseDb.ref("users/").once("value", (users) => {
                let usersList = users.val()
                // console.log(usersList, "usersList")
                var currentuser = auth.currentUser.uid;
                console.log(currentuser)
                user = currentuser
                for (var key in usersList) {
                    // console.log(usersList[key])
                    if (currentuser !== key) {
                        usersList[key].uid = key
                        usersArray.push(usersList[key])
                    }

                }
                console.log(usersArray, 'usersArray')
                var ul = document.getElementById("usersList");
                usersArray.map((v, i) => {

                    var li = document.createElement('li');
                    var liText = document.createTextNode(v.name)
                    var btn = document.createElement('button')
                    var btnText = document.createTextNode("Add")
                    btn.appendChild(btnText)
                    btn.setAttribute("class", 'btn btn-info text-right')
                    btn.addEventListener("click", (e) => {
                        console.log(v.uid)

                        firebaseDb.ref("users/" + currentuser + "/" + "chatRoom" + '/' + v.uid + '/').push('Wa-Alaikum-Assalam')
                            .then(() => {
                                firebaseDb.ref("users/" + v.uid + "/" + "chatRoom" + '/' + currentuser + '/').push("Assalam-o-Alaikum")
                                swal({
                                    title: "success!",
                                    text: "User Added in your Chat list",
                                    icon: "success",
                                });
                                setTimeout(() => {
                                    location = 'friends.html'
                                }, 2000)
                            })
                    })

                    li.setAttribute("class", 'list-group-item')
                    li.appendChild(liText)
                    li.appendChild(btn)
                    ul.appendChild(li)

                })
            })
        } else {
            console.log('user is not signed in');
        }
    })
}
// get all users

/* =================================================================================== */
var frndUID;
// get friends list
function getFriendsList() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log(user.uid, '[current user]')
            let usersArray = []
            let currentUser = user.uid
            firebaseDb.ref("users/" + currentUser + '/' + 'chatRoom' + '/')
                .once("value", (chat) => {
                    let roomData = chat.val();
                    console.log(roomData, 'friendlist')

                    firebaseDb.ref("users/").once("value", (friends) => {
                        friendList = friends.val();
                        for (var key in roomData) {
                            console.log(key, 'friend\'s uid');
                            console.log(roomData[key], 'message');
                            if (currentUser !== key) {
                                friendList[key].uid = key
                                console.log(friendList[key].uid, "test")
                                usersArray.push(friendList[key])
                            }
                        }
                        console.log(usersArray, 'db');

                        var ul = document.getElementById("friendslist");
                        usersArray.map((v, i) => {

                            var li = document.createElement('li');
                            var liText = document.createTextNode(v.name)
                            var btn = document.createElement('button')
                            var btnText = document.createTextNode("Chat")
                            btn.appendChild(btnText)
                            btn.setAttribute("class", 'btn btn-success text-right')
                            btn.addEventListener("click", (uid) => {
                                frndUID = v.uid;
                                console.log(frndUID, 'selected friend\'s uid')
                                localStorage.setItem('friendUID', frndUID);
                                window.location = 'room.html'
                                // setTimeout(() => {
                                // }, 2000);
                            })

                            li.setAttribute("class", 'list-group-item')
                            li.appendChild(liText)
                            li.appendChild(btn)
                            ul.appendChild(li)
                        })
                    });

                });
        } else {
            console.log('user is not signed in')

        }
    });
}
// get friends list

/* =================================================================================== */

// lets chat
var currentName;
function getConversation() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var firendsUID = localStorage.getItem("friendUID");
            console.log(firendsUID, "[friends uid]")
            let usersArray = []
            firebaseDb.ref("users/").once("value", (users) => {
                let usersList = users.val()
                // console.log(usersList, "usersList")
                var currentuser = auth.currentUser.uid;
                console.log(currentuser)
                user = currentuser
                for (var key in usersList) {
                    // console.log(usersList[key])
                    // if (currentuser !== key) {
                    usersList[key].uid = key
                    usersArray.push(usersList[key])
                    // }

                }
                console.log(usersArray, 'usersArray')
                var ul = document.getElementById("chatRoom");
                usersArray.map((v, i) => {
                    if (currentuser === v.uid) {
                        currentName = v.name;
                    }
                    if (firendsUID == v.uid) {
                        $("#friendName").html(`You are chatting with ${v.name}`)

                        // console.log(v.uid)
                        firebaseDb.ref("users/" + v.uid + "/" + "chatRoom" + '/' + currentuser + '/').on('child_added', (CUmessages) => { // current user msgs
                            console.log(CUmessages, 'cu msgs')
                            localStorage.setItem('CUmsg', JSON.stringify(CUmessages.val()));
                            var userdata = localStorage.getItem('CUmsg');
                            userdata = JSON.parse(userdata);
                            var createdLi = crateElement(`${userdata}   (${currentName})`, 'LI', 'list-group-item')
                            console.log('abcd', createdLi);
                            ul.appendChild(createdLi);
                            console.log(userdata, 'cu data')
                        })
                        firebaseDb.ref("users/" + currentuser + "/" + "chatRoom" + '/' + v.uid + '/').on('child_added', (FUmessages) => {  // friend (user) msgs
                            console.log(FUmessages, 'fu msgs')
                            localStorage.setItem('FUmsg', JSON.stringify(FUmessages.val()));
                            var userdata = localStorage.getItem('FUmsg');
                            userdata = JSON.parse(userdata);
                            var createdLi = crateElement(`${userdata}   (${v.name})`, 'LI', 'list-group-item')
                            console.log('abcd', createdLi);
                            ul.appendChild(createdLi);
                            console.log(userdata, 'fu data')

                        })
                        function crateElement(text, element, className) {
                            var li = document.createElement(element);
                            var textNode = document.createTextNode(text);
                            li.appendChild(textNode);
                            li.setAttribute('class', className);
                            return li;
                        }
                    }
                })

            })
            // console.log(frndUID, '[friend uid]')
            // console.log(user.uid, '[current user]')
            // let usersArray = []
            // let currentUser = user.uid
            // firebaseDb.ref("users/" + currentUser + '/' + 'chatRoom' + '/' + fuid)
            //     .once("value", (chat) => {
            //         let chatData = chat.val();
            //         console.log(chatData, 'chat')

            //         firebaseDb.ref("users/").on("value", (friend) => {
            //             friendList = friend.val();
            //             for (var key in chatData) {
            //                 console.log(key, 'friend\'s uid');
            //                 console.log(chatData[key], 'message');
            //                 if (currentUser !== key) {
            //                     friendList[key].uid = key
            //                     usersArray.push(chatData[key])
            //                 }
            //             }
            //             console.log(usersArray, 'db');

            //             var ul = document.getElementById("chatRoom");
            //             usersArray.map((v, i) => {

            //                 var li = document.createElement('li');
            //                 var liText = document.createTextNode(v.name)
            //                 var btn = document.createElement('button')
            //                 var btnText = document.createTextNode("Chat")
            //                 btn.appendChild(btnText)
            //                 btn.setAttribute("class", 'btn btn-success text-right')
            //                 btn.addEventListener("click", (uid) => {
            //                     console.log(v.uid);
            //                     window.location = 'room.html'
            //                 })

            //                 li.setAttribute("class", 'list-group-item')
            //                 li.appendChild(liText)
            //                 li.appendChild(btn)
            //                 ul.appendChild(li)
            //             })
            //         });

            //     });

        } else {
            console.log('user is not signed in')

        }
    });
}