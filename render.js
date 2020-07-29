export function render(){   
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>SW</h1>
        <button id="navigate">navigate</button>
        <button id="install" hidden>Instalar</button>
        <div id="router-view"></div>
    `;
    document.getElementById('navigate').addEventListener('click', function(){
        import('./page.js').then((page)=> {
            document.getElementById('router-view').innerHTML = page.content;
        })
    })
}