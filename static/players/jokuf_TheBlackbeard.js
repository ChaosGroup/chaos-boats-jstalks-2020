const onGameMessage = (typeof importScripts === 'function'
        ? (importScripts('port.js'), self)
        : require('./port')
).port;


function render(ownShip, targets) {
    return {
        speed: 0, // 0 -> 6
        rudder: 0, // -3 <- 0 -> +3
        fireSector: 0, // 0, 1 -> 12
    };
}

// stay in place
onGameMessage(render);
