// Initialize Pusher client with dynamic configuration
let pusher = null

// Function to initialize Pusher with credentials from server
async function initializePusher() {
    try {
        // Get Pusher credentials from server
        const response = await fetch('/api/pusher-config')
        const config = await response.json()

        if (config.error) {
            console.error('Failed to get Pusher config:', config.error)
            return false
        }

        // Initialize Pusher with server-provided credentials
        pusher = new Pusher(config.key, {
            cluster: config.cluster
        })

        return true
    } catch (error) {
        console.error('Error initializing Pusher:', error)
        return false
    }
}

// User state
let currentUser = null
let currentRoom = null

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $emojiButton = document.querySelector('#emoji-button')

// Templates
const messageTemplates = document.querySelector('#message-template').innerHTML
const locationMessageTemplates = document.querySelector('#location-message-template').innerHTML
const sidebarTemplates = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// Emoji array for user assignment
const userEmojis = ['😊', '😎', '🤖', '👻', '🦄', '🐱', '🐶', '🦊', '🐼', '🐨', '🐯', '🦁', '🐸', '🐙', '🦋', '🦅', '🦉', '🦒', '🦘', '🦔']

// Function to get random emoji for user
function getRandomEmoji() {
    return userEmojis[Math.floor(Math.random() * userEmojis.length)]
}

// Function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

// Function to show emoji picker
function showEmojiPicker() {
    const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '💯', '✨', '🌟', '💪', '👏', '🙌', '🤝', '💖', '😍', '🥰', '😘', '🤗', '🤔', '😅']

    // Create emoji picker
    const picker = document.createElement('div')
    picker.style.cssText = `
        position: absolute;
        bottom: 80px;
        right: 24px;
        background: rgba(16, 6, 26, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(139, 92, 246, 0.2);
        border-radius: 12px;
        padding: 12px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `

    emojis.forEach(emoji => {
        const button = document.createElement('button')
        button.textContent = emoji
        button.style.cssText = `
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.2s ease;
        `
        button.onmouseover = () => {
            button.style.background = 'rgba(139, 92, 246, 0.2)'
        }
        button.onmouseout = () => {
            button.style.background = 'none'
        }
        button.onclick = () => {
            $messageFormInput.value += emoji
            $messageFormInput.focus()
            document.body.removeChild(picker)
        }
        picker.appendChild(button)
    })

    document.body.appendChild(picker)

    // Close picker when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closePicker(e) {
            if (!picker.contains(e.target) && e.target !== $emojiButton) {
                document.body.removeChild(picker)
                document.removeEventListener('click', closePicker)
            }
        })
    }, 100)
}

const autoScroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible Height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have i scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

// Join room function
async function joinRoom(username, room) {
    try {
        // Initialize Pusher first
        const pusherInitialized = await initializePusher()
        if (!pusherInitialized) {
            alert('Failed to initialize real-time connection')
            return
        }

        const response = await fetch('/api/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, room })
        })

        const data = await response.json()

        if (data.error) {
            alert(data.error)
            location.href = './'
            return
        }

        currentUser = data.user
        currentRoom = room

        // Subscribe to room channel
        const channel = pusher.subscribe(`room-${room}`)

        // Listen for messages
        channel.bind('message', (message) => {
            console.log(message)
            const html = Mustache.render(messageTemplates, {
                username: message.username,
                message: message.text,
                emoji: message.emoji || '👤',
                createdAt: moment(message.createdAt).format('h:mm A')
            })
            $messages.insertAdjacentHTML('beforeend', html)
            autoScroll()
        })

        // Listen for location messages
        channel.bind('location-message', (message) => {
            console.log(message)
            const html = Mustache.render(locationMessageTemplates, {
                username: message.username,
                url: message.url,
                emoji: message.emoji || '👤',
                createdAt: moment(message.createdAt).format('h:mm A')
            })
            $messages.insertAdjacentHTML('beforeend', html)
            autoScroll()
        })

        // Listen for room data updates
        channel.bind('room-data', (data) => {
            // Update room title
            const roomTitle = document.querySelector('.room-title')
            if (roomTitle) {
                roomTitle.textContent = data.room
            }

            // Update users list
            const usersList = document.querySelector('#users')
            if (usersList) {
                let usersHtml = ''
                data.users.forEach(user => {
                    usersHtml += `<li>${user.emoji} ${user.username}</li>`
                })
                usersList.innerHTML = usersHtml
            }
        })

        // Listen for user joined events
        channel.bind('user-joined', (data) => {
            const html = Mustache.render(messageTemplates, {
                username: data.message.username,
                message: data.message.text,
                emoji: data.message.emoji || '👋',
                createdAt: moment(data.message.createdAt).format('h:mm A')
            })
            $messages.insertAdjacentHTML('beforeend', html)
            autoScroll()
        })

        // Listen for user left events
        channel.bind('user-left', (data) => {
            const html = Mustache.render(messageTemplates, {
                username: data.message.username,
                message: data.message.text,
                emoji: data.message.emoji || '👋',
                createdAt: moment(data.message.createdAt).format('h:mm A')
            })
            $messages.insertAdjacentHTML('beforeend', html)
            autoScroll()
        })

    } catch (error) {
        console.error('Error joining room:', error)
        alert('Error joining room')
        location.href = './'
    }
}

// Send message function
async function sendMessage(message) {
    if (!currentUser) return

    try {
        const response = await fetch('/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: currentUser.id, message })
        })

        const data = await response.json()

        if (data.error) {
            console.log(data.error)
            return false
        }

        return true
    } catch (error) {
        console.error('Error sending message:', error)
        return false
    }
}

// Send location function
async function sendLocation(coords) {
    if (!currentUser) return

    try {
        const response = await fetch('/api/location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: currentUser.id, coords })
        })

        const data = await response.json()

        if (data.error) {
            console.log(data.error)
            return false
        }

        return true
    } catch (error) {
        console.error('Error sending location:', error)
        return false
    }
}

// Leave room function
async function leaveRoom() {
    if (!currentUser) return

    try {
        await fetch('/api/leave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: currentUser.id })
        })

        // Unsubscribe from channel
        if (currentRoom && pusher) {
            pusher.unsubscribe(`room-${currentRoom}`)
        }
    } catch (error) {
        console.error('Error leaving room:', error)
    }
}

// Event listeners
$messageForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    const success = await sendMessage(message)

    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if (success) {
        console.log('Message Delivered!')
    }
})

$sendLocationButton.addEventListener('click', async () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition(async (position) => {
        const success = await sendLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })

        $sendLocationButton.removeAttribute('disabled')

        if (success) {
            console.log('Location shared!')
        }
    })
})

// Emoji button event listener
$emojiButton.addEventListener('click', (e) => {
    e.preventDefault()
    showEmojiPicker()
})

// Handle page unload
window.addEventListener('beforeunload', () => {
    leaveRoom()
})

// Initialize with capitalized username and uppercase room
joinRoom(capitalizeFirstLetter(username), room.toUpperCase())