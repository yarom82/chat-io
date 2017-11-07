import * as io from 'socket.io-client'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { UsersInfo } from './components/UsersInfo'
import { UserInfo } from './components/UserInfo'
import { Messages } from './components/Messages'
import { Message } from './components/Message'
import { PrivateMessage } from './components/PrivateMessage'

interface MessageData {
  username: string
  message: string
}

interface CountData {
  action: string
}

interface PrivateData {
  to: string
  from: string
  message: string
}

$(function () {

  let socket = io()
  let users_count: number

  $('.chat').hide()
  $('.chat-info').hide()

  $.get('/get_users', function (response) {

    ReactDOM.render(
      <UsersInfo count={users_count} />,
      $('.users-info')[0]
    )

    users_count = response.length
  })

  $('#join-chat').click(function () {
    const username = $.trim($('#username').val() as string)
    $.ajax({
      url: '/join',
      type: 'POST',
      data: {
        username: username
      },
      success: function (response) {
        if (response.status == 'OK') {
          socket.emit('update_users_count', {
            'action': 'increase',
            'username': username
          })

          ReactDOM.render(
            <UserInfo username={username} />,
            $('.user-info')[0]
          )

          $('.chat').show()
          $('.chat-info').show()
          $('#leave-chat').data('username', username)
          $('#send-message').data('username', username)
          $.get('/get_messages', function (response) {
            if (response.length > 0) {
              ReactDOM.render(
                <Messages messages={response} username={username} createPrivateMessageFunc={createPrivateMessage} />,
                $('.messages')[0]
              )
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

  $('#leave-chat').click(function () {
    const username = $('.my-username').text()
    $.ajax({
      url: '/leave',
      type: 'POST',
      dataType: 'json',
      data: {
        username: username
      },
      success: function (response) {
        if (response.status == 'OK') {
          socket.emit('message', {
            'username': username,
            'message': username + " has left the chat room.."
          })
          socket.emit('update_users_count', {
            'action': 'decrease'
          })
          // TODO: change to React Router
          $('.chat').hide()
          $('.chat-info').hide()
          $('.join-chat').show()
          $('#username').val('')
          alert('You have successfully left the chat room')
        }
      }
    })
  })

  $('#send-message').click(function () {
    const username = $('.my-username').text()
    const message = $.trim($('#message').val() as string)
    $.ajax({
      url: '/send_message',
      type: 'POST',
      dataType: 'json',
      data: {
        'username': username,
        'message': message
      },
      success: function (response) {
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

  socket.on('send', function (data: MessageData) {
    const username = $('.my-username').text()
    const senderUsername = data.username
    const message = data.message

    ReactDOM.render(
      <Message username={username} senderUsername={senderUsername}
        message={message} createPrivateMessageFunc={createPrivateMessage} />,
      $('.messages')[0]
    )

    $(".messages-body").scrollTop($(".messages-body")[0].scrollHeight)
  })

  socket.on('count_users', function (data: CountData) {
    if (data.action == 'increase') {
      users_count++
    } else {
      users_count--
    }

    ReactDOM.render(
      <UsersInfo count={users_count} />,
      $('.users-info')[0]
    )
  })

  socket.on('send_private_message', function (data: PrivateData) {
    const from = data.to
    const to = data.from
    const message = data.message

    if ($('#pm-' + to).length == 0) {
      createPrivateMessage(to, from)
    }
    const $pmTextarea = $('#pm-' + to)
    $pmTextarea.val($pmTextarea.val() + to + ': ' + message + '\n')
    $pmTextarea.scrollTop($pmTextarea[0].scrollHeight)
  })

  const createPrivateMessage = function (to: string, from: string) {
    if ($('#pm-' + to).length > 0) {
      $('#pm-input-' + to).focus()
      return
    }
    
    ReactDOM.render(
      <PrivateMessage username={from} to={to} sendPrivateMessageFunc={sendPrivateMessage} />,
      $('#private-messages')[0]
    )
    
    $('#pm-input-' + to).focus()
  }

  const sendPrivateMessage = function (to: string, from: string, message: string) {
    socket.emit('private', {
      "to": to,
      'from': from,
      'message': message
    })
    const $pm = $('#pm-' + to)
    $pm.val($pm.val() + from + ': ' + message + '\n')
  }
})
