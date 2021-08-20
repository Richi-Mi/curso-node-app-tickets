// new URLSearchParams(url) .- Lee los parametros del URL
// searchParams.has(param) .- Nos dice si el parametro existe o no

// Referencias HTML
const lblEscritorio = document.querySelector('h1')
const lblTicket     = document.querySelector('small')
const btnAtender    = document.querySelector('button')
const divAlerta     = document.querySelector('.alert')
// Tickets Pendientes
const lblPendientes = document.getElementById('lblPendientes')

const searchParams = new URLSearchParams( window.location.search )

if( !searchParams.has('escritorio') ) {
    window.location = 'index.html'
    throw new Error(`el escritorio es obligatorio`)
}
const escritorio = searchParams.get('escritorio') // Devuelve la propiedad de los paramtros que le mandemos
lblEscritorio.innerText = escritorio

divAlerta.style.display = 'none'

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false
});

socket.on('disconnect', () => {
    btnAtender.disabled = true
});

socket.on('ultimo-ticket', (ultimoTicket) => {
    // lblNuevoTicket.innerHTML = 'Ticket' + ultimoTicket
})

socket.on('tickets-pendientes', (num) => {
    if ( num === 0 ) {
        lblPendientes.style.display = 'none'
    }
    else {
        lblPendientes.textContent = num
        lblPendientes.style.display = 'block'
    }
})

btnAtender.addEventListener( 'click', () => {
    socket.emit('atender-ticket', { escritorio }, ( { ok, ticket, msg } ) => {
        if( !ok ) {
            lblTicket.innerText = `Nadie`
            return  divAlerta.style.display = 'block' 
        }
        lblTicket.innerText = `Ticket ${ticket.numero}`

    })
    // socket.emit( 'siguiente-ticket', null, ( ticket ) => {
    //     lblNuevoTicket.innerHTML = ticket
    // });
});