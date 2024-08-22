document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    let currentLevel = 1;

    // Funzione per generare una combinazione casuale
    function generaCombinazioneRandomica(livello) {
        const tipiLocaliLivello1 = [
            "pizzeria per famiglie",
            "trattoria",
            "Bar con cucina",
            "Ristorante Informale"
        ];
        const tipiLocaliLivello2 = [
            "pizzeria gourmet",
            "pizzeria per famiglie",
            "Ristorante di lusso",
            "trattoria",
            "Cocktail bar",
            "Bar con cucina",
            "Ristorante Informale"
        ];
        const dimensioniPiccole = [100, 250, 400];
        const dimensioniGrandi = [600, 1000];
        const zone = [
            "Località marittima",
            "Città d'arte",
            "Zona industriale",
            "Piccola città"
        ];

        let tipoLocale;
        let dimensione;
        if (livello === 1) {
            tipoLocale = tipiLocaliLivello1[Math.floor(Math.random() * tipiLocaliLivello1.length)];
            dimensione = dimensioniPiccole[Math.floor(Math.random() * dimensioniPiccole.length)];
        } else if (livello === 2) {
            tipoLocale = tipiLocaliLivello2[Math.floor(Math.random() * tipiLocaliLivello2.length)];
            const dimensioniDisponibili = [600, 1000];
            dimensione = dimensioniDisponibili[Math.floor(Math.random() * dimensioniDisponibili.length)];
        }
        const zona = zone[Math.floor(Math.random() * zone.length)];
        return { tipoLocale, dimensione, zona };
    }

    // Funzione per calcolare il personale ottimale
    function calcolaPersonale(dimensione, tipoLocale) {
        const multipliers = {
            "pizzeria gourmet": 1.8,
            "pizzeria per famiglie": 1.2,
            "Ristorante di lusso": 2.0,
            "trattoria": 0.9,
            "Cocktail bar": 0.8,
            "Bar con cucina": 0.7,
            "Ristorante Informale": 1.0
        };
        const multiplier = multipliers[tipoLocale] || 1;
        return 2 + (dimensione / 80) * multiplier;
    }

    // Funzione per calcolare il ricarico ottimale
    function calcolaRicarico(tipoLocale) {
        const multipliers = {
            "pizzeria gourmet": 1.8,
            "pizzeria per famiglie": 1.2,
            "Ristorante di lusso": 2.0,
            "trattoria": 0.9,
            "Cocktail bar": 0.8,
            "Bar con cucina": 0.7,
            "Ristorante Informale": 1.0
        };
        const multiplier = multipliers[tipoLocale] || 1;
        return 3 * multiplier;
    }

    // Funzione per calcolare i giorni di apertura ottimali
    function calcolaGiorniApertura(zona) {
        const stagionalita = {
            "Località marittima": 0.4,
            "Città d'arte": 0.8,
            "Zona industriale": 1.0,
            "Piccola città": 1.0
        };
        const stagionalitaValue = stagionalita[zona] || 1;
        return 330 * stagionalitaValue;
    }

    // Funzione per calcolare i coperti giornalieri medi necessari
    function calcolaCopertiNecessari(dimensione, tipoLocale) {
        const multipliersCoperti = {
            "pizzeria gourmet": 0.9,
            "pizzeria per famiglie": 1.0,
            "Ristorante di lusso": 0.8,
            "trattoria": 1.0,
            "Cocktail bar": 1.2,
            "Bar con cucina": 1.3,
            "Ristorante Informale": 1.0
        };
        const baseCoperti = (dimensione / 3) * (9 / (Math.log(dimensione) ** 1.8));
        const multiplier = multipliersCoperti[tipoLocale] || 1;
        return baseCoperti * multiplier;
    }

    // Funzione per calcolare il punteggio
    function calcolaPunteggio(personaleUtente, ricaricoUtente, giorniUtente, tipoLocale, dimensione, zona) {
        const personaleOttimale = calcolaPersonale(dimensione, tipoLocale);
        const ricaricoOttimale = calcolaRicarico(tipoLocale);
        const giorniOttimali = calcolaGiorniApertura(zona);
        
        const diffPersonale = Math.abs(personaleUtente - personaleOttimale);
        const diffRicarico = Math.abs(ricaricoUtente - ricaricoOttimale);
        const diffGiorni = Math.abs(giorniUtente - giorniOttimali);
        
        const maxPersonale = 2 + (1000 / 80) * 2.0; // Dimensione massima e moltiplicatore massimo
        const maxRicarico = 3 * 2.0; // Ricarico massimo
        const maxGiorni = 330; // Giorni massimi
        
        const punteggioPersonale = 1 - (diffPersonale / maxPersonale);
        const punteggioRicarico = 1 - (diffRicarico / maxRicarico);
        const punteggioGiorni = 1 - (diffGiorni / maxGiorni);
        
        return (punteggioPersonale + punteggioRicarico + punteggioGiorni) / 3;
    }

    // Funzione per mostrare il livello
    function mostraLivello(livello) {
        const { tipoLocale, dimensione, zona } = generaCombinazioneRandomica(livello);
        let formHtml = `
            <h2>Livello ${livello}</h2>
            <p>Tipo di Locale: ${tipoLocale}</p>
            <p>Dimensione: ${dimensione} m²</p>
            <p>Zona: ${zona}</p>
            <div class="form-group">
                <label for="personale">Numero di Dipendenti:</label>
                <input type="number" id="personale" />
            </div>
            <div class="form-group">
                <label for="ricarico">Ricarico Medio (%):</label>
                <input type="number" id="ricarico" step="0.01" />
            </div>
            <div class="form-group">
                <label for="giorni">Giorni di Apertura Annuali:</label>
                <input type="number" id="giorni" />
            </div>
            ${livello === 2 ? `
                <div class="form-group">
                    <label for="coperti">Numero di Coperti Giornalieri Medi Necessari:</label>
                    <input type="number" id="coperti" />
                </div>
            ` : ''}
            <button onclick="calcolaRisultati()">Calcola</button>
            <div id="risultati" class="result"></div>
        `;
        gameContainer.innerHTML = formHtml;
    }

    // Funzione per calcolare e mostrare i risultati
    window.calcolaRisultati = function() {
        const livello = currentLevel;
        const tipoLocale = document.querySelector('#tipoLocale').innerText;
        const dimensione = parseInt(document.querySelector('#dimensione').innerText);
        const zona = document.querySelector('#zona').innerText;
        
        const personaleUtente = parseFloat(document.querySelector('#personale').value);
        const ricaricoUtente = parseFloat(document.querySelector('#ricarico').value);
        const giorniUtente = parseInt(document.querySelector('#giorni').value);
        const copertiUtente = livello === 2 ? parseFloat(document.querySelector('#coperti').value) : null;

        const punteggio = calcolaPunteggio(personaleUtente, ricaricoUtente, giorniUtente, tipoLocale, dimensione, zona);
        const risultatiHtml = `
            <p>Punteggio di Conformità: ${punteggio.toFixed(2)} (dove 1 è perfetto e 0 è fuori standard)</p>
            ${livello === 2 ? `<p>Coperti Ottimali: ${calcolaCopertiNecessari(dimensione, tipoLocale).toFixed(2)}</p>` : ''}
        `;
        document.getElementById('risultati').innerHTML = risultatiHtml;
    };

    // Inizia il gioco con il Livello 1
    mostraLivello(currentLevel);
});
