import { githubUser } from "./githubUser.js"

export class favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  async add(username) { 
    try {
      const userExists = this.entries
        .find(entry => entry.login === username) 
      if(userExists) {
        throw new Error('Usuário já cadastrado!') 
      }

      const user = await githubUser.search(username)
      if(user.login === undefined) { 
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) { 
      alert(error.message)
    }
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  save() { 
    localStorage.setItem ("@github-favorites:", JSON.stringify(this.entries))
  }

  delete(user) { 
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)
      this.entries = filteredEntries
      this.update()
      this.save()
  }
}


export class favoritesView extends favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody') 
    this.update()
    this.onadd()
  }

  onadd() {
    const buttonSearch = this.root.querySelector(".search button")
    buttonSearch.onclick = () => {
      const { value } = this.root.querySelector(".search input") 
      this.add(value)
    }
  }

  update() { 
    this.removeAllTr()
    this.entries.forEach(user => {
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href =  `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').innerText = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.remove').onclick = () => { 
        const isOk = confirm("Tem certeza que deseja remover esse usuário?")
        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })
  }

  createRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td class="user">
      <img src="https://github.com/samuuuk.png" alt="Foto do dollynho">
      <a href="https://github.com/samuuuk" target="_blank">
        <p>Samuel Santos</p>
        <span>/samuuuk</span>
      </a>
      </td>
      <td class="repositories">47</td>
      <td class="followers">9342</td>
      <td class="action">
        <button class="remove">Remover</button>
      </td>
    `
    return tr
  }
}