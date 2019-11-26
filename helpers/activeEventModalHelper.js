function determineActivityImage(title){
    switch(title){
        case 'ALL':
            return require('../images/Boardgames1.jpg');
        case 'ART':
            return require('../images/Art1.jpg');
        case 'BASKETBALL':
            return require('../images/Basketball2.jpeg');        
        case 'BILLIARDS':
            return require('../images/Billiards1.jpeg');
        case 'BOARD GAMES':
            return require('../images/Boardgames1.jpg');
        case 'CARDS':
            return require('../images/Cards1.jpg');
        case 'CHARITY':
            return require('../images/Charity1.jpeg');
        case 'CHESS':
            return require('../images/Chess1.jpeg');
        case 'D&D':
            return require('../images/DandD1.jpg');
        case 'DARTS':
            return require('../images/Darts1.jpg');
        case 'DOMINOS':
            return require('../images/Dominos1.jpg');
        case 'FOOD':
            return require('../images/Food2.jpg');
        case 'FOOTBALL':
            return require('../images/Football2.jpg');
        case 'GO':
            return require('../images/Go1.jpg');
        case 'MAGIC CARDS':
            return require('../images/MagicCards1.jpg');
        case 'MUSIC':
            return require('../images/Music1.jpg');
        case 'PING PONG':
            return require('../images/PingPong1.jpg');
        case 'PERFORMANCE':
            return require('../images/Performance1.jpg');
        case 'POKEMON GO':
            return require('../images/PokemonGo1.jpg');
        case 'PROMOTION':
            return require('../images/Promotion2.jpg');
        case 'RUNNING':
            return require('../images/Running1.jpg');
        case 'SHUFFLEBOARD':
            return require('../images/Shuffleboard2.jpg');
        case 'SOCCER':
            return require('../images/Soccer2.jpeg');
        case 'TENNIS':
            return require('../images/Tennis1.jpg');
        case 'WORK':
            return require('../images/Work2.jpg');
        default:

    }
}


export default {determineActivityImage};
