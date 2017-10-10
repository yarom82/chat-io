import * as io from 'socket.io-client'

// 
// import * as React from 'react'
// import * as ReactDOM from 'react-dom'
// import SocialFieldLarge from '../components/social-field-large'
//

interface MessageData {
    username: string
    message: string
}

interface CountData {
    action: string
}

$(function () {

    let socket = io()
    let users_count : number

    $('.chat').hide()
    $('.chat-info').hide()

    $.get('/get_users', function(response) {
        $('.chat-info').html("<div class='tags has-addons'><span class='tag'>Users</span><span class='tag is-info'>" + users_count + "</span></div>")
        users_count = response.length
    })

    $('#join-chat').click(function() {
        const username = $.trim($('#username').val() as string)
        $.ajax({
            url: '/join',
            type: 'POST',
            data: {
                username: username
            },
            success: function(response) {
                if (response.status == 'OK') {
                    socket.emit('update_users_count', {
                        'action': 'increase'
                    })
                    $('.chat').show()
                    $('.chat-info').show()
                    $('#leave-chat').data('username', username)
                    $('#send-message').data('username', username)
                    $.get('/get_messages', function(response) {
                        if (response.length > 0) {
                            const message_count = response.length
                            let html = ''
                            for (let x = 0; x < message_count; x++) {
                                html += "<div class='msg'><span class='user'><strong>" + response[x]['sender'] + ": </strong></span><span class='txt'>" + response[x]['message'] + "</span></div>"
                            }
                            $('.messages').html(html)
                            $(".messages-body").scrollTop($(".messages-body")[0].scrollHeight)
                        }
                    })
                    $('.join-chat').hide()
                } else if (response.status == 'FAILED') {
                    alert("Sorry but the username already exists, please choose another one")
                    $('#username').val('').focus()
                }
            }
        })
    })

    $('#leave-chat').click(function() {
        const username = $(this).data('username')
        $.ajax({
            url: '/leave',
            type: 'POST',
            dataType: 'json',
            data: {
                username: username
            },
            success: function(response) {
                if (response.status == 'OK') {
                    socket.emit('message', {
                        'username': username,
                        'message': username + " has left the chat room.."
                    })
                    socket.emit('update_users_count', {
                        'action': 'decrease'
                    })
                    $('.chat').hide()
                    $('.chat-info').hide()
                    $('.join-chat').show()
                    $('#username').val('')
                    alert('You have successfully left the chat room')
                }
            }
        })
    })

    $('#send-message').click(function() {
        const username = $(this).data('username')
        const message = $.trim($('#message').val() as string)
        $.ajax({
            url: '/send_message',
            type: 'POST',
            dataType: 'json',
            data: {
                'username': username,
                'message': message
            },
            success: function(response) {
                if (response.status == 'OK') {
                    socket.emit('message', {
                        'username': username,
                        'message': message
                    })
                    $('#message').val('')
                }
            }
        })
    })

    socket.on('send', function(data : MessageData) {
        const username = data.username
        const message = data.message
        const html = "<div class='msg'><span class='user'><strong>" + username + ": </strong></span><span class='txt'>" + message + "</span></div>"
        $('.messages').append(html)
        $(".messages-body").scrollTop($(".messages-body")[0].scrollHeight)
    })

    socket.on('count_users', function(data : CountData) {
        if (data.action == 'increase') {
            users_count++
        } else {
            users_count--
        }
        $('.chat-info').html("<div class='tags has-addons'><span class='tag'>Users</span><span class='tag is-info'>" + users_count + "</span></div>")
    })

    // alert('b')
    // ReactDOM.render(<SocialFieldLarge />, document.getElementById("youtube-large"));
})