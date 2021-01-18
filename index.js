/*https://developers.google.com/sheets/api/quickstart/nodejs*/
const {google} = require('googleapis')
const credentials = require('./credentials.json')

/*JSON WEB TOKEN*/
const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
)

/*Checks the connection*/
client.authorize(function(err, tokens){
    if(err) {
        console.log(err)
        return;
    } else {
        console.log('Connected!')
        /*Promise error handling*/
        gsrun(client).catch(console.error);
    }
})

function average(dataArray) {
    let newArray = dataArray
    let m = 0

    for(let i = 3; i < newArray.length; i++) {
        m = m + parseFloat(newArray[i])
    }
    m = m / 3
    
    if(m >= 6,5) {
        m = Math.ceil(m)
    }

    return m / 10
}

function calculateLack(dataArray) {
    let newArray = dataArray
    let numberClass = 60

    if(newArray[2] > numberClass / 4) {
        return true
    } else  {return false}
}

function examNote(m) {
    let noteAverage= parseFloat(m)
    let result = 0
     
    result = (noteAverage - 10)
    return result
}

function attSpreadsheet(dataArray) {
    let newArray = dataArray

    for(let i = 3; i < newArray.length;) {
        let m = average(newArray[i])
        
        if(calculateLack(newArray[i]) == true) {
            newArray[i].push('Reprovado por Falta!')
            newArray[i].push('0')
            i++
        } else if(m >= 7 ) {
            newArray[i].push('Aprovado!')
            newArray[i].push('0')
            i++
        } else if(m < 5) {
            newArray[i].push('Reprovado por nota')
            newArray[i].push('0')
            i++
        }
        else if(m >= 5 && m < 7) {
            let noteMinimun = examNote(m) * -1
            newArray[i].push('Exame Final')
            newArray[i].push(noteMinimun.toFixed(2))
            i++
        }
    }

    return newArray
}

async function gsrun(cl) {  
    const gsapi = google.sheets({version:'v4', auth: cl})

    const opt = {
        spreadsheetId:'1lz-ul7S3UEd4K1_4U19JmxmOHkXcD3HpKf_X8DcY7sQ',
        range: 'Engenharia_de_software!A:H',
    }

    let data = await gsapi.spreadsheets.values.get(opt)
    let dataArray = data.data.values

    let newArray = attSpreadsheet(dataArray)

    const updateOptions = {
        spreadsheetId:'1lz-ul7S3UEd4K1_4U19JmxmOHkXcD3HpKf_X8DcY7sQ',
        range: 'Engenharia_de_software!A:H',
        valueInputOption: 'USER_ENTERED',
        resource: {values: newArray}
        
    }
    let response = await gsapi.spreadsheets.values.update(updateOptions)

    console.log(response)
}