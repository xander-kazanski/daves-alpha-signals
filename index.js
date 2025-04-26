import OpenAI from 'openai'
import { dates } from '/utils/dates'
import { messages } from './prompt'

// const BACKEND_URL = 'https://curly-grass-12c6.alexander1-15-1943.workers.dev/'
const BACKEND_URL = 'http://localhost:8787'
const tickersArr = []

// DOM Elements
const generateReportBtn = document.querySelector('.generate-report-btn')
const loadingArea = document.querySelector('.loading-panel')
const apiMessage = document.getElementById('api-message')
const tickerInputForm = document.getElementById('ticker-input-form')
const tickerInput = document.getElementById('ticker-input')
const tickersDiv = document.querySelector('.ticker-choice-display')

// Event Listeners
generateReportBtn.addEventListener('click', fetchStockData)

tickerInputForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (tickerInput.value.length > 2) {
        generateReportBtn.disabled = false
        tickersArr.push(tickerInput.value.toUpperCase())
        tickerInput.value = ''
        renderTickers()
    } else {
        const label = document.querySelector('label')
        label.style.color = 'red'
        label.textContent = 'You must add at least one ticker. A ticker is a 3-letter or more code for a stock. E.g., TSLA for Tesla.'
    }
})

// Render tickers in the UI
function renderTickers() {
    tickersDiv.innerHTML = ''
    tickersArr.forEach((ticker) => {
        const newTickerSpan = document.createElement('span')
        newTickerSpan.textContent = ticker
        newTickerSpan.classList.add('ticker')
        tickersDiv.appendChild(newTickerSpan)
    })
}

// Fetch stock data for all tickers
async function fetchStockData() {
    document.querySelector('.action-panel').style.display = 'none'
    loadingArea.style.display = 'flex'
    apiMessage.innerText = '' // Clear previous messages
    
    try {
        const tickers = tickersArr.join(',')
        const request = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tickers, dates }),
        })
        renderReport(await request.text())
    } catch (err) {
        loadingArea.innerText = 'There was an error fetching stock data.'
        console.error('Error fetching stock data:', err)
    }
}

// Render the final report in the UI
function renderReport(output) {
    loadingArea.style.display = 'none';
    const outputArea = document.querySelector('.output-panel');
    outputArea.innerHTML = ''; // Clear previous output

    // Parse the output and format it as HTML
    const report = document.createElement('div');
    report.innerHTML = output
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold formatting
        .replace(/\d+\.\s\*\*(.*?)\*\*/g, '<h3>$1</h3>') // Headings for data points
        .replace(/-\s(.*?):/g, '<li><strong>$1:</strong>') // List items
        .replace(/\n\s{3}/g, '</li>'); // Close list items

    outputArea.appendChild(report);
    outputArea.style.display = 'flex';
}