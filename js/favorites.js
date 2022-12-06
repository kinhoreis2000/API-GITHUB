export class GithubUser {
  static search (username) { // static é utilizado para usar um endereço de memória fixo, em todo o sistema. Em todos os objetos iniciados nesse método ele vai retornar exatamente o mesmo endereço de e=memória
    const endpoint = `https://api.github.com/users/${username}`

      return fetch(endpoint).then(data => data.json()).then((data) => {
        const {login, name, public_repos, followers} = data

        return {
          login : login,
          name : name,
          public_repos : public_repos,
          followers : followers,
        }
      }) // FETCH É BUSCAR ENDPOINT (Ou seja, buscar na url, na internet) e então você vai rodar uma função com parâmetro data e vai retornar toda a data em formato de json. No final das contas essa linha vai me retornar um objeto com os dados do usuário
  }
}
// Classe que vai conter a lógica dos dados 
export class Favorites {
    constructor(root) {
      this.root = document.querySelector(root)
      this.load()
      
    }

    load() {
      this.entries =  JSON.parse(localStorage.getItem('@github-favorites:')) || [] // Essa linha vai transformar o dado em um objeto, ou seja, vai pegar o que tá entre as aspas e transformar no que ele realmente é (pode ser array, objeto, funçao e etc)
   
       
    }

    save() {
      localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
      try{

        const userExists = this.entries.find(entry => entry.login === username)
        if(userExists) {throw new Error('usuário já cadastrado')} 

      const user = await GithubUser.search(username) 

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch(error) {
      alert(error.message)
    }
    }

    delete(user) {
      //higher order functions (map, filter, find, reduce)

      const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login) 

      this.entries = filteredEntries
      this.update()
      this.save()
    }
  }


//Classe que vai criar a visualização do HMTL


export class FavoritesView extends Favorites {
    
  constructor(root) {
    super(root)
    this.tbody = document.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const {value} = this.root.querySelector('.search input')
      this.add(value)
    }
  }

  update() {
      
        this.removeAllTr()

      

        this.entries
        .forEach(user => {const row = this.createRow()

        row.querySelector('.user img').src = `https://github.com/${user.login}.png`

        row.querySelector('.user img').alt = `Imagem de ${user.name}`
        row.querySelector('.User-name').textContent = user.name
        row.querySelector('.user a').href = `https://github.com/${user.login}`

        row.querySelector('.followers').textContent = user.followers
        row.querySelector('.repo').textContent = user.public_repos
        row.querySelector('.btn-remove').onclick = () => {
          const isOK= confirm('Tem certeza que quer deletar essa linha?')
          if(isOK) {
            this.delete(user)
          }
        }
        
        this.tbody.append(row)

      })
    
  }

  createRow() {
      const tr = document.createElement('tr')

      tr.innerHTML = `<td class="user">
          <img src="https://github.com/kinhoreis2000.png" alt="Imagem do henrique">
          <a href="https://github.com/kinhoreis2000" target="_blank">
          <p class="User-name" >Luiz Henrique Reis</p>
          </a>
        </td>
        <td class="repo">
          76
        </td>
        <td class="followers">
          120000
        </td>
        <td>
          <button class="btn-remove">remove</button>
        </td>`
      
      return tr
  }

  removeAllTr() {
      
      this.tbody.querySelectorAll('tr')
      .forEach(
        function (tr) {
          tr.remove()
        }
        )

  }

}