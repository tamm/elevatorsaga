{
    init: function(elevators, floors) {
        var sendLeastBusyElevator = function(targetFloor){
            var leastBusy = 0;
            var leastBusyCount = null;

            for (var i = 0; i < elevators.length; i++) {
                var queue = elevbaseators[i].destinationQueue;
                if ((queue.length < leastBusyCount || leastBusyCount === null) && elevators[i].loadFactor() < 0.4) {
                    leastBusy = i;
                    leastBusyCount = queue.length;
                }
            }
            goToIfNotInQueue(elevators[leastBusy], targetFloor);
        }
        var goToIfNotInQueue = function(elevator, targetFloor){
            var queue = elevator.destinationQueue;
            if (queue.indexOf(targetFloor) < 0) {
                elevator.goToFloor(targetFloor);
            } else {
                return false; //already sending a lift
            }
        }
        var goToMostImportantFloor = function (){
            var mostImportantFloorCount = 0;
            var pressedFloors = this.getPressedFloors();

            if (pressedFloors.length > 0) {
                var mostImportantFloor = pressedFloors[0];

                for ( var floor in pressedFloors ) {
                    if(floors[floor].buttonStates.up || floors[floor].buttonStates.down) {
                        mostImportantFloor = floor;
                    }
                }
            }

            if(this.loadFactor() < 0.1) {
                // Maybe use this elevator, since it's not full yet?
            }
            else 
            {
                goToIfNotInQueue(this, mostImportantFloor);
            }
        }

        for (var i = 0; i < elevators.length; i++) {
            elevators[i].on("idle", goToMostImportantFloor);

            elevators[i].on("floor_button_pressed", function(floorNum) {
                this.floors[floorNum]++;
                this.trigger("idle");
            } );
        }
        for (var i = 0; i < floors.length; i++) {
            floors[i].on("up_button_pressed", function() {
                sendLeastBusyElevator(this.level);
            })
            floors[i].on("down_button_pressed", function() {
                sendLeastBusyElevator(this.level);
            })
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}