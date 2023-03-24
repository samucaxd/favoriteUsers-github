// Criar classe para API do Github
export class githubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
    .then(data => data.json()) // garante que os dados virão em formato .json
    .then(({ login, name, public_repos, followers}) => ({ // desestruturação do json
      login,
      name,
      public_repos,
      followers
    })) // Adicionando os valores nos campos da entries.
  }
}