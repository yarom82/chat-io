$(function () {
        
    // test
    var socket = io()
    var users_count

    $('.chat').hide()
    $('.chat-info').hide()

    $.get('/get_users', function(response) {
        $('.chat-info').html("<div class='tags has-addons'><span class='tag'>Users</span><span class='tag is-info'>" + users_count + "</span></div>")
        users_count = response.length
    })

    $('#join-chat').click(function() {
        var username = $.trim($('#username').val())
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
                            var message_count = response.length
                            var html = ''
                            for (var x = 0; x < message_count; x++) {
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
        var username = $(this).data('username')
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
        var username = $(this).data('username')
        var message = $.trim($('#message').val())
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

    socket.on('send', function(data) {
        var username = data.username
        var message = data.message
        var html = "<div class='msg'><span class='user'><strong>" + username + ": </strong></span><span class='txt'>" + message + "</span></div>"
        $('.messages').append(html)
        $(".messages-body").scrollTop($(".messages-body")[0].scrollHeight)
    })

    socket.on('count_users', function(data) {
        if (data.action == 'increase') {
            users_count++
        } else {
            users_count--
        }
        $('.chat-info').html("<div class='tags has-addons'><span class='tag'>Users</span><span class='tag is-info'>" + users_count + "</span></div>")
    })
})