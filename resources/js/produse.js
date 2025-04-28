const produsePastrate = new Set();
const SESSION_STORAGE_KEY = 'hiddenProducts';
let hiddenSessionProductIds = new Set();

function getHiddenProductIdsFromSession() {
    const storedIds = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (storedIds) {
        try {
            return new Set(JSON.parse(storedIds));
        } catch (e) {
            console.error("Error parsing hidden product IDs from sessionStorage:", e);
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
            return new Set();
        }
    }
    return new Set();
}

function updateSessionStorage() {
    const idsToStore = Array.from(hiddenSessionProductIds);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(idsToStore));
    console.log("Hidden product IDs updated in sessionStorage:", idsToStore);
}

function updateCounter() {
    const produseVizibile = document.querySelectorAll('.produs:not([style*="display: none"])');
    const mesaj = document.getElementById("mesaj-filtrare");
    const nrProduse = document.getElementById("nr-produse");

    nrProduse.textContent = `Produse afișate: ${produseVizibile.length}`;

    if (produseVizibile.length === 0) {
        mesaj.style.display = "block";
    } else {
        mesaj.style.display = "none";
    }
}

function togglePastrareProdus(btn, idProdus, card) {
    if (produsePastrate.has(idProdus)) {
        produsePastrate.delete(idProdus);
        btn.classList.remove("active");
        card.classList.remove("pastrat");
    } else {
        produsePastrate.add(idProdus);
        btn.classList.add("active");
        card.classList.add("pastrat");
    }
}

function hideProductTemporarily(idProdus) {
    if (hiddenSessionProductIds.has(idProdus)) {
        console.log(`Produsul ${idProdus} este deja ascuns permanent in sesiune.`);
        return;
    }

    const card = document.querySelector(`.produs[data-id="${idProdus}"]`);
    if (card) {
        card.style.display = 'none';
        console.log(`Produs ${idProdus} ascuns temporar.`);
        updateCounter();
    }
}

function hideProductInSession(idProdus) {
    const card = document.querySelector(`.produs[data-id="${idProdus}"]`);
    if (card) {
        card.style.display = 'none';
        hiddenSessionProductIds.add(idProdus);
        updateSessionStorage();
        console.log(`Produs ${idProdus} ascuns permanent in sesiune.`);
        updateCounter();

        if(produsePastrate.has(idProdus)){
            const keepButton = document.querySelector(`.btn-toggle-pastrare[data-id="${idProdus}"]`);
            if(keepButton) togglePastrareProdus(keepButton, idProdus, card);
        }
    } else {
        console.warn(`Nu s-a gasit cardul pentru produsul ${idProdus} pentru ascundere in sesiune.`);
    }
}

function normalizeText(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ș/g, "s").replace(/ț/g, "t")
        .replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i");
}

