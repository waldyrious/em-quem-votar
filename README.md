The scoring table is currently the following:

```
    -2  -1   0   1   2
   +---+---+---+---+---+
-2 | 8 | 1 |-6 |-13|-20|
   +---+---+---+---+---+
-1 | 1 | 2 |-3 |-8 |-13|
   +---+---+---+---+---+
 0 |-6 | -3| 0 |-3 |-6 |
   +---+---+---+---+---+
 1 |-13|-8 |-3 | 2 | 1 |
   +---+---+---+---+---+
 2 |-20|-13|-6 | 1 | 8 |
   +---+---+---+---+---+
```

This is achieved using the following formula: 2(x*y) - 3*abs(x-y),
where x is the user's vote and y is the party's vote.
