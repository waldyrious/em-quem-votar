The scoring algorithm uses the 5-point scale for answering the questions:
* -2: Completely disagree
* -1: Tend to disagree
*  0: Neutral
*  1: Tend to agree
*  2: Completely agree

The formula for the scoring algorithm is described in the following tables
(where x is the user's choice and y is the party's choice for any given question):


Start with x*y:
```
     -2   -1    0    1    2
   ┌────┬────┬────┬────┬────┐
-2 │  8 │  1 │ -6 │-13 │-20 │
   ├────┼────┼────┼────┼────┤
-1 │  1 │  2 │ -3 │ -8 │-13 │
   ├────┼────┼────┼────┼────┤
 0 │ -6 │ -3 │  0 │ -3 │ -6 │
   ├────┼────┼────┼────┼────┤
 1 │-13 │ -8 │ -3 │  2 │  1 │
   ├────┼────┼────┼────┼────┤
 2 │-20 │-13 │ -6 │  1 │  8 │
   └────┴────┴────┴────┴────┘
```

Then subtract abs(x-y):
```
     -2   -1    0    1    2
   ┌────┬────┬────┬────┬────┐
-2 │  0 │ -1 │ -2 │ -3 │ -4 │
   ├────┼────┼────┼────┼────┤
-1 │ -1 │  0 │ -1 │ -2 │ -3 │
   ├────┼────┼────┼────┼────┤
 0 │ -2 │ -1 │  0 │ -1 │ -2 │
   ├────┼────┼────┼────┼────┤
 1 │ -3 │ -2 │ -1 │  0 │ -1 │
   ├────┼────┼────┼────┼────┤
 2 │ -4 │ -3 │ -2 │ -1 │  0 │
   └────┴────┴────┴────┴────┘
```

The formulas are combined as 2(x*y) - 3*abs(x-y),
(using a weight factor of 2 for the first component
and 3 for the second component; this is made in order
to ensure that (1,1) gets a heavier score than (1,2) or (2,1)).

\     -2   -1    0    1    2  
   ┌────┬────┬────┬────┬────┐  
-2 │  8 │  1 │ -6 │-13 │-20 │  
   ├────┼────┼────┼────┼────┤  
-1 │  1 │  2 │ -3 │ -8 │-13 │
   ├────┼────┼────┼────┼────┤
 0 │ -6 │ -3 │  0 │ -3 │ -6 │
   ├────┼────┼────┼────┼────┤
 1 │-13 │ -8 │ -3 │  2 │  1 │
   ├────┼────┼────┼────┼────┤
 2 │-20 │-13 │ -6 │  1 │  8 │
   └────┴────┴────┴────┴────┘

