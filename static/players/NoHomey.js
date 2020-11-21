const onGameMessage = (typeof importScripts === 'function'
	? (importScripts('port.js'), self)
	: require('./port')
).port;

const opsticalAt = at => ship => ship.blockedSector == at;

const opsticalAhead = opsticalAt(12);

const opsticalIn = dir => ship => dir.includes(ship.blockedSector);

const left = [9, 10, 11];

const right = [1, 2, 3];

const opsticalInLeft = opsticalIn(left);

const opsticalInRight = opsticalIn(right);

const noOpsctical = opsticalAt(0);

const fire = target => {
	const change = target.range >= 80 ? randIntIncl(-1, 1) : 0;
	return toClock(target.bearingSector + change);
};

const fireSector = target => (target.range <= 120 ? fire(target) : 0);

const direction = {
	ahead: randIntInclFunc(-1, 1),
	left: randIntInclFunc(-3, -1),
	right: randIntInclFunc(1, 3)
};

let next = [];

const executeAndRemeber = dir => {
    next = [dir, dir];
    return direction[dir]();
}

const simpleRudder = ship =>
	noOpsctical(ship)
		? direction.ahead()
		: opsticalAhead(ship) || opsticalInLeft(ship)
		? executeAndRemeber('right')
		: opsticalAhead(ship) || opsticalInRight(ship)
		? executeAndRemeber('left')
        : direction.ahead();
        
const rudder = ship => {
    if(next.length > 0) {
        const dir = next.pop();
        return direction[dir]();
    }
    return simpleRudder(ship);
}

onGameMessage(({ ownShip, targets }) => {
	const target = targets.sort((a, b) => a.range - b.range)[0];
	return {
		speed: randIntIncl(3, 6),
		rudder: rudder(ownShip),
		fireSector: fireSector(target),
	};
});

function toClock(num) {
	const rem = num % 12;
	return rem === 0 ? 12 : rem;
}

function randIntInclFunc(min, max) {
    const m = Math.ceil(min);
    const M = Math.floor(max);
    return () => randIntIncl(m, M);
}

function randIntIncl(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
