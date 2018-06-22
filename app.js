const auth = firebase.auth()
const firebaseDb = firebase.database()

let user;



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

// get all users
function getAllUsers() {
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
            btn.setAttribute("class", 'btn btn-info')
            btn.addEventListener("click", (uid) => {
                console.log(v.uid)
                
                firebaseDb.ref("users/" + v.uid + "/" + "chatRoom" + '/' + currentuser + '/').push("Hello")
                    .then(() => {
                        firebaseDb.ref("users/" + currentuser + "/" + "chatRoom" + '/' +v.uid + '/').push('Hello')
                        swal({
                            title: "success!",
                            text: "User Added in your Chat list",
                            icon: "success",
                        });
                        setTimeout(() => {
                            location = 'room.html'
                        }, 2000)
                    })
            })

            li.setAttribute("class", 'list-group-item')
            li.appendChild(liText)
            li.appendChild(btn)
            ul.appendChild(li)

        })
    })

}
// get all users


// getChatRoomUsers
function getChatRoomUsers() {
    var userUid = auth.currentUser.uid;
    console.log(userUid)
    // firebaseDb.ref("users" + currentuser + '/' + 'chatRoom' + '/')
    //     .once("value", (chat) => {
    //         let roomData = chat.val();

    //         console.log()
    //     })  
}