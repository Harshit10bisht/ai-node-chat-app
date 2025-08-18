// Join form functionality
const $joinForm = document.querySelector('#join-form')

$joinForm.addEventListener('submit', (e) => {
     e.preventDefault()

     const formData = new FormData($joinForm)
     const username = formData.get('username').trim()
     const room = formData.get('room').trim()

     if (!username || !room) {
          alert('Please enter both username and room name')
          return
     }

     // Navigate to chat page with query parameters
     const queryString = `?username=${encodeURIComponent(username)}&room=${encodeURIComponent(room)}`
     window.location.href = `./chat.html${queryString}`
})
