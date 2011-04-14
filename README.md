Javascript Data Structures
==========================

If you had a traditional Computer Science education, you were probably taught about some cool data structures. And while every major language has packages that implement sophisticated data structures, few exist for Javascript.

Here are a few important and complicated data structures that work. 


SplayTrees
----------

Splay trees, or self-adjusting search trees are a simple and
efficient data structure for storing an ordered set.  The data
structure consists of a binary tree, without parent pointers, and no
additional fields.  

A splay tree allows searching, insertion, deletion, deletemin, deletemax, splitting, joining, and many other operations,
all with amortized logarithmic performance.  Since the trees adapt to
the sequence of requests, their performance on real access patterns is
typically even better.  Splay trees are described in a number of texts
and papers:

* [1] "Fundamentals of data structures in C", Horowitz, Sahni,
       and Anderson-Freed, Computer Science Press, pp 542-547.
* [2] "Data Structures and Their Algorithms", Lewis and Denenberg,
       Harper Collins, 1991, pp 243-251.
* [3] "Self-adjusting Binary Search Trees" Sleator and Tarjan,
       JACM Volume 32, No 3, July 1985, pp 652-686.
* [4] "Data Structure and Algorithm Analysis", Mark Weiss,
       Benjamin Cummins, 1992, pp 119-130.
* [5] "Data Structures, Algorithms, and Performance", Derick Wood,
       Addison-Wesley, 1993, pp 367-375.


If you need a binary search tree, try a splay tree. 


BinaryHeap
----------

Binary Heaps are another simple and efficient data structure for maintaining an ordered set of objects.

A binary heap allows: insertion, deletion, and deletemin.

