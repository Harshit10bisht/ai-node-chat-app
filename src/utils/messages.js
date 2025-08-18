const generateMessage = (username, text, emoji = '') => {
    return {
        username,
        text,
        emoji,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username, url, emoji = '') => {
    return {
        username,
        url,
        emoji,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}