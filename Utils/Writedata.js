import { writeFile } from 'fs'
function Write (Data) {
    writeFile(`./Database/Data.js`, `
        var Data = {
            Suepats: ${Data.Suepats},
            Wizpats: ${Data.Wizpats},
            Karapats: ${Data.Karapats},
            Icepats: ${Data.Icepats},
            Sueboops: ${Data.Sueboops},
            Mikapats: ${Data.Mikapats},
            Zingypats: ${Data.Zingypats},
            Wizardboops: ${Data.Wizardboops},
            Urnpats: ${Data.Urnpats},
        }

         const _Data = Data
         export { _Data as Data }`,
        (err) => err ? console.error(err) : console.log("Write success! Check Output folder!"))
    }
        const _Write = Write
export { _Write as Write }

// var Data = {
//     Suepats: 1,
//     Wizpats: 1,
//     Karapats: 50,
//     Icepats: 2,
//     Sueboops: 44,
//     Mikapats: 1,
//     Zingypats: 1,
// }

// const _Data = Data
// export { _Data as Data }