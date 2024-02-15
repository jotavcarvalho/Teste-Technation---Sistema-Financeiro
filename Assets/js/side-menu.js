
const itemMenu = document.querySelectorAll('.iten-menu');

function sideMenu(){
    itemMenu.forEach((item) =>{
        item.classList.remove('active');
    });

    this.classList.add('active');
}

itemMenu.forEach((item)=>{
    item.addEventListener('click' , sideMenu);
});



// adicionar funcionalidade de expandir menu ao clicar

const btnOpen = document.querySelector('#btn-icon-menu')
const menu = document.querySelector('.menu-lateral')

btnOpen.addEventListener('click', function(){
    menu.classList.toggle('expand')
})