import { writeFile } from 'fs'
import { grabconvo } from './datacontrol/datacontrol.js'

async function Print (username) {
    grabconvo(username).then(async function (userdata){

        let data = userdata.conversation
        let writer = []
        for (let i = 0; i < data.length; i++) {

            if (data[i].role == "user") {
                writer.push(`\n ${username.toUpperCase()} \n ${data[i].content} \n`)
            }
            else if (data[i].role == "assistant") {
                writer.push(`\n HATBOT \n ${data[i].content} \n`)
            }

        }
      
        console.log(`before write`)
        writeFile(`./prints/${username}.txt`, `Persona: \n${userdata.persona}\n\nConversation: \n${writer}
        `,
        (err) => err ? console.error(err) : console.log("Print success! Check Output folder!"))

    })
}

const _Print = Print

export { _Print as Print }