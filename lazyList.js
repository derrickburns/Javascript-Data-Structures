/**
 * @author Derrick Burns
 */

/*
 * LazyList - a list that supports insertion, deletion, contains, and deleteAll in constant time per operation and 
 *              constant space per object on the list
 *
 *      N.B. - LazyList adds properties to the objects that it manages in order to give the constant time behavior
 *
 *      We could replace this with a hash table, if the requestor were to provide a hash function on objects.  
 *      I haven't seen that used very much in Javascript yet.
 */

LazyList = function( name ) {
    this.seqNo = 0;
    this.lastGoodSeqNo = 0;
    this.list = [];
    this.name = name;
    this.indexProp = "__LL_" + this.name + "_index";
    this.seqNoProp = "__LL_" + this.name + "_seqNo";
};

LazyList.prototype = {
    /*
     * PUBLIC methods
     */
    push: function( obj ) {
        this.setIndex( obj, this.list.length );
        this.setSeqNo( obj, this.seqNo++ );
        this.list.push( obj );
        return obj;
    },

    remove: function( obj ) {
        if( this.contains( obj ) ) {
            var index = this.getIndex( obj );
            if( index !== this.list.length-1 ) {
                this.list[index] = this.list.pop();
                this.setIndex( this.list[index], index );
            } else {
                this.list.pop();
            }
            this.setIndex( obj, -1 );
            return obj;
        }
        return null;
    },

    removeAll: function() {
        this.list.length = 0;
        this.lastGoodSeqNo = this.seqNo;
    },

    contains: function ( obj ) {
        if( this.indexProp in obj ) {
            var index = this.getIndex( obj );
            if( index === -1 ) {
                return false;
            }
            var seqNo = this.getSeqNo( obj );
            return seqNo >= this.lastGoodSeqNo;
        } else {
            return false;
        }
    },

    isEmpty: function() {
        return this.list.length === 0;
    },

    pop: function() {
        return this.isEmpty() ? null : this.remove( this.list[this.list.length-1] );
    },

    toArray: function() {
        return this.list;
    },

    toString: function() {
        return this.list.toString();
    },

    /*
     * PRIVATE methods - these could be replaced with a hash table lookup, followed by a property lookup
     */

    getSeqNo : function ( obj )  {
        return obj[this.seqNoProp];
    },

    setSeqNo : function ( obj, seqNo )  {
        obj[this.seqNoProp] = seqNo;
    },

    getIndex : function ( obj ) {
        return obj[this.indexProp];
    },

    setIndex : function ( obj, index ) {
        obj[this.indexProp] = index;
    }
};


exports = { 
    LazyList: LazyList
};