window.addEventListener("DOMContentLoaded", () => {
    hiddenSessionProductIds = getHiddenProductIdsFromSession();
    updateCounter()
    const inpNume = document.getElementById("inp-nume");
    const inpNota = document.getElementById("inp-nota");
    const infoRange = document.getElementById("infoRange");
    const produse = Array.from(document.getElementsByClassName("produs"));
    const btnFiltrare = document.getElementById("filtrare");
    const btnResetare = document.getElementById("resetare");
    const radioPreturi = document.getElementsByName("gr_rad");
    const inpTip = document.getElementById("inp-tip");
    const minori = document.getElementsByName("filtru-minori");
    const containerProduse = document.querySelector(".grid-produse");

    const produseInitiale = Array.from(produse);

    produse.forEach(prod => {
        const idProdus = prod.getAttribute("data-id");
        if (idProdus && hiddenSessionProductIds.has(idProdus)) {
            prod.style.display = 'none';
            console.log(`Applying session hide on load for product ${idProdus}`);
        }
    });
    updateCounter();

    function getCheckedValue(radios) {
        for (let r of radios) {
            if (r.checked) return r.value;
        }
        return null;
    }

    inpNota.addEventListener("input", () => {
        infoRange.innerText = `(${inpNota.value})`;
    });

    btnFiltrare.addEventListener("click", () => {
        let numeVal = inpNume.value.toLowerCase().trim();
        let notaMin = parseFloat(inpNota.value);
        let valPret = getCheckedValue(radioPreturi);
        let [pretMin, pretMax] = valPret === "toate" ? [0, Infinity] : valPret.split(":").map(parseFloat);
        let cat = inpTip.value.toLowerCase();
        let minorVal = getCheckedValue(minori);

        produse.forEach(prod => {
            const idProdus = prod.getAttribute("data-id");

            if (hiddenSessionProductIds.has(idProdus)) {
                prod.style.display = 'none';
                return;
            }

            let titlu = prod.querySelector(".val-nume").textContent.toLowerCase();
            let pret = parseFloat(prod.dataset.pret || 0);
            let nota = parseFloat(prod.dataset.nota || 10);
            let categ = prod.dataset.tip.toLowerCase();
            let ptMinori = prod.dataset.minori === "true";

            let condNume = normalizeText(titlu).includes(normalizeText(numeVal));
            let condPret = pret >= pretMin && pret <= pretMax;
            let condNota = nota >= notaMin;
            let condCat = cat === "toate" || categ.includes(cat);
            let condMinori = (minorVal === "toate") || (minorVal === "true" && ptMinori) || (minorVal === "false" && !ptMinori);

            const estePastrat = produsePastrate.has(prod.getAttribute("data-id"))
            prod.style.display = (condNume && condPret && condNota && condCat && condMinori) || estePastrat ? "block" : "none"
            updateCounter()
        });
    });

    btnResetare.addEventListener("click", () => {
        if (confirm("Sigur doresti sa resetezi toate filtrele?")) {
            inpNume.value = "";
            inpNota.value = 0;
            infoRange.innerText = "(0)";
            document.getElementById("i_rad4").checked = true;
            inpTip.value = "toate";
            document.querySelector("input[name='filtru-minori'][value='toate']").checked = true;

            let container = document.querySelector(".grid-produse");
            produseInitiale.forEach(p => container.appendChild(p));
            produse.forEach(p => {
                const idProdus = p.getAttribute("data-id");

                if (idProdus && hiddenSessionProductIds.has(idProdus)) {
                    p.style.display = 'none';
                } else {
                    p.style.display = 'block';
                }
            });

            updateCounter()
        }
    });

    document.querySelectorAll(".btn-toggle-pastrare").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const card = document.querySelector(`.produs[data-id="${id}"]`);
            togglePastrareProdus(btn, id, card);
        });
    });

    document.querySelectorAll(".btn-hide-temporar").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            hideProductTemporarily(id);
        });
    });

    document.querySelectorAll(".btn-hide-session").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            if (id) hideProductInSession(id);
        });
    });

    function sorteazaProduse(ordine = "crescator") {
        let produseArray = Array.from(document.getElementsByClassName("produs"));

        produseArray.sort(function (a, b) {
            let notaA = parseFloat(a.dataset.nota || 0);
            let notaB = parseFloat(b.dataset.nota || 0);
            let pretA = parseFloat(a.dataset.pret || 1);
            let pretB = parseFloat(b.dataset.pret || 1);

            let raportA = notaA / pretA;
            let raportB = notaB / pretB;

            let subcatA = Array.from(a.classList).find(cl => cl.startsWith("categorie_"))?.replace("categorie_", "") || "";
            let subcatB = Array.from(b.classList).find(cl => cl.startsWith("categorie_"))?.replace("categorie_", "") || "";

            if (raportA !== raportB) {
                return ordine === "crescator" ? raportA - raportB : raportB - raportA;
            }

            return ordine === "crescator" ? subcatA.localeCompare(subcatB) : subcatB.localeCompare(subcatA);
        });

        produseArray.forEach(p => containerProduse.appendChild(p));
    }

    function calculeazaMedia() {
        let preturi = [];
        produse.forEach(prod => {
            if (prod.style.display !== "none") {
                preturi.push(parseFloat(prod.dataset.pret));
            }
        });

        const rezultat = document.getElementById("rezultat-media");

        if (preturi.length === 0) {
            rezultat.textContent = "Nu exista produse vizibile pentru calculul mediei.";
            return;
        }

        const sumaPreturi = preturi.reduce((acc, pret) => acc + pret, 0);
        const mediaPreturilor = sumaPreturi / preturi.length;

        rezultat.textContent = `Media preturilor produselor vizibile este: ${mediaPreturilor.toFixed(2)}€`;

        setTimeout(() => {
            rezultat.textContent = '';
        }, 2000);
    }

    document.getElementById("sortCrescNume").addEventListener("click", () => {
        sorteazaProduse("crescator");
    });

    document.getElementById("sortDescrescNume").addEventListener("click", () => {
        sorteazaProduse("descrescator");
    });

    document.getElementById("calculeaza-media").addEventListener("click", calculeazaMedia);
});
