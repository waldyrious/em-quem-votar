The scoring algorithm uses the 5-point scale for answering the questions:
* -2: Completely disagree
* -1: Tend to disagree
*  0: Neutral
*  1: Tend to agree
*  2: Completely agree

The formula for the scoring algorithm is described in the following tables
(where x is the user's choice and y is the party's choice for any given question):


Start with *x*y*, which provides a good base,
amplifying votes with matching signs
and penalizing opposite votes,
proportionately to their intensity:
```
     -2   -1    0    1    2
   ┌────┬────┬────┬────┬────┐
-2 │  4 │  2 │  0 │ -2 │ -4 │
   ├────┼────┼────┼────┼────┤
-1 │  2 │  1 │  0 │ -1 │ -2 │
   ├────┼────┼────┼────┼────┤
 0 │  0 │  0 │  0 │  0 │  0 │   Table 1:  x*y
   ├────┼────┼────┼────┼────┤
 1 │ -2 │ -1 │  0 │  1 │  2 │
   ├────┼────┼────┼────┼────┤
 2 │ -4 │ -2 │  0 │  2 │  4 │
   └────┴────┴────┴────┴────┘
```

Then subtract *abs(x-y)*, which penalizes disagreement even for scores in the same direction.
For example, (1,2) should count less than either (1,1) and (2,2).
This It also ensures that "no opinion" still correlates (slightly) negatively with any opinion.
```
     -2   -1    0    1    2
   ┌────┬────┬────┬────┬────┐
-2 │  0 │ -1 │ -2 │ -3 │ -4 │
   ├────┼────┼────┼────┼────┤
-1 │ -1 │  0 │ -1 │ -2 │ -3 │
   ├────┼────┼────┼────┼────┤
 0 │ -2 │ -1 │  0 │ -1 │ -2 │   Table 2:  -abs(x-y)
   ├────┼────┼────┼────┼────┤
 1 │ -3 │ -2 │ -1 │  0 │ -1 │
   ├────┼────┼────┼────┼────┤
 2 │ -4 │ -3 │ -2 │ -1 │  0 │
   └────┴────┴────┴────┴────┘
```

The formulas are then combined as *2(x*y) - 3*abs(x-y)*.
This uses a weight factor of 2 for the first component
and 3 for the second component,
which ensures that, for instance, (1,1) gets a heavier score
than (1,2) or (2,1) (the opposite was the case
with the simple multiplication table, or with a weight-less subtraction).
```
     -2   -1    0    1    2
   ┌────┬────┬────┬────┬────┐
-2 │  8 │  1 │ -6 │-13 │-20 │
   ├────┼────┼────┼────┼────┤
-1 │  1 │  2 │ -3 │ -8 │-13 │
   ├────┼────┼────┼────┼────┤
 0 │ -6 │ -3 │  0 │ -3 │ -6 │   Table 3:  2(x*y) - 3*abs(x-y)
   ├────┼────┼────┼────┼────┤
 1 │-13 │ -8 │ -3 │  2 │  1 │
   ├────┼────┼────┼────┼────┤
 2 │-20 │-13 │ -6 │  1 │  8 │
   └────┴────┴────┴────┴────┘
```

To prevent agreement in the neutral score from not counting positively,
we can add a bias across the board, e.g. *2(x*y) - 3*abs(x-y) + 1*:
```
     -2   -1    0    1    2
   ┌────┬────┬────┬────┬────┐
-2 │  9 │  2 │ -5 │-12 │-19 │
   ├────┼────┼────┼────┼────┤
-1 │  2 │  3 │ -2 │ -7 │-12 │
   ├────┼────┼────┼────┼────┤
 0 │ -5 │ -2 │  1 │ -2 │ -5 │   Table 4:  2(x*y) - 3*abs(x-y) + 1
   ├────┼────┼────┼────┼────┤
 1 │-12 │ -7 │ -2 │  3 │  2 │
   ├────┼────┼────┼────┼────┤
 2 │-19 │-12 │ -5 │  2 │  9 │
   └────┴────┴────┴────┴────┘
```
**Note:** This may look asymmetrical (it is),
but that's a consequence of not allowing the central axes to be zero.
Since they difference values (table 2) are subtracted from the initial table (which is symmetrical),
the whole table ends up shifted downwards.

However, it's worth noting that the difference beween any adjacent table cells is 7 accross the board.
