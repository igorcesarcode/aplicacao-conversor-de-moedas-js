/*
 * O El no final do nome da cost é uma convenção
 * que significa que a esta guardando um elemento do html 
 */

const currencyOneEL = document.querySelector('[data-js="currency-one"]');
const currencyTwoEl = document.querySelector('[data-js="currency-two"]');
const currenciesEl = document.querySelector('[data-js="currencies-container"]')
const convertedValeuEl = document.querySelector('[data-js="converted-value"]');
const valeuPrecisionEl = document.querySelector('[data-js="conversion-precision"]')
const timesCurrencyOneEl = document.querySelector('[data-js="currency-one-times"]')

let internalExchageRate = {}
const getUrl = currency => `https://v6.exchangerate-api.com/v6/6c60e2d8e2aa4b7b94399c7f/latest/${currency}`

const getErromenssage = errorType => ({
    'unsupported-code': 'A moeda não existe no nosso banco da dados.',
    'malformed-request': 'quando alguma parte de sua solicitação não segue a estrutura mostrada acima.',
    'invalid-key': 'quando sua chave API não é válida.',
    'inactive-account': "se o seu endereço de e-mail não foi confirmado.",
    'quota-reached': "quando sua conta atingir o número de solicitações permitidas por seu plano."
})[errorType] || 'Não foi possivel obter as informações.'

const fetchExchageRate = async url => {
    try {
        console.log(url)
        const response = await fetch(url);
        const exchageRateData = await response.json();

        if (!response.ok) {
            throw new Error('Erro de rede: Não foi possivel obter as informações')

        }

        if (exchageRateData.result == 'error') {
            throw new Error(getErromenssage(exchageRateData['error-type']));
        }

        return exchageRateData

    } catch (err) {
        const div = document.createElement('div');
        const button = document.createElement('button');

        div.textContent = err.message
        div.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show')

        button.classList.add('btn-close')
        button.setAttribute('type', 'button')
        button.setAttribute('aria-label', 'Close')
        button.addEventListener('click', () => {
            div.remove();
        })

        div.appendChild(button)

        currenciesEl.insertAdjacentElement('afterend', div)


    }

}


const init = async () => {
    
    internalExchageRate  = {...(await fetchExchageRate(getUrl('USD'))) }
    
    const getOptions = selectedCurrency => Object.keys(internalExchageRate.conversion_rates)
    .map(currency => `<option ${currency === selectedCurrency ? 'selected': ''} >${currency}</option>`)
    .join('')
    
    currencyOneEL.innerHTML = getOptions('USD');
    currencyTwoEl.innerHTML = getOptions('BRL');
    
    convertedValeuEl.textContent = `BRL:${internalExchageRate.conversion_rates.BRL.toFixed(2)}`
    valeuPrecisionEl.textContent = `1 USD = ${internalExchageRate.conversion_rates.BRL} BRL`
    
    //console.log(exchageRateData.conversion_rates.BRL);
}

timesCurrencyOneEl.addEventListener('input', e => {
    convertedValeuEl.textContent = `${currencyTwoEl.value}:${(e.target.value * internalExchageRate.conversion_rates[currencyTwoEl.value]).toFixed(2)}`;
    console.log(internalExchageRate.conversion_rates[currencyTwoEl.value])

})

currencyTwoEl.addEventListener('input', e => {
    console.log(currencyTwoEl.value)
    const currencyTwoValue = internalExchageRate.conversion_rates[e.target.value]
    convertedValeuEl.textContent = `${currencyTwoEl.value}:${(timesCurrencyOneEl.value * currencyTwoValue).toFixed(2)}`;
    valeuPrecisionEl.textContent = `1 ${currencyOneEL.value} = ${ 1 * internalExchageRate.conversion_rates[currencyTwoEl.value] }`
})


currencyOneEL.addEventListener('input', async e => { 
    internalExchageRate = { ...(await fetchExchageRate(getUrl(e.target.value))) }
    convertedValeuEl.textContent = `${currencyTwoEl.value}:${(timesCurrencyOneEl.value * internalExchageRate.conversion_rates[currencyTwoEl.value]).toFixed(2)}`
    valeuPrecisionEl.textContent = `1 ${currencyOneEL.value} = ${ 1 * internalExchageRate.conversion_rates[currencyTwoEl.value] } ${currencyTwoEl.value}`
})

init();

