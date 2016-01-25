{
    init: function(elevators, floors) {
        var goToIfNotInQueue = function(elevator, targetFloor){
            if (elevator.destinationQueue.indexOf(targetFloor) == -1) {
                elevator.goToFloor(targetFloor);
            }
        }

        for (var i = 0; i < elevators.length; i++) {
            elevators[i].on("idle", function() {
                if (this.destinationQueue < 1) {
                    this.goToFloor(0);
                }
            });

            elevators[i].on("floor_button_pressed", function(floorNum) {
                goToIfNotInQueue(this, floorNum);
            });

            elevators[i].on("passing_floor", function(floorNum, direction) {
                if (this.destinationQueue.indexOf(floorNum) > -1) {
                    this.destinationQueue.splice(this.destinationQueue.indexOf(floorNum), 1);
                    this.goToFloor(floorNum, true);
                }
            });
        }

        for (var i = 0; i < floors.length; i++) {
            floors[i].on("up_button_pressed down_button_pressed", function() {
                var leastBusy = 0;

                for (var i = 0; i < elevators.length; i++) {
                    if (elevators[i].destinationQueue.indexOf(this.level) > -1) {
                        return;
                    }
                    if (elevators[i].destinationQueue.length < elevators[leastBusy].destinationQueue.length) {
                        leastBusy = i;
                    }
                }

                goToIfNotInQueue(elevators[leastBusy], this.level);
            });
        }
    },
    update: function(dt, elevators, floors) { }
}
