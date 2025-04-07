const express = require("express")
const path = require("path")
const fs = require("fs")

app = express()

app.set("view engine", "ejs")

obGlobal = {
    obErori : null
}

vect_folders = ["temp", "backup", "temp1"]
for (let folder of vect_folders) {
    let folder_path = path.join(__dirname, folder)
    if (!fs.existsSync(folder_path)) {
        fs.mkdirSync(folder_path)
    }
}

function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resources/json/erori.json")).toString("utf-8")

    obGlobal.obErori = JSON.parse(continut)

    obGlobal.obErori.eroare_default.imagine = path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine)
    for (let eroare of obGlobal.obErori.info_erori) {
        eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine)
    }
    console.log(obGlobal.obErori)
}

initErori()

function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare = obGlobal.obErori.info_erori.find(function(elem){
        return elem.identificator == identificator
    })
    if (eroare) {
        if (eroare.status)
            res.status(identificator)
        var titluCustom = titlu || eroare.titlu;
        var textCustom = text || eroare.text;
        var imagineCustom = imagine || eroare.imagine;
    }
    else {
        var err = obGlobal.obErori.eroare_default
        var titluCustom = titlu || err.titlu;
        var textCustom = text || err.text;
        var imagineCustom = imagine || err.imagine;
    }
    res.render("pagini/eroare", { //transmit obiectul locals
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom
    })
}

console.log("Folderul proiectului: ", __dirname)
console.log("Cale fisier index.js: ", __filename)
console.log("Folderul de lucru: ", process.cwd())

app.use("/resources", express.static(path.join(__dirname, "resources")))

app.get("/cerere", function(req, res) {
    res.send("<p style = 'color: green;'>Buna ziua!</p>")
})

app.get(["/", "/home", "/index"], function(req, res) {
    res.render("pagini/index", {IP: req.ip})
})

app.get("/abc", function(req, res, next) {
    res.write("Data curenta: ")
    next()
})

app.get("/abc", function(req, res, next) {
    res.write((new Date()) + "")
    res.end()
})

app.get("/favicon.ico", function(req, res) {
    res.sendFile(path.join(__dirname, "resources/img/favicon/favicon.ico"))
})

app.get(/^\/resources\/[a-zA-Z0-9_\/]*$/, function(req, res, next) {
    afisareEroare(res, 403)
})

app.get("/*.ejs", function(req, res, next) {
    afisareEroare(res, 400)
})

app.get("/*", function(req, res, next) {
    try {
        res.render("pagini" + req.url, function (err, rezultatRandare) {
            if (err) {
                if (err.message.startsWith("Failed to lookup view")) {
                    afisareEroare(res, 404)
                } else {
                    afisareEroare(res)
                }
            } else {
                console.log(rezultatRandare)
                res.send(rezultatRandare)
            }
        })
    } catch (errRandare) {
        if (errRandare.message.startsWith("Cannot find module")) {
            afisareEroare(res, 404)
        } else {
            afisareEroare(res)
        }
    }
})

app.listen(8080)
console.log("Serverul a pornit")
