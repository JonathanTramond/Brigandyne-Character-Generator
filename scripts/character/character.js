/*********************************************************************************
 * 
 * Ce fichier contient les scripts nécessaires au fonctionnement du générateur
 * 
 * 
 *********************************************************************************/


function createCharacter(myConfig) {
            
    
        let config = myConfig;
        let character = initCharacter();

        getOrigin(character, config);
        getFate(character);
        getSecondaryAttributes(character);
        getName(character, config);
        getAge(character);

        //genererCompetences();
        switch (config.mode) {
            case 0:
                getStats(character);
                break;
            case 1:
                getStatsByRoll(character, config);
                break;
            case 2:
                getStatsByRoll(character, config);
                break;
        }

        getArchetype(character, config);
        getTraits(character);
        getJob(character, config);

        getMagicStat(character);
        magicImpact(character);


        if (config.role !== 0) {
            getTitle(character, config);
        }

        getAbilities(character);
        getMainAttributes(character);
        getEquipment(character);

        // tours de magie
        if (character.stats.mag.value >= 10 && character.abilitiesSum >= 1) {
            let listOfTricks = getBook(character, tricks, "tricks");
            getPowers(character, character.tricks, listOfTricks)
        } 

        //sortilèges
        if (character.stats.mag.value >= 20 && character.abilitiesSum >= 1) {

            let listOfSpells = getBook(character, spells, "spells");
            getPowers(character, character.spells, listOfSpells)
        }

        sortAbilities(character);


        return character
}




/**
 * Cette fonction s'occupe de tirer un peuple au hasard (si vaut -1)
 * puis détermine le destin et le spécial par rapport au peuple
 *  
 * @param {number} : l'index du peuple. Si aléatoire index vaut -1
 *  
 */

function getOrigin(character, config) {

    // tirage du peuple
    if (config.origin === -2) {
    let y = aleatoire(100)+1

    // sélectionne un peuple selon la répartition statistique des peuples
        for (let i = 0 ; i < repartitionPeuples.length ; i++) {
            if (y >= repartitionPeuples[i][0] && y <= repartitionPeuples[i][1]) {

                switch (i) {
                    case 0 : 
                    character.originID = 0;
                        break ;
                    case 1 : 
                    character.originID = 3;
                        break ;
                    case 2 : 
                    character.originID = 4;
                        break ;
                    case 3 : 
                    character.originID = 5;
                        break ;
                    case 4 : 
                    character.originID = 7;
                        break ;
                    case 5 : 
                    character.originID = 8;
                        break ;
                    case 6 : 
                    character.originID = 6;
                        break ;
                    case 7 : 
                    character.originID = 2;
                        break ;
                    case 8 : 
                    character.originID = 1;
                        break ;
                }
            }
        }
    }

    if (config.origin === -1) {
        let y = aleatoire(origine.length)
        character.originID = y
    }

    if (config.origin >= 0) {
        character.originID = config.origin
    }

    character.origin = origine[character.originID][0];
}


function sortAbilities(character) {
    character.abilities.sort((a, b) => a.localeCompare(b));
}



function getFate(character) {
        // le destin
        if (character.originID === 0 || character.originID === 3) {
           character.fate = 3 ;
        } else {
           character.fate = 2 ;
        }
}

function getSecondaryAttributes(character) {

    switch (character.originID) {

        case 0 :    //humain
            break ;

        case 1 :    //elfe
            character.special = "Nyctalopie"
            break ;

        case 2 :    //nain
            character.pv.sum += 1 // PV 
            character.sf.sum += 1 // SF 
            character.special = "PV+1, SF+1"
            character.pv.bonus = 1 // PV add.
            character.sf.bonus = 1 // SF add.
            break ;

        case 3 :    //halfelin
            break ;
            
        case 4 :    //elvin
            character.special = "Nyctalopie"
            break ;

        case 5 :    //hudvàr
            character.pv.sum += 1 // PV
            character.sf.sum += 1 // SF
            character.special = "PV+1, SF+1"
            character.pv.bonus = 1 // PV add.
            character.sf.bonus = 1 // SF add.
            break ;

        case 6 :    //ogrin
            character.special = `PV+2,<br>Rés. aux maladies`
            character.pv.sum += 2 // SF : idem
            character.pv.bonus = 2 // PV add.
            break ;

        case 7 :    //orquin
            character.special = `Nyctalopie,<br>Rés. aux maladies`
            break ;

        case 8 :    //morvelin
            character.special = `Nyctalopie,<br>Rés. aux maladies`
            break ;
    }
}

