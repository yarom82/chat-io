import * as io from 'socket.io-client'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

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
    $('.chat-info').html("<div class='tags has-addons'><span class='tag'>Users</span><span class='tag is-info'>" + users_count + "</span></div>")
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
          $('.chat').show()
          $('.chat-info').show()
          $('#leave-chat').data('username', username)
          $('#send-message').data('username', username)
          $.get('/get_messages', function (response) {
            if (response.length > 0) {
              const message_count = response.length
              let html : NodeListOf<Element>
              for (let x = 0; x < message_count; x++) {
                const senderUsername = response[x]['sender']
                const message = response[x]['message']

                const divElement = document.createElement('div');
                const spanUser = document.createElement('span')
                spanUser.className = "user"
                spanUser.addEventListener('click', function(){
                  createPrivateMessage(senderUsername, username);
                });
                const strongUser = document.createElement('strong')
                strongUser.style.color = stringToColour(senderUsername)
                strongUser.textContent = senderUsername + ":"
                const spanMessage = document.createElement('span')
                spanMessage.className = "txt"
                spanMessage.textContent = message
                
                spanUser.appendChild(strongUser)
                divElement.appendChild(spanUser)
                divElement.appendChild(spanMessage)

                $('.messages').append(divElement)
              }
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
    const username = $(this).data('username')
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
    const username = $(this).data('username')
    const senderUsername = data.username
    const message = data.message

    // TODO: change to React component
    const divElement = document.createElement('div');
    const spanUser = document.createElement('span')
    spanUser.className = "user"
    spanUser.addEventListener('click', function(){
      createPrivateMessage(senderUsername, username);
    });
    const strongUser = document.createElement('strong')
    strongUser.style.color = stringToColour(senderUsername)
    strongUser.textContent = senderUsername + ":"
    const spanMessage = document.createElement('span')
    spanMessage.className = "txt"
    spanMessage.textContent = message
    
    spanUser.appendChild(strongUser)
    divElement.appendChild(spanUser)
    divElement.appendChild(spanMessage)

    $('.messages').append(divElement)
    $(".messages-body").scrollTop($(".messages-body")[0].scrollHeight)
  })

  socket.on('count_users', function (data: CountData) {
    if (data.action == 'increase') {
      users_count++
    } else {
      users_count--
    }
    // TODO: change to React component
    $('.chat-info').html("<div class='tags has-addons'><span class='tag'>Users</span><span class='tag is-info'>" + users_count + "</span></div>")
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
    // TODO: Create React components
    if ($('#pm-' + to).length > 0) {
      $('#pm-input-' + to).focus()
      return
    }
    const $privateMessages = $('#private-messages')
    const privateMessageArticle = document.createElement('article')
    const header = document.createElement('div')
    header.className = 'message-header'
    header.style.backgroundColor = stringToColour(to)
    const headerText = document.createElement('p')
    headerText.innerText = to
    const closePrivateMessage = document.createElement('button')
    closePrivateMessage.className = 'delete'
    closePrivateMessage.setAttribute('aria-label', 'delete')
    closePrivateMessage.addEventListener('click', function() {
      $(this).parents('article').first().remove()
    })
    header.appendChild(headerText)
    header.appendChild(closePrivateMessage)
    const body = document.createElement('div');
    body.className = 'message-body'
    const pmBody = document.createElement('div')
    const messages = document.createElement('textarea')
    messages.className = 'textarea is-small'
    messages.setAttribute('id', 'pm-' + to)
    messages.setAttribute('rows', '4')
    messages.setAttribute('cols', '45')
    messages.disabled = true
    const text = document.createElement('input')
    text.className = 'input is-small'
    text.setAttribute('type', 'text')
    text.setAttribute('id', 'pm-input-' + to)
    const button = document.createElement('input')
    button.value = 'Send'
    button.className = 'button is-small'
    button.setAttribute('type', 'button')
    button.addEventListener('click', function() {
      sendPrivateMessage(to, from, $('#pm-input-' + to).val().toString());
      //const privateMessageTextarea = $(this).parents('textarea.textarea')
      $(messages).scrollTop($(messages)[0].scrollHeight)
      text.value = ''
    })
    pmBody.appendChild(messages)
    pmBody.appendChild(text)
    pmBody.appendChild(button)
    body.appendChild(pmBody)

    privateMessageArticle.appendChild(header)
    privateMessageArticle.appendChild(body)
    
    $privateMessages.append(privateMessageArticle)
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

const stringToColour = function (str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}