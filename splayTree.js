/*
    translated from: http://trac.lighttpd.net/trac/browser/trunk/src/splaytree.c

        An implementation of top-down splaying with sizes
       D. Sleator <sleator@cs.cmu.edu>, January 1994.
                

  This extends top-down-splay.c to maintain a size field in each node.
  This is the number of nodes in the subtree rooted there.  This makes
  it possible to efficiently compute the rank of a key.  (The rank is
  the number of nodes to the left of the given key.)  It it also
  possible to quickly find the node of a given rank.  Both of these
  operations are illustrated in the code below.  The remainder of this
  introduction is taken from top-down-splay.c.


  "Splay trees", or "self-adjusting search trees" are a simple and
  efficient data structure for storing an ordered set.  The data
  structure consists of a binary tree, without parent pointers, and no
  additional fields.  It allows searching, insertion, deletion,
  deletemin, deletemax, splitting, joining, and many other operations,
  all with amortized logarithmic performance.  Since the trees adapt to
  the sequence of requests, their performance on real access patterns is
  typically even better.  Splay trees are described in a number of texts
  and papers [1,2,3,4,5].

  The code here is adapted from simple top-down splay, at the bottom of
  page 669 of [3].  It can be obtained via anonymous ftp from
  spade.pc.cs.cmu.edu in directory /usr/sleator/public.

  The chief modification here is that the splay operation works even if the
  item being splayed is not in the tree, and even if the tree root of the
  tree is NULL.  So the line:

                              t = splay(i, t);

  causes it to search for item with key i in the tree rooted at t.  If it's
  there, it is splayed to the root.  If it isn't there, then the node put
  at the root is the last one before NULL that would have been reached in a
  normal binary search for i.  (It's a neighbor of i in the tree.)  This
  allows many other operations to be easily implemented, as shown below.

  [1] "Fundamentals of data structures in C", Horowitz, Sahni,
       and Anderson-Freed, Computer Science Press, pp 542-547.
  [2] "Data Structures and Their Algorithms", Lewis and Denenberg,
       Harper Collins, 1991, pp 243-251.
  [3] "Self-adjusting Binary Search Trees" Sleator and Tarjan,
       JACM Volume 32, No 3, July 1985, pp 652-686.
  [4] "Data Structure and Algorithm Analysis", Mark Weiss,
       Benjamin Cummins, 1992, pp 119-130.
  [5] "Data Structures, Algorithms, and Performance", Derick Wood,
       Addison-Wesley, 1993, pp 367-375.
*/



SplayTree = function (cmp) {
    this.cmp = cmp; // cmp is a function on items such that cmp( a, b ) is true IFF a <= b
};

SplayTree.prototype = {

    root: null,
    min: null,
    max: null,

    /**
     * An iterator than can tolerate insertions and deletions
     * @param {SplayTree} tree The splaytree to search.
     * @param {Object} start An object that can be stored in the splaytree.  The start of the interval.
     * @param {Object} end An object that can be stored in the splaytree. The end of the interval.
     */
    getIterator : function(start, end) {
        var last = null;        // the last value returned 
        var tree = this;
        
        return { 
            next: function() {
                var more;
                if( last !== null ) {
                    more = tree.findLeastGT(last);
                } else {
                    more = tree.findLeastGE(start);
                }
                if( ! more ) {
                    return null;
                }
                last = tree.get();
                if (tree.cmp(last, end)) {
                    return last;
                } else {
                    return null;
                }
            }
        };
    },
    
    getIter: function( elem ) {
        return this.getIterator( elem, elem );
    },
    
    applyAll: function( iter, fn, scope, except ) {
        if( ! (iter.next && typeof iter.next == "function") ) {
            iter = this.getIter( iter );
        }
        var elem;       
        while ((elem = iter.next()) !== null) {
            if (elem !== except) {
                fn.call(scope, elem);
            }
        }
    },
    
    walk: function( t, func ) {
        if( t !== null ) {
            this.walk( t.l, func );
            func( t );
            this.walk( t.r, func );
        }
    }, 
    
    toString : function() {
        var s = [];       
        var walker = function( t ) {
            s.push( t.e.toString() );
        };
        this.walk( this.root, walker );
        return s.join( ", " );
    },
    
    splay: function(e) {
        this.root = this.doSplay(this.root, e);
        return this.root;
    },

    get: function() {
        return this.root ? this.root.e: null;
    },

    getSize: function() {
        return this.nodeSize(this.root);
    },

    getRank: function() {
        if (this.root) {
            return this.root.size - this.nodeSize(this.root.r);
        } else {
            return 0;
        }
    },

    equals: function(e) {
        if (this.root === null || e === null) {
            return false;
        }
        return this.cmp(this.root.e, e) && this.cmp(e, this.root.e);
    },
    
    countIntersections : function( elem ) {
        return this.getCount( elem, elem );
    },

    getCount: function(startElem, endElem) {                
        var startFound = this.findLeastGE(startElem);
        if (!startFound) {
            return 0;
        }
        var startRank = this.getRank();
        var endFound = this.findGreatestLE(endElem);
        if (!endFound) {
            return 0;
        }
        var endRank = this.getRank();
        var count = endRank - startRank + 1;
        return count;
    },
    
    checkCount: function(startElem, endElem){
        var iter = this.getIterator( startElem, endElem );
        var count = 0;
        while (iter.next() !== null) {
            count++;
        }
        var smartCount = this.getCount( startElem, endElem);
        return smartCount === count;    
    },

    nodeSize: function(node) {
        if (node === null) {
            return 0;
        } else {
            return node.size;
        }
    },

    insertElem: function(e) {
        var tmp;

        var found = this.searchElem(e);
        if (found) {
            alert("cannot insert duplicate");
            this.searchElem(e);
        }

        if (this.root === null) {
            this.root = {
                e: e,
                l: null,
                r: null,
                size: 1
            };
            this.min = this.max = this.root;
            return;
        }

        tmp = this.splay(e);

        if (this.cmp(tmp.e, e)) { // e > tmp.e
            this.root = {
                e: e,
                l: tmp,
                r: tmp.r
            };
            if (this.root.r === null) {
                this.max = this.root;
            }
            tmp.r = null;
            tmp.size = 1 + this.nodeSize(tmp.l);
        } else { // e < tmp.e
            this.root = {
                e: e,
                l: tmp.l,
                r: tmp
            };
            if( this.root.l === null ) {
                this.min = this.root;
            }
            tmp.l = null;
            tmp.size = 1 + this.nodeSize(tmp.r);
        }
        this.root.size = 1 + this.nodeSize(this.root.l) + this.nodeSize(this.root.r);
    },

    deleteElem: function(e) {
        var tmp;
        
        if (this.root === null) {
console.log("delete elem failed" );
            return false;
        }

        var tsize = this.root.size;
        tmp = this.splay(e);

        if (this.cmp(tmp.e, e) && this.cmp(e, tmp.e)) {
            if (tmp.l === null) {
                this.root = tmp.r;
                if( this.root ) {
                    var tmpMin = this.root;
                    while(tmpMin.l !== null) {
                        tmpMin = tmpMin.l;
                    }
                    this.min = tmpMin;
                }
            } else if (tmp.r === null) {
                this.root = tmp.l;
                if( this.root ) {
                    var tmpMax = this.root;
                    while(tmpMax.r !== null) {
                        tmpMax = tmpMax.r;
                    }
                    this.max = tmpMax;
                }
            } else {
                this.root = this.doSplay(tmp.l, e);
                this.root.r = tmp.r;
            }
            if (this.root !== null) {
                this.root.size = tsize - 1;
                
            } else {
                this.min = this.max = null;
            }
            return true;
        } else {
            console.log("delete elem failed" );
            return false;
        }
    },

    /*
     * findGreatestLE  - set root to node with greatest key less than
     *          or equal to the given elem. 
     *          if no such node exists, return false; else, return true;
     */
    findGreatestLE: function(e) {
       if ((this.root === null) || (!this.cmp(this.getMin().e, e)) ) {
            return false;
        }
 
        this.splay(e);
        if (!this.cmp(this.root.e, e)) {
            // e > this.root.e
            return this.findPrev();
        } else {
            // e >= this.root.e
            for( var n = this.getNext(this.root); n !== null && this.cmp(n.e, e); n = this.getNext( this.root ) ) { 
                this.splay( n.e );
            }           
            return true;
        }       
    },
    
    same: function( n1, n2 ) {
        return this.cmp(n1, n2) && this.cmp(n2, n1);
    },

    findLeastGT: function(e) {
        var found = this.findLeastGE(e);
        if (!found) {
            return false;
        } else if (this.same(this.root.e, e)) {
            for( var n = this.getNext(this.root); n !== null && this.same(n.e, e);  n = this.getNext( this.root ) ) {
                this.splay( n.e );
            }
            if (n !== null) {
                this.splay(n.e);
            }
            return n;
        } else {
            return true;
        }
    },
    

    /*
     * findLeastGE  - set root to node with least key greater than
     *          or equal to the given elem. 
     *          if no such node exists, return false; else, return true;
     */
    findLeastGE: function(e){
        if ((this.root === null) || (!this.cmp(e, this.getMax().e))) {
            return false;
        }
 
        this.splay(e);
        if (!this.cmp(e, this.root.e)) {
            // e > this.root.e
            return this.findNext();
        } else {
            // this.root.e >= e
            for( var p = this.getPrev(this.root); p !== null && this.cmp(e, p.e); p = this.getPrev(this.root) ) { 
                this.splay( p.e );
            }
            return true;
        }
    },
    
    getPrev: function( node ){
        if (node.l === null) {
            return null;
        }
        node = node.l;
        while (node.r !== null) {
            node = node.r;
        }
        return node;
    },
    
    getNext: function( node ) {
        if( node.r === null ) {
            return null;
        }
        node = node.r;
        while (node.l !== null) {
            node = node.l;
        }
        return node;
    },

    findPrev: function() {
        if (this.root === this.getMin()) {
            return false;
        }
        var node = this.getPrev( this.root );
        this.splay(node.e);
        return true;
    },

    findNext: function() {
        if (this.root === this.getMax()) {
            return false;
        }
        var node = this.getNext( this.root );
        this.splay(node.e);
        return true;
    },

    findMax: function() {
        var max = this.getMax();
        if (max === null) {
            return false;
        } else {
            this.splay(max.e);
            return true;
        }
    },
    
    
    getMin: function(){
       return this.min;  
    },
    
    getMax: function(){
       return this.max;    
    },

    findMin: function() {
        var min = this.getMin();
        if (min === null) {
            return false;
        } else {
            this.splay(min.e);
            return true;
        }
    },

    searchElem: function(e) {
        if ((this.root === null) || (!this.cmp(this.getMin().e, e)) || (!this.cmp(e, this.getMax().e))) {
            return false;
        }
        var tmp = this.splay(e);
        return this.cmp(tmp.e, e) && this.cmp(e, tmp.e);
    },

    doSplay: function(t, e) {
        var tmp, l, r, n;

        if (t === null) {
            return null;
        }

        l = r = n = {
            l: null,
            r: null
        };
        var root_size = this.nodeSize(t);
        var left_size = 0;
        var right_size = 0;

        while (1) {
            if (this.cmp(e, t.e)) {
                if (this.cmp(t.e, e)) {
                    break;
                }

                if (t.l !== null && !this.cmp(t.l.e, e)) {
                    // rotate right
                    tmp = t.l;
                    t.l = tmp.r;
                    tmp.r = t;
                    t.size = this.nodeSize(t.l) + this.nodeSize(t.r) + 1;
                    t = tmp;
                }
                if (t.l === null) {
                    break;
                }
                // link right
                r.l = t;
                r = t;
                t = t.l;
                right_size += (1 + this.nodeSize(r.r));
            } else {
                if (t.r !== null && !this.cmp(e, t.r.e)) {
                    // rotate left
                    tmp = t.r;
                    t.r = tmp.l;
                    tmp.l = t;
                    t.size = this.nodeSize(t.l) + this.nodeSize(t.r) + 1;
                    t = tmp;
                }
                if (t.r === null) {
                    break;
                }
                // link left
                l.r = t;
                l = t;
                t = t.r;
                left_size += (1 + this.nodeSize(l.l));
            }
        }

        left_size += this.nodeSize(t.l);
        right_size += this.nodeSize(t.r);
        t.size = left_size + right_size + 1;
        /* The following two loops correct the size fields of the
        * right path from the left child of the root and the right 
        * path from the left child of the root.
        */

        l.r = null;
        r.l = null;
        for (var y = n.r; y !== null; y = y.r) {
            y.size = left_size;
            left_size -= (1 + this.nodeSize(y.l));
        }
        for (var z = n.l; z !== null; z = z.l) {
            z.size = right_size;
            right_size -= (1 + this.nodeSize(z.r));
        }

        // assemble
        l.r = t.l;
        r.l = t.r;
        t.l = n.r;
        t.r = n.l;

        return t;
    },

    checkSize: function(node) {
        if (node === null) {
            return true;
        }
        var size = this.computeSize(node);
        if (node.size !== size) {
            console.log("size bug");
            return false;
        } else {
            return true;
        }
    },

    computeSize: function(node) {
        if (node === null) {
            return 0;
        } else {
            return 1 + this.computeSize(node.l) + this.computeSize(node.r);
        }
    }
};


exports = { 
    SplayTree: SplayTree
};
