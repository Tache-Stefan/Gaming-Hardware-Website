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
client.query("select * from produse", function(err, rezultat){
    console.log(err)
    console.log(rezultat)
})
client.query("select * from unnest(enum_range(null::categorii))", function(err, rezultat){
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

function compileazaScss(caleScss, caleCss){
    console.log("cale:", caleCss)

    if(!caleCss){
        let numeFisExt = path.basename(caleScss)
        let numeFis = numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss = numeFis + ".css"
    }

    if (!path.isAbsolute(caleScss))
        caleScss = path.join(obGlobal.folderScss, caleScss)
    if (!path.isAbsolute(caleCss))
        caleCss = path.join(obGlobal.folderCss, caleCss)


    let caleBackup = path.join(obGlobal.folderBackup, "resources/css")
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup, {recursive: true})
    }

    // la acest punct avem cai absolute in caleScss si caleCss

    let numeFisCss = path.basename(caleCss)
    let timestamp = Date.now(); // ex: 1681124489791
    let numeFisCssFaraExt = numeFisCss.split(".")[0]; // "a"
    let extensie = path.extname(numeFisCss); // ".css"

    if (fs.existsSync(caleCss)) {
        //fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resources/css", numeFisCss)) // + (new Date()).getTime()
        let caleBackupComplet = path.join(caleBackup, `${numeFisCssFaraExt}_${timestamp}${extensie}`);
        fs.copyFileSync(caleCss, caleBackupComplet)
    }
    let rez = sass.compile(caleScss, {"sourceMap": true})
    fs.writeFileSync(caleCss, rez.css)
    console.log("Compilare SCSS", rez);
}

vFisiere = fs.readdirSync(obGlobal.folderScss)
for(let numeFis of vFisiere) {
    if (path.extname(numeFis) == ".scss") {
        compileazaScss(numeFis)
    }
}

fs.watch(obGlobal.folderScss, function(eveniment, numeFis) {
    console.log(eveniment, numeFis)

    if ((eveniment == "change" || eveniment == "rename") && !numeFis.endsWith("~")) {
        let caleCompleta = path.join(obGlobal.folderScss, numeFis)
        if (fs.existsSync(caleCompleta)) {
            compileazaScss(caleCompleta)
        }
    }
})

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
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));

app.get(["/", "/home", "/index"], function(req, res) {
    res.render("pagini/index", {IP: req.ip, imagini: obGlobal.obImagini.imagini})
})

app.get("/favicon.ico", function(req, res) {
    res.sendFile(path.join(__dirname, "resources/img/favicon/favicon.ico"))
})

app.get("/produse", function(req, res) {
    console.log("Query primit:", req.query)
    const categorieSelectata = req.query.tip_produs

    let conditieQuery = ""
    let parametrii = []

    if (categorieSelectata && categorieSelectata !== "toate") {
        conditieQuery = " WHERE tip_produs = $1"
        parametrii.push(categorieSelectata)
    }

    const queryOptiuni = "SELECT unnest(enum_range(NULL::tipuri_produse)) AS unnest"

    client.query(queryOptiuni, function(err, rezOptiuni) {
        if (err) {
            console.error("Eroare la enum:", err)
            return afisareEroare(res, 2)
        }

        const queryProduse = "SELECT * FROM produse" + conditieQuery

        client.query(queryProduse, parametrii, function(err, rez) {
            if (err) {
                console.error("Eroare la produse:", err)
                return afisareEroare(res, 2)
            }

            const produse = rez.rows
            const produsePerTip = {}

            produse.forEach(prod => {
                if (!produsePerTip[prod.tip_produs]) {
                    produsePerTip[prod.tip_produs] = prod;
                } else {
                    if (parseFloat(prod.pret) < parseFloat(produsePerTip[prod.tip_produs].pret)) {
                        produsePerTip[prod.tip_produs] = prod;
                    }
                }
            });

            produse.forEach(prod => {
                if (produsePerTip[prod.tip_produs] && produsePerTip[prod.tip_produs].id === prod.id) {
                    prod.isCelMaiIeftin = true;
                } else {
                    prod.isCelMaiIeftin = false;
                }
            });

            res.render("pagini/produse", {
                produse: rez.rows,
                optiuni: rezOptiuni.rows,
                nrProduse: rez.rows.length
            });
        });
    });
});

app.get("/produs/:id", (req, res) => {
    const id = parseInt(req.params.id);

    client.query("SELECT * FROM produse WHERE id = $1", [id], function(err, result) {
        if (err) {
            console.error("Eroare la interogare produs:", err);
            return afisareEroare(res, 2);
        }

        if (result.rows.length === 0) {
            return res.status(404).render("pagini/404", { idCautat: id });
        }

        const produs = result.rows[0]

        const caleImagine = produs.imagine
        const folderProdus = caleImagine.split("/")[4]
        const folderAbsolut = path.join(__dirname, "resources", "img", "produse", folderProdus)

        let imagini = []

        try {
            const fisiere = fs.readdirSync(folderAbsolut)
            imagini = fisiere.filter(f => f.toLowerCase().endsWith('.png'))
                             .sort()
                             .map(f => `/resources/img/produse/${folderProdus}/${f}`);
        } catch (e) {
            console.error("Eroare la citire imagini:", e);
        }

        const querySimilare = `
            SELECT id, nume, imagine, pret FROM produse 
            WHERE categorie = $1 AND id <> $2
            LIMIT 4
        `;

        client.query(querySimilare, [produs.categorie, produs.id], function(err2, rezSimilare) {
            if (err2) {
                console.error("Eroare la interogare produse similare:", err2);
                return afisareEroare(res, 2);
            }

            res.render("pagini/produs", {
                produs,
                imagini,
                produse_similare: rezSimilare.rows
            });
        });
    });
});

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