/**
 * Générer un prénom aléatoire
 * 
 */

function getName(character, config) {

    if (config.name === -1) {
            // choix d'une liste de prénoms
        let x = aleatoire(prenoms.length)
            // choix du masculin ou féminin
        let y = aleatoire(prenoms[x].length)
            // choix du prénom
        let i = aleatoire(prenoms[x][y].length)
    
        character.name.value = prenoms[x][y][i]
        character.name.original = character.name.value ;
        console.log(character.name.original)
    }

    // choix aléatoire en fonction du peuple
    if (config.name === -2) {

        switch (character.originID) {
            case 1: 
                x = 10;
                break;
            case 2:
                x = 11;
                break;
            case 3:
                x = 12;
                break;
            case 6:
                x = 9;
                break;
            case 7:
                x = 9;
                break;
            case 8:
                x = 9;
                break;
            default:
                x = aleatoire(9)
        }

        // choix de l'origine
    let y = aleatoire(prenoms[x].length)
        // choix du prénom
    let i = aleatoire(prenoms[x][y].length)

    character.name.value = prenoms[x][y][i] ;
    character.name.original = character.name.value ;
    }


    if (config.name >= 0) {
            // choix du masculin ou féminin
        let y = aleatoire(prenoms[config.name].length)
            // choix du prénom
        let i = aleatoire(prenoms[config.name][y].length)
        
        character.name.value = prenoms[config.name][y][i]
        character.name.original = character.name.value ;
    }
}



/**
 * Générer l'âge aléatoire en fonction du peuple'
 *
 */

function getAge(character) {

    switch (character.originID) {
        case 0 :
            //humain
            character.age.original = aleatoire(33)+12
            break ;
        case 1 :
            //elfe
            character.age.original  = aleatoire(288)+12
            break ;
        case 2 :
            //nain
            character.age.original  = aleatoire(88)+12
            break ;
        case 3 :
            //halfelin
            character.age.original  = aleatoire(68)+12
            break ;
        case 4 :
            //elvin
            character.age.original  = aleatoire(48)+12
            break ;
        case 5 :
            //hudvàr
            character.age.original  = aleatoire(58)+12
            break ;
        case 6 :
            //ogrin
            character.age.original  = aleatoire(28)+12
            break ;
        case 7 :
            //orquin
            character.age.original  = aleatoire(28)+12
            break ;
        case 8 :
            //orquin
            character.age.original  = aleatoire(38)+12
            break ;
    }

        character.age.value = character.age.original ;

}





/**
 * Générer les compétences du personnage
 * Un personnage dispose de 120 points à répartir parmi ses 12 caractéristiques (sans compter la magie)
 *
 */

function getStats(character) {

let sum = 0;
let stats = [];
let pool = 120;
let y = 0 ;// le tableau des caractéristiques    
let i = 0;

    // pour chaque caractéristique on attribue une valeur aléatoire (0, 5, 10, 15 ou 20)
    for (i = 0; i < 12; i++) {

        // s'il reste plus de 20 points dans la pool on tire un nombre aléatoire
        if (pool >= 20) { 
            y = (aleatoire(5))*5; 
        } 
        // sinon on met juste le reste dans la caractéristique en cours
        else {  
            y = pool  
        }

        stats[i] = y       
        // puis on diminue la pool d'un chiffre équivalent 
        pool -= y 
    }

    for (i = 0; i < 12 ; i++) {
        sum += stats[i];
    }

    // si la somme des caractéristiques n'est pas égale à 120, on lance une nouvelle création
    if (sum !== 120) {
        getStats(character)
    } 
    else {  

        shuffle(stats)
        getStatsInfo(character, stats);
        checkStatsSum(stats);
        addOriginStats(character, stats)

    }
}

function getStatsInfo(character, stats) {
    for (let i = 0 ; i < keys.length ; i++) {
        character.sum.roll += stats[i];
        character.sum.origin += origine[character.originID][i+1] ;

        let property = findPropertyByName(character, keys[i]);
        property.roll = stats[i];
        property.origin = origine[character.originID][i+1] ;
    }
        character.sum.rollorigin = character.sum.roll + character.sum.origin;
}

function addOriginStats(character, stats) {

    for (i = 0; i < stats.length; i++) {
        stats[i] += origine[character.originID][i+1] ;
        }
        
    for (i = 0 ; i < keys.length ; i++) {
        let property = findPropertyByName(character, keys[i])
        property.value += stats[i];
    }
}


function checkStatsSum(stats) {
    let mySum = 0;
        for (i = 0 ; i < stats.length ; i++) {
            mySum += stats[i];
        }
}


