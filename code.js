//ОБЕРКТА
function debounce (callback, delay = 400){
    let timer ;
    return function (...args){
    
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(this , args)
        }, delay);
    }
    
}

//генерация элементов 
class View {
    constructor(){
          
        this.app = document.getElementById('app');
        this.wrap = document.getElementById('wrap');

        this.searchLine = this.createElement('div', 'searchLine');
        this.searchInput = this.createElement('input', 'searchInput');

        this.searchLine.append(this.searchInput);

        this.itemWrapper = this.createElement('div', 'itemWrapper');
        this.itemList = this.createElement('ul', 'itemList');

        this.main = this.createElement('div', 'main');
        this.main.append(this.itemWrapper);

        this.itemWrapper.append(this.itemList);

        this.app.append(this.searchLine);
        this.app.append(this.main);
    }

    //метод создания элементов
    createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag);
        if(elementClass){element.classList.add(elementClass)} 
        return element}

    //Вывод поисковика
    createItem(itemData){
        const itemElement = this.createElement('li' , 'itemEl')
        itemElement.insertAdjacentHTML('beforeend',`<span class = "user">${itemData.name}</span>`)
        this.itemList.append(itemElement)
            
    //работа с элементом 
        itemElement.addEventListener('click', ()=>{
                const itElement = this.createElement('div', 'itEl')
                itElement.insertAdjacentHTML('beforeend',`<div class = "wrapName"><span class = 'nameEl'>Name: ${itemData.name}</span>
                                            <span class = 'nameEl'>Owner: ${itemData.owner.login}</span>
                                            <span class = 'nameEl'>Stars: ${itemData.stargazers_count}</span></div>
                                            <button type="button" class="delete-btn"></button >`)
                                
                this.wrap.append(itElement);
                this.searchInput.value = '';
                this.itemList.innerHTML = '';
                            

            const btn = itElement.querySelector('.delete-btn');
            btn.addEventListener('click' , () => {
            console.log('hi')
            itElement.remove()})
                            
        })
    }    
}


// запрос тут, перебор массива
class Search {
    constructor (view){
    this.view = view;
    this.debouncedSearch = debounce(this.searchRep.bind(this)); 
    this.view.searchInput.addEventListener("keyup", this.debouncedSearch) 
    }

    async searchRep(){
        try {
        this.view.itemList.innerHTML = '';
        let res = await fetch (`https://api.github.com/search/repositories?q=${this.view.searchInput.value}&per_page=5`)
   
    if(res.ok)
        {let data =await res.json()
        data.items.forEach(val => {  this.view.createItem(val)});

    } else {console.error('Error', res.status)}
    } catch (error) {console.error("Fetch error:", error);}
    }}

new Search(new View());

