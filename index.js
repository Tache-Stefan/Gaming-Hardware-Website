const express = require("express")
const path = require("path")
const fs = require("fs")
const sharp = require("sharp")
const sass = require("sass")
const pg = require("pg")

const Client = pg.Client

client = new Client({
    database: "proiect",
    user: "stefan",
    password: "stefan",
    host: "localhost",
    port: 5432
})

client.connect()
client.query("select * from prajituri", function(err, rezultat){
    console.log(err)
    console.log(rezultat)
})
client.query("select * from unnest(enum_range(null::categ_prajitura))", function(err, rezultat){
    console.log(err)
    console.log(rezultat)
})

app = express()

app.set("view engine", "ejs")

obGlobal = {
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname, "resources/scss"),
    folderCss: path.join(__dirname, "resources/css"),
    folderBackup: path.join(__dirname, "backup")
}

vect_folders = ["temp", "backup", "temp1"]
for (let folder of vect_folders) {
    let folder_path = path.join(__dirname, folder)
    if (!fs.existsSync(folder_path)) {
        fs.mkdirSync(folder_path)
    }
}

// function compileazaScss(caleScss, caleCss){
//     console.log("cale:", caleCss)
//
//     if(!caleCss){
//         let numeFisExt = path.basename(caleScss)
//         let numeFis = numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
//         caleCss = numeFis + ".css"
//     }
//
//     if (!path.isAbsolute(caleScss))
//         caleScss = path.join(obGlobal.folderScss, caleScss)
//     if (!path.isAbsolute(caleCss))
//         caleCss = path.join(obGlobal.folderCss, caleCss)
//
//
//     let caleBackup = path.join(obGlobal.folderBackup, "resources/css")
//     if (!fs.existsSync(caleBackup)) {
//         fs.mkdirSync(caleBackup, {recursive: true})
//     }
//
//     // la acest punct avem cai absolute in caleScss si caleCss
//
//     let numeFisCss = path.basename(caleCss)
//     if (fs.existsSync(caleCss)) {
//         fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resources/css", numeFisCss)) // + (new Date()).getTime()
//     }
//     rez = sass.compile(caleScss, {"sourceMap": true})
//     fs.writeFileSync(caleCss, rez.css)
//     //console.log("Compilare SCSS", rez);
// }

//compileazaScss("a.scss");
// la pornirea serverului
// vFisiere = fs.readdirSync(obGlobal.folderScss)
// for(let numeFis of vFisiere) {
//     if (path.extname(numeFis) == ".scss") {
//         compileazaScss(numeFis)
//     }
// }

// fs.watch(obGlobal.folderScss, function(eveniment, numeFis) {
//     console.log(eveniment, numeFis)
//     if (eveniment=="change" || eveniment=="rename") {
//         let caleCompleta = path.join(obGlobal.folderScss, numeFis)
//         if (fs.existsSync(caleCompleta)) {
//             compileazaScss(caleCompleta)
//         }
//     }
// })

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

function initImagini(){
    var continut = fs.readFileSync(path.join(__dirname, "resources/json/galerie.json")).toString("utf-8")

    obGlobal.obImagini = JSON.parse(continut)
    let vImagini = obGlobal.obImagini.imagini

    let caleAbs = path.join(__dirname, obGlobal.obImagini.cale_galerie)
    let caleAbsMediu = path.join(__dirname, obGlobal.obImagini.cale_galerie, "mediu")
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu)

    for (let imag of vImagini) {
        [numeFis, ext] = imag.fisier.split(".")
        let caleFisAbs = path.join(caleAbs, imag.fisier)
        let caleFisMediuAbs = path.join(caleAbsMediu, numeFis + ".webp")
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs)
        imag.fisier_mediu = path.join("/", obGlobal.obImagini.cale_galerie, "mediu", numeFis + ".webp")
        imag.fisier = path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier)
    }
    console.log(obGlobal.obImagini)
}

initImagini()

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
// app.use("/node_modules", express.static(path.join(__dirname, "node_modules")))

app.get("/cerere", function(req, res) {
    res.send("<p style = 'color: green;'>Buna ziua!</p>")
})

app.get(["/", "/home", "/index"], function(req, res) {
    res.render("pagini/index", {IP: req.ip, imagini: obGlobal.obImagini.imagini})
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

app.get("/produse", function(req, res) {
    console.log(req.query)
    var conditieQuery = "" // TO DO where din parametri

    queryOptiuni = "select * from unnest(enum_range(null::categ_prajitura))"
    client.query(queryOptiuni, function(err, rezOptiuni) {
        console.log(rezOptiuni)

        queryProduse = "select * from prajituri"
        client.query(queryProduse, function(err, rez) {
            if (err) {
                console.log(err)
                afisareEroare(res, 2)
            }
            else {
                res.render("pagini/produse", {produse: rez.rows, optiuni: rezOptiuni.rows})
            }
        })
    })
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