/**
 * Cette fonction s'occupe de tout ce qui est lié à l'archétype.
 * Elle choisit les modifications à apporter aux caractéristiques lorsque nécessaire avec stringrandom()
 * Elle indique les vices et vertus sélectionne depuis la liste en évitant les doublons
 *  
 * @param {number} : l'index de l'archétype. Si aléatoire index vaut -1
 *  
 */

function getArchetype(character, config) {

    let i = 0;

    if (config.archetype === -1) {
        character.archetypeID = aleatoire(archetype.length);
        character.archetype = archetype[character.archetypeID].name;
    }
    else {
        character.archetype = archetype[config.archetype].name;
        character.archetypeID = config.archetype;
    }

    // applique les modificateurs de caractéristiques de l'archétype un par un
    for (i = 0 ; i < archetype[character.archetypeID].bonus.length ; i++) {

        bonusArchetype(character, stringrandom(archetype[character.archetypeID].bonus[i]))

    }
}


function getTraits(character) {

    let trait1 = "";
    let trait2 = "";

        // tire deux vices et vertus selon l'archétype. Si les deux sont identiques, il y a relance
        while (trait1 === trait2) {

            // si il y a deux entrées vices et vertus dans le tableau
            if (archetype[character.archetypeID].traits.length === 2) {
                trait1 = stringrandom(archetype[character.archetypeID].traits[0])
                trait2 = stringrandom(archetype[character.archetypeID].traits[1])
            }
            // si il n'y en a qu'une seule
            else {
                trait1 = stringrandom(archetype[character.archetypeID].traits[0])
                trait2 = stringrandom(archetype[character.archetypeID].traits[0])
            }
        }
    
        character.traits[0] = trait1;
        character.traits[1] = trait2;
}




/**
 * Cette fonction complète la fonction de création de sélection de l'archétype
 * Elle reçoit en entrée une chaîne de caractère du type "FOR+5".
 * Elle décline la valeur entre trois variables "FOR", "+" et "5"
 * Elle s'occupe ensuite d'incrémenter la valeur concernée
 * 
 * @param {string} str : la chaîne de caractère à traduire en instructions
 * 
 */

function bonusArchetype(character, str) {

let stat = ""
let operateur = ""
let value = 0   // valeur d'incrémentation/décrémentation
let z

    // récupérer l'opérateur
    if (str.indexOf("+") !== -1) {
        operateur = "+"
        z = str.indexOf("+")
    }
    else {
        operateur = "-"
        z = str.indexOf("-")
    }

// récupérer la valeur d'incrémentation/décrémentation

value = str.slice(z+1)

// récupérer la caractéristiques

stat = str.slice(0, z).toLowerCase() ;

    for (let i = 0 ; i < keys.length ; i++) {
        if (stat === allkeys[i]) {

            let property = findPropertyByName(character, keys[i])

            if (operateur === "+") {
                property.value += Number(value)
                property.archetype = Number(value)
                character.sum.archetype += Number(value)
                
            }
            else {
                property.value -= Number(value) 
                property.archetype = -Number(value)
                character.sum.archetype -= Number(value)
            }
        }}

}



function getJobLogic(character) {
        // Groupe Logique
        
            let y = aleatoire(100)+1 ;
            // sélectionne un métier selon la répartition statistique des métiers
            for (let i = 0 ; i < repartitionMetiers[character.originID].length ; i++) { 
                
                if (y >= repartitionMetiers[character.originID][i][0] && y <= repartitionMetiers[character.originID][i][1]) {
                    character.groupID = i ;
                }
            }
            // tirer un métier au hasard parmi la branche
            character.jobID = (aleatoire(8))+(8*(character.groupID));
}


function getGroup(character, config) {
    if (config.group === -2 && config.job < 0) {
        getJobLogic(character);
    }
    else if (config.group === -1 && config.job < 0) {
        character.groupID = aleatoire(groups.length);
    }
    else if (config.job < 0) {
        character.groupID = config.group ;
    }
    else {
        character.groupID = Math.floor(config.job/8);
    }
}

function getJobByGroup(character, config) {
    if (config.job === -1) {
        character.jobID = (aleatoire(8))+(8*(character.groupID));
    }
    else if (config.job >= 0) {
        character.jobID = config.job;
    }
}


function getJob(character, config) {

    getGroup(character, config) ;

    getJobByGroup(character,config) ;

    // afficher le métier=
    character.group = groups[character.groupID].name;
    character.job = stringrandom(jobs[character.jobID].name);
}


/**
 * Cette fonction détermine l'équipement du PJ
 * 
 */

function getEquipment(character) {
    let stuff = ""

    getFromList(character, groups[character.groupID].inventory, character.equipment);
    getFromList(character, groups[character.groupID].weapons, character.weapons);
    stuff = getFromList(character, groups[character.groupID].money, character.money);
    character.money = stuff;

    getFromList(character, jobs[character.jobID].inventory, character.equipment);
    getFromList(character, jobs[character.jobID].weapons, character.weapons);

    stuff = getFromList(character, groups[character.groupID].armor, character.armor);
    
    if (character.armor.length === 0) {
        stuff = getFromList(character, jobs[character.jobID].armor, character.armor);
    }
    
    character.armor = stuff;
}


function getFromList(character, id, stuff) {

        if (Array.isArray(stuff)) {
            for (let i = 0 ; i < id.length ; i++) {
                
                //console.log(id[i]);
                stuff.push(translate(character, stringrandom(id[i])));

            }
        }
        else {
            //console.log(id)
            stuff = `${translate(character, stringrandom(id))}`;
            return stuff
        }
}



/**
 * Calculer les atouts.
 * 
 * Un personnage possède autant n atouts = *CNS* - 1 
 * On shuffle les atouts puis on prend les n premiers 
 * 
 */

function getAbilities(character) {

    character.abilitiesSum = indice(character.stats.cns.value)-1
    let isWizard = checkDomainsInJob(character);

        // si le PJ a un score de magie positif...
        if (character.stats.mag.value > 0 ) {
            
            becomingWizard(character, isWizard);   
            
        }
        else {
            // SI LE PJ N'EST PAS UN MAGE !
            // remplit un tableau avec les 20 atouts possibles        

            let abilities = getAbilitiesArray(character, 0) ;

            for (let i = 0 ; i < character.abilitiesSum ; i++) {
                character.abilities.push(stringrandom(abilities[i]))
                //console.log(atouts[i])
            } 
        }
}

        // omet les atouts magiques puisqu'ils sont ajoutés différements
function getAbilitiesArray(character) {

    let abilities = []

    for (let skill of jobs[character.jobID].skills) {
        if (skill.indexOf('Domaine magique') === -1) {
        abilities.push(skill);
        }
    }

    for (let talent of jobs[character.jobID].talents) {
            abilities.push(talent);
    }

    shuffle(abilities)

    //console.log("abilities without Domaine Magique")
    //console.log(abilities)
    
    return abilities
}




function getMainAttributes(character) {

    // initiative
    character.initiative = indice(character.stats.com.value)+indice(character.stats.mou.value)+indice(character.stats.per.value);

    // vitalité
    character.pv.base = Math.floor((character.stats.for.value/5)+(character.stats.end.value/5)+indice(character.stats.vol.value));
    character.pv.sum = character.pv.base + character.pv.bonus;

    // seuil de blessure
    character.sb = Math.floor(character.pv.sum/2);

    // sang-froid
    character.sf.base = Math.floor((character.stats.vol.value/5)+(character.stats.cns.value/5)+indice(character.stats.com.value));
    character.sf.sum = character.sf.base + character.sf.bonus;

    // instabilité
    character.instability = Math.floor(character.sf.sum/4)

    // total : [initiale + archétype] - [magie - mod combat] = total final

        for(let i = 0 ; i < keys.length ; i++) {
            let property = findPropertyByName(character, keys[i])
            character.sum.sum12 += property.value;
        }

    character.sum.resultBeforeMagic = 
                    (character.sum.rollorigin + 
                    character.sum.archetype) - 
                    (character.stats.mag.value - 
                    character.sum.comDecrease) ;

}




function getStatsByRoll(character, config) {

    let y = 0 // le tableau des caractéristiques    
    let i = 0

            // pour chaque caractéristique on attribue une valeur égale à 2d10
            for (i = 0; i < keys.length; i++) {

                if (config.mode === 1) {
                    y = (lancerD10()+lancerD10()) 
                } 
                else if (config.mode === 2) {
                    y = aleatoire(5)*5
                }

                let property = findPropertyByName(character, keys[i])
                property.value = y;
                property.roll = y; 
                character.sum.roll += y;
            }

            // on modifie les variables globales par rapport aux résultats
            for (i = 0; i < keys.length; i++) {

                let property = findPropertyByName(character, keys[i])
                property.value += origine[character.originID][i+1] ;
                character.sum.origin += origine[character.originID][i+1] ;
            }
                character.sum.rollorigin = character.sum.origin + character.sum.roll ;
            
    }
