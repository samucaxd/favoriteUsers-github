import { githubUser } from "./githubUser.js"

// Criar classe para estruturação de dados
export class favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  async add(username) { // Função assíncrona, aguarda um tempo pra rodar | função para adicionar nova linha
    try { // Tente esse código

      const userExists = this.entries
        .find(entry => entry.login === username) // Verifica se o usuário já está na entries.
      if(userExists) {
        throw new Error('Usuário já cadastrado!') // Caso username já exista, aparecer mensagem de erro
      }

      const user = await githubUser.search(username) // await => esperar o código inteiro pra depois rodar essa linha
      if(user.login === undefined) { // Verifica se o usuário não existe no Github
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries] // Adicionar o novo usuário e mantém os demais na tabela
      this.update()
      this.save()

    } catch(error) { // Se usuário não existir, mostrar mensagem de erro
      alert(error.message)
    }
  }

  load() { // Função para carregar os dados de cada linha
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [] // Transformar string em dado | Criando array vazia para o entries.

  }

  save() { // Salvar a página no localStorage
    localStorage.setItem ("@github-favorites:", JSON.stringify(this.entries)) // Salva a página pra quando atualizar, não perder os dados
  }

  delete(user) { // Função para deletar o usuário da tabela
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login) // Se a lógica "filter" retornar falso, o usuário será removido da tabela.
      
      this.entries = filteredEntries
      this.update()
      this.save()
  }

}

// Criar classe para visualização e eventos do HTML
export class favoritesView extends favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody') // Pega o elemento tbody do HTML
    this.update()
    this.onadd()
  }

  onadd() { // Função para resgatar o valor do input ao clicar no botão
    const buttonSearch = this.root.querySelector(".search button")
    buttonSearch.onclick = () => {
      const { value } = this.root.querySelector(".search input") // Desestruturação de código
      
      this.add(value)
    }
  }

  update() { // Função para atualizar os dados da tabela
    this.removeAllTr()

    this.entries.forEach(user => { // Para cada usuário, alterar os dados
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href =  `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').innerText = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      
      row.querySelector('.remove').onclick = () => { // Evento do botaão de remover o usuário da tabela
        const isOk = confirm("Tem certeza que deseja remover esse usuário?") // Pop-up de confirmação 
        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row) // Criar linha com os novos dados 
    })
    
  }

  removeAllTr() { // Remover todas as linhas da tabela
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })
  }

  createRow() { // Criar a tag TR e inserir o HTML dentro dela.
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