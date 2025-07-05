export function getPokemonName(input) {
    const pokemon = input.match(new RegExp(/[0-9]{4} ([A-Za-záéíóú0-9-\s]{1,})(_[A|G|H|P])?(_F)?(__[A-Za-z_ñáéíóú-]{1,})?/)) // Name of Pokemon + Regional Variation + Female Variation
    if(pokemon[2]!=undefined){
        let region;
        if(pokemon[2]=="_A"){region="Alola"}
        else if(pokemon[2]=="_G"){region="Galar"}
        else if(pokemon[2]=="_H"){region="Hisui"}
        else if(pokemon[2]=="_P"){region="Paldea"}
        pokemon[1]=`${pokemon[1]}_de_${region}`
    }
    if(pokemon[4]!=undefined){
        pokemon[1]=`${pokemon[1]}${pokemon[4].slice(1)}`
    }
    pokemon[1]=`${pokemon[1]}_EP`
    if(pokemon[3]!=undefined){
        pokemon[1]=`${pokemon[1]}_hembra`
    }
    return pokemon[1].replace(" ", "_")
}