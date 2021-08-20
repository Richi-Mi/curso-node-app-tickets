const path = require('path')
const fs   = require('fs')

class Ticket {
    constructor(numero, escritorio ){
        this.numero = numero,
        this.escritorio = escritorio
    }
}

class TicketControl {
    constructor() {
        this.ultimo = 0
        this.hoy    = new Date().getDate() // 11, 1, Dia que aparecera
        this.tickets = []
        this.ultimos4 = []

        this.init()

    }
    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }
    init() {
        const { tickets, hoy, ultimo, ultimos4 } = require('../db/data.json') // Nos devuelve el archivo JSON, en un objeto
        if ( hoy === this.hoy ) {
            // Es el mismo dia
            this.tickets = tickets
            this.ultimo = ultimo
            this.ultimos4 = ultimos4
        } else {
            // Es otro Dia
            this.guardarDB()
        }
    }
    guardarDB () {
        const dbPath = path.join( __dirname, '../db/data.json' )
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ) )
    }
    siguiente() {
        this.ultimo += 1
        const ticket = new Ticket( this.ultimo, null )
        this.tickets.push( ticket )

        this.guardarDB()
        return 'Ticket ' + ticket.numero
    }
    atenderTicket( escritorio ) {
        // Sino tenemos tickets
        if( this.tickets.length === 0 ) {
            return null
        }
        const ticket = this.tickets.shift() // this.tickets[0] - shift() .- Borra el primer elemento del array y lo retorna
        ticket.escritorio = escritorio

        this.ultimos4.unshift( ticket )
        if ( this.ultimos4.length > 4 ) {
            this.ultimos4.splice(-1, 1)
        } 
        this.guardarDB()

        return ticket
    }
}

module.exports = TicketControl