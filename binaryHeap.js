/**
 * @author Derrick Burns
 */


binaryHeap = function (comparisonFunction) {
    this.cmp = comparisonFunction;
};

binaryHeap.prototype = {
    content: [],

    toArray: function( ) {
        var r = "[";
        for( var i=0; i!= this.content.length; i++ )  {
            r = r + this.content[i].toString();
            r = r + ", ";
        }
        r = r + "]";
        return r;
    },
       
    push: function (element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to sink down.
        this.sinkDown(this.content.length - 1);
    },

    pop: function () {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    },

    remove: function (node) {
        var len = this.content.length;
        // To remove a value, we must search through the array to find
        // it.
        for (var i = 0; i < len; i++) {
            if (this.content[i] === node) {
                // When it is found, the process seen in 'pop' is repeated
                // to fill up the hole.
                var end = this.content.pop();
                if (i !== this.content.length - 1) {
                    this.content[i] = end;
                    this.bubbleUp(i);
                }
                return;
            }
        }
        throw new Error("Node not found.");
    },

    size: function () {
        return this.content.length;
    },

    sinkDown: function (n) {
        // Fetch the element that has to be sunk.
        var element = this.content[n];
        // When at 0, an element can not sink any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            var parentN = Math.floor((n + 1) / 2) - 1,
            parent = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.cmp(element, parent) < 0) {
                this.content[parentN] = element;
                this.content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            // Found a parent that is less, no need to sink any further.
            else {
                break;
            }
        }
    },

    bubbleUp: function (n) {
        // Look up the target element.
        var length = this.content.length,
        element = this.content[n];

        while (true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) * 2,
            child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up 
                var child1 = this.content[child1N];
                // If it is less than our element's, we need to swap.
                if (this.cmp(child1, element) < 0) {
                    swap = child1N;
                }
            }
            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N];
                if (this.cmp(child2, (swap === null ? element: child1)) < 0) {
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
            // Otherwise, we are done.
            else {
                break;
            }
        }
    }
};

BinaryHeap = function(comparisonFunction) {
    var b = new binaryHeap(comparisonFunction);
    return {
	toArray: function() { return b.toArray(); },
	push:    function(elem) { return b.push(elem); },
        pop:     function() { return b.pop(); },
        remove:  function(elem) { return b.remove(elem); },
        size:    function() { return b.size(); }
    }
}();


exports = { 
    BinaryHeap: BinaryHeap
};
