const users: { id: string, username: string, password: string }[] = [
]

export function getUsers() {
    return users
}

export function createUser(algo: { username: string, password: string }) {
    const id = crypto.randomUUID()
    users.push({ id, ...algo })
}

export function verificarUser(algo: string) {
    if (users.length === 0) return false
    const [user] = users.filter(u => u.username === algo)
    return user // Filter nos va a devolver un usuario. Si filter encuentra un resultado, nos devuelve un objeto, de lo contrario nos devuelve undefined
}
