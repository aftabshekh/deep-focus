export const BOOK_CATS = [
  { id: "all", label: "All Books" },
  { id: "dsa", label: "DSA" },
  { id: "webdev", label: "Web Dev" },
  { id: "python", label: "Python" },
  { id: "cs", label: "CS Fundamentals" },
  { id: "git", label: "Git & Tools" },
  { id: "java", label: "Java" },
  { id: "os", label: "OS & Networks" },
];

export const BOOKS = [
  // ── 1. OPEN DATA STRUCTURES ──
  {
    id: "ods",
    cat: "dsa",
    emoji: "🌳",
    label: "Open Data Structures",
    coverClass: "bc-1",
    sourceTag: "Open License",
    title: "Open Data Structures",
    author: "Pat Morin — Open License",
    desc: "Complete guide to Arrays, Linked Lists, Trees, Hash Tables, Heaps and Graphs with full pseudocode.",
    chapters: [
      {
        title: "Ch 1 — Introduction & Interfaces",
        content: `INTRODUCTION & INTERFACES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The study of data structures is a study of tradeoffs.
No single data structure is best for everything.

KEY INTERFACES:
  Stack  → push(x), pop()
  Queue  → add(x), remove()
  Deque  → addFirst(x), addLast(x), removeFirst(), removeLast()
  List   → get(i), set(i,x), add(i,x), remove(i)
  USet   → add(x), remove(x), find(x)
  SSet   → add(x), remove(x), find(x) — sorted order

COMPLEXITY ANALYSIS:
  O(1)       → Constant    — array access, hash lookup
  O(log n)   → Log         — binary search, BST ops
  O(n)       → Linear      — scanning arrays
  O(n log n) → Linearithmic — merge sort, heap sort
  O(n²)      → Quadratic   — bubble sort, nested loops
  O(2ⁿ)      → Exponential — naive recursive algorithms

WHY DOES IT MATTER?
  An O(n²) algorithm on 1 million items = 1 trillion operations.
  An O(n log n) algorithm = only 20 million operations.
  Choosing the right data structure can make your program
  1000x faster!`,
      },
      {
        title: "Ch 2 — Array-Based Lists",
        content: `ARRAY-BASED LISTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ArrayStack — implements Stack & List using a backing array.

  class ArrayStack:
    a = []       # backing array
    n = 0        # number of elements

    def get(i):       return a[i]      # O(1)
    def set(i, x):    a[i] = x         # O(1)

    def add(i, x):                     # O(n - i)
      if n == len(a): resize()
      shift a[i..n-1] right by 1
      a[i] = x
      n += 1

    def remove(i):                     # O(n - i)
      x = a[i]
      shift a[i+1..n] left by 1
      n -= 1
      if len(a) >= 3*n: resize()
      return x

    def resize():
      new array of size max(1, 2*n)
      copy all elements

AMORTIZED ANALYSIS:
  Each element moved at most twice per doubling.
  Total cost over n operations = O(n)
  → O(1) amortized per operation

ArrayQueue — circular array (avoids shifting):
  head = 0, n = 0
  get(i): return a[(head + i) % len(a)]   # O(1)
  add(x): a[(head+n) % len(a)] = x        # O(1) amortized`,
      },
      {
        title: "Ch 3 — Linked Lists",
        content: `LINKED LISTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SINGLY LINKED LIST (SLList):
  Node: { data, next }

  push(x):  u=Node(x); u.next=head; head=u    O(1)
  pop():    x=head.data; head=head.next         O(1)
  add(x):   u=Node(x); tail.next=u; tail=u     O(1)

DOUBLY LINKED LIST (DLList):
  Node: { data, prev, next }

  get(i):
    if i < n/2: walk forward from head
    else:       walk backward from tail
    → O(1 + min(i, n-i))

  add(i, x):
    u = getNode(i)
    w = Node(x)
    w.prev = u.prev
    w.next = u
    w.prev.next = w
    w.next.prev = w
    n++

COMPARISON TABLE:
  Operation      | Array  | LinkedList
  get(i)         | O(1)   | O(n)
  add at head    | O(n)   | O(1)
  add at tail    | O(1)*  | O(1)
  add at middle  | O(n)   | O(n)
  Memory         | compact| extra pointer overhead
  (* amortized)

WHEN TO USE:
→ Array: frequent random access, less insertions
→ LinkedList: frequent insertions at head/tail`,
      },
      {
        title: "Ch 4 — Skiplists",
        content: `SKIPLISTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A skiplist is a linked list with extra "express lanes"
that allow O(log n) search, insert, and delete.

STRUCTURE:
  Level 3: 1 ──────────────────────── 9
  Level 2: 1 ────── 4 ──────── 7 ─── 9
  Level 1: 1 ── 2 ─ 4 ── 5 ── 7 ─── 9
  Level 0: 1 ─ 2 ─ 3 ─ 4 ─ 5 ─ 6 ─ 7 ─ 8 ─ 9

SEARCH:
  Start at highest level, move right while next < target.
  Drop down a level when you overshoot.
  Like using express → local → stop trains!

  search(x):
    u = sentinel
    for r from height down to 0:
      while u.next[r] != null and u.next[r].x < x:
        u = u.next[r]
    return u.next[0].x == x

COMPLEXITIES (expected):
→ search(x): O(log n)
→ add(x):    O(log n)
→ remove(x): O(log n)
→ Space:     O(n log n)

HEIGHT of each node determined randomly:
  Each node promoted to next level with probability 1/2
  Expected height = O(log n)`,
      },
      {
        title: "Ch 5 — Hash Tables",
        content: `HASH TABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A hash table maps keys to values using a hash function.

HASH FUNCTION:
  h(x) = x % array_size
  Maps any key to an index in [0, array_size-1]

COLLISION HANDLING:
  Chaining: each slot holds a linked list
  Open Addressing: probe for next empty slot

CHAINED HASH TABLE:
  class ChainedHashTable:
    t = array of lists
    n = 0  # total elements

    def add(x):
      if find(x): return False
      if n+1 > t.length: resize()
      t[hash(x)].append(x)
      n++

    def find(x):
      for y in t[hash(x)]:
        if y == x: return y
      return null

    def remove(x):
      t[hash(x)].remove(x)
      n--

PERFORMANCE:
→ Expected O(1) for find, add, remove
→ Worst case O(n) if all keys hash to same slot
→ Load factor α = n/m should be kept < 0.75
→ Resize when α too large (double the array)

GOOD HASH FUNCTIONS:
→ Distribute keys uniformly
→ Fast to compute
→ MD5, SHA-1 (cryptographic, slow)
→ MurmurHash, FNV (non-cryptographic, fast)`,
      },
      {
        title: "Ch 6 — Binary Trees",
        content: `BINARY TREES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A binary tree: every node has at most 2 children (left, right).

NODE STRUCTURE:
  Node: { data, left, right, parent }

TREE TRAVERSALS:

  Pre-order (root → left → right):
    def preorder(u):
      if u == null: return
      visit(u)
      preorder(u.left)
      preorder(u.right)

  In-order (left → root → right):
    → Gives SORTED order for BST!
    def inorder(u):
      if u == null: return
      inorder(u.left)
      visit(u)
      inorder(u.right)

  Post-order (left → right → root):
    def postorder(u):
      if u == null: return
      postorder(u.left)
      postorder(u.right)
      visit(u)

BST PROPERTY:
  For every node u:
  → all values in u.left  < u.data
  → all values in u.right > u.data

  find(x):
    u = root
    while u != null:
      if x < u.data: u = u.left
      elif x > u.data: u = u.right
      else: return u
    → O(height) = O(log n) balanced, O(n) worst`,
      },
      {
        title: "Ch 10 — Heaps",
        content: `HEAPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A heap is a complete binary tree satisfying the heap property.

MIN-HEAP PROPERTY:
  Every node ≤ both its children.
  → Root is always the MINIMUM element.

MAX-HEAP PROPERTY:
  Every node ≥ both its children.
  → Root is always the MAXIMUM element.

ARRAY REPRESENTATION:
  Parent of i    = (i - 1) / 2
  Left child of i  = 2*i + 1
  Right child of i = 2*i + 2

  Heap: [1, 3, 2, 7, 5, 4, 6]
  Index: 0  1  2  3  4  5  6

OPERATIONS:
  add(x):
    append x to end of array
    trickle_up(last index)    # O(log n)

  remove_min():
    save root value
    move last element to root
    trickle_down(0)           # O(log n)
    return saved value

  trickle_up(i):
    while i > 0 and a[i] < a[parent(i)]:
      swap(a[i], a[parent(i)])
      i = parent(i)

USES:
→ Priority Queue (most common)
→ Heap Sort O(n log n)
→ Dijkstra's shortest path
→ Prim's minimum spanning tree`,
      },
      {
        title: "Ch 11 — Sorting Algorithms",
        content: `SORTING ALGORITHMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPARISON TABLE:
  Algorithm    | Best       | Avg        | Worst      | Space  | Stable
  Bubble Sort  | O(n)       | O(n²)      | O(n²)      | O(1)   | Yes
  Selection    | O(n²)      | O(n²)      | O(n²)      | O(1)   | No
  Insertion    | O(n)       | O(n²)      | O(n²)      | O(1)   | Yes
  Merge Sort   | O(n log n) | O(n log n) | O(n log n) | O(n)   | Yes
  Quick Sort   | O(n log n) | O(n log n) | O(n²)      | O(logn)| No
  Heap Sort    | O(n log n) | O(n log n) | O(n log n) | O(1)   | No
  Counting     | O(n+k)     | O(n+k)     | O(n+k)     | O(k)   | Yes

MERGE SORT:
  mergeSort(a, l, r):
    if l >= r: return
    m = (l + r) / 2
    mergeSort(a, l, m)
    mergeSort(a, m+1, r)
    merge(a, l, m, r)

QUICK SORT:
  quickSort(a, lo, hi):
    if lo < hi:
      p = partition(a, lo, hi)
      quickSort(a, lo, p-1)
      quickSort(a, p+1, hi)

  partition(a, lo, hi):   # Lomuto scheme
    pivot = a[hi]
    i = lo - 1
    for j = lo to hi-1:
      if a[j] <= pivot:
        i++; swap(a[i], a[j])
    swap(a[i+1], a[hi])
    return i + 1`,
      },
      {
        title: "Ch 12 — Graphs",
        content: `GRAPHS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Graph G = (V, E) — set of vertices and edges.

REPRESENTATIONS:
  Adjacency Matrix:  O(V²) space, O(1) edge check
  Adjacency List:    O(V+E) space, O(degree) edge check

BFS (Breadth-First Search) O(V+E):
  bfs(graph, start):
    visited = {start}
    queue = [start]
    while queue:
      node = queue.dequeue()
      process(node)
      for neighbor in graph[node]:
        if neighbor not in visited:
          visited.add(neighbor)
          queue.enqueue(neighbor)

  USE: shortest path (unweighted), level traversal

DFS (Depth-First Search) O(V+E):
  dfs(graph, node, visited=set()):
    visited.add(node)
    process(node)
    for neighbor in graph[node]:
      if neighbor not in visited:
        dfs(graph, neighbor, visited)

  USE: cycle detection, topological sort,
       connected components, maze solving

DIJKSTRA O((V+E) log V):
  Find shortest path (non-negative weights)
  Uses a min-heap (priority queue)

  dist = {v: infinity for all v}
  dist[source] = 0
  heap = [(0, source)]
  while heap:
    d, u = heap.pop_min()
    for (v, weight) in neighbors(u):
      if dist[u] + weight < dist[v]:
        dist[v] = dist[u] + weight
        heap.push((dist[v], v))`,
      },
    ],
  },

  // ── 2. ALGORITHM DESIGN ──
  {
    id: "algo",
    cat: "dsa",
    emoji: "⚡",
    label: "Algorithm Design",
    coverClass: "bc-2",
    sourceTag: "Open License",
    title: "Algorithm Design & Analysis",
    author: "Open Courseware — CC License",
    desc: "Big-O, Sorting, Divide & Conquer, Greedy, DP, Graph algorithms.",
    chapters: [
      {
        title: "Ch 1 — Big-O Notation",
        content: `BIG-O NOTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Big-O describes the UPPER BOUND of an algorithm's growth rate.

THREE NOTATIONS:
  Big-O   O(g(n)) — Upper bound  (worst case)
  Omega   Ω(g(n)) — Lower bound  (best case)
  Theta   Θ(g(n)) — Tight bound  (exact)

SIMPLIFICATION RULES:
→ Drop constants:     5n    → O(n)
→ Drop lower terms:   n²+n  → O(n²)
→ Worst case wins:    if/else → take the bigger branch

COMMON COMPLEXITIES:
  O(1)       → hash lookup, array access by index
  O(log n)   → binary search, balanced BST
  O(n)       → linear scan, single loop
  O(n log n) → merge sort, heap sort
  O(n²)      → bubble sort, nested loops
  O(2ⁿ)      → subset enumeration, naive recursion
  O(n!)      → permutation generation

MASTER THEOREM: T(n) = aT(n/b) + f(n)
  where a = subproblems, b = split factor

  Case 1: f(n) = O(n^log_b(a) - ε)  → T(n) = Θ(n^log_b(a))
  Case 2: f(n) = Θ(n^log_b(a))      → T(n) = Θ(n^log_b(a) · log n)
  Case 3: f(n) = Ω(n^log_b(a) + ε)  → T(n) = Θ(f(n))

  Merge Sort: T(n)=2T(n/2)+O(n) → a=2,b=2 → O(n log n)`,
      },
      {
        title: "Ch 2 — Recursion & Recurrences",
        content: `RECURSION & RECURRENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every recursive function needs:
→ BASE CASE — stops the recursion
→ RECURSIVE CASE — moves toward base case

FACTORIAL:
  def factorial(n):
    if n == 0: return 1         # base case
    return n * factorial(n-1)   # recursive case

FIBONACCI:
  def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)
  Time: O(2ⁿ) — exponential, very slow!

CALL STACK:
  factorial(4)
    → factorial(3)
      → factorial(2)
        → factorial(1)
          → factorial(0) = 1
        = 1 * 1 = 1
      = 2 * 1 = 2
    = 3 * 2 = 6
  = 4 * 6 = 24

RECURRENCE RELATIONS:
  T(n) = T(n-1) + O(1)      → O(n)    linear recursion
  T(n) = 2T(n/2) + O(n)     → O(n log n) merge sort
  T(n) = T(n-1) + T(n-2)    → O(2ⁿ)  fibonacci (naive)`,
      },
      {
        title: "Ch 3 — Divide & Conquer",
        content: `DIVIDE & CONQUER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pattern: Split → Solve subproblems → Combine

BINARY SEARCH O(log n):
  binarySearch(arr, target, low, high):
    if low > high: return -1
    mid = (low + high) / 2
    if arr[mid] == target: return mid
    if arr[mid] < target:
      return binarySearch(arr, target, mid+1, high)
    else:
      return binarySearch(arr, target, low, mid-1)

MERGE SORT O(n log n):
  mergeSort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) / 2
    left  = mergeSort(arr[:mid])
    right = mergeSort(arr[mid:])
    return merge(left, right)

  merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
      if left[i] <= right[j]:
        result.append(left[i]); i++
      else:
        result.append(right[j]); j++
    result += left[i:] + right[j:]
    return result

QUICK SORT O(n log n) avg:
  quickSort(arr, lo, hi):
    if lo < hi:
      p = partition(arr, lo, hi)
      quickSort(arr, lo, p-1)
      quickSort(arr, p+1, hi)`,
      },
      {
        title: "Ch 4 — Greedy Algorithms",
        content: `GREEDY ALGORITHMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Greedy: at each step, choose the LOCALLY optimal choice.
Works when: greedy choice + optimal substructure.

ACTIVITY SELECTION:
  Given n activities with start[i] and end[i].
  Select maximum non-overlapping activities.

  → Sort by END time
  → Greedily pick earliest-ending non-overlapping activity

  activities.sort(key=lambda x: x.end)
  selected = [activities[0]]
  for i in range(1, n):
    if activities[i].start >= selected[-1].end:
      selected.append(activities[i])
  Time: O(n log n)

COIN CHANGE (Greedy — only works for canonical coins):
  Make change for amount A using fewest coins.
  Always pick the largest coin ≤ remaining amount.
  → Works for [1, 5, 10, 25] cents
  → FAILS for arbitrary denominations (use DP instead!)

HUFFMAN ENCODING:
  Build optimal prefix-free codes using min-heap.
  Frequent characters get shorter codes.

  while heap.size > 1:
    left  = heap.extractMin()
    right = heap.extractMin()
    parent = Node(freq = left.freq + right.freq)
    heap.insert(parent)

  Result: Total bits = Σ freq[i] * depth[i] — minimum!`,
      },
      {
        title: "Ch 5 — Dynamic Programming",
        content: `DYNAMIC PROGRAMMING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DP = Recursion + Memoization (caching results).

TWO KEY PROPERTIES:
→ Optimal Substructure
→ Overlapping Subproblems

TOP-DOWN (Memoization):
  memo = {}
  def fib(n):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]
  Time: O(n) | Space: O(n)

BOTTOM-UP (Tabulation):
  def fib(n):
    dp = [0] * (n+1)
    dp[1] = 1
    for i in range(2, n+1):
      dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
  Time: O(n) | Space: O(n) → O(1) with 2 vars

0/1 KNAPSACK:
  dp[i][w] = max value using first i items, capacity w
  if weight[i] > w:
    dp[i][w] = dp[i-1][w]
  else:
    dp[i][w] = max(dp[i-1][w],
                   dp[i-1][w-weight[i]] + value[i])
  Time: O(n*W)`,
      },
      {
        title: "Ch 6 — Graph Algorithms",
        content: `GRAPH ALGORITHMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BFS (Breadth-First Search) O(V+E):
  Use: shortest path (unweighted), level order

  bfs(graph, start):
    visited = {start}
    queue = deque([start])
    while queue:
      node = queue.popleft()
      for neighbor in graph[node]:
        if neighbor not in visited:
          visited.add(neighbor)
          queue.append(neighbor)

DFS (Depth-First Search) O(V+E):
  Use: cycle detection, topological sort, SCC

  def dfs(node, visited, graph):
    visited.add(node)
    for neighbor in graph[node]:
      if neighbor not in visited:
        dfs(neighbor, visited, graph)

DIJKSTRA O((V+E) log V):
  Use: shortest path with non-negative weights

  dist = {v: inf for v in graph}
  dist[source] = 0
  heap = [(0, source)]
  while heap:
    d, u = heappop(heap)
    for v, w in graph[u]:
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
        heappush(heap, (dist[v], v))

BELLMAN-FORD O(V*E):
  Use: shortest path with NEGATIVE weights

FLOYD-WARSHALL O(V³):
  Use: all-pairs shortest paths`,
      },
      {
        title: "Ch 7 — Backtracking",
        content: `BACKTRACKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Backtracking = DFS + pruning.
Try all possibilities, abandon invalid paths early.

TEMPLATE:
  def backtrack(state, choices):
    if isGoal(state):
      solutions.add(state)
      return
    for choice in choices:
      if isValid(state, choice):
        makeChoice(state, choice)
        backtrack(state, remaining_choices)
        undoChoice(state, choice)   # BACKTRACK

N-QUEENS PROBLEM:
  Place N queens on N×N board — none attacking each other.

  def solve(row, cols, diag1, diag2, board):
    if row == N:
      solutions.append(board.copy())
      return
    for col in range(N):
      if col not in cols and
         (row-col) not in diag1 and
         (row+col) not in diag2:
        board[row][col] = 'Q'
        solve(row+1,
              cols|{col},
              diag1|{row-col},
              diag2|{row+col},
              board)
        board[row][col] = '.'   # backtrack

PERMUTATIONS:
  def permute(nums, current=[]):
    if len(current) == len(nums):
      result.append(current[:])
      return
    for n in nums:
      if n not in current:
        current.append(n)
        permute(nums, current)
        current.pop()           # backtrack`,
      },
    ],
  },

  // ── 3. DYNAMIC PROGRAMMING ──
  {
    id: "dp",
    cat: "dsa",
    emoji: "🧩",
    label: "Dynamic Programming",
    coverClass: "bc-3",
    sourceTag: "Open License",
    title: "Dynamic Programming — Complete Guide",
    author: "Open Notes — CC License",
    desc: "Memoization, Tabulation, Knapsack, LCS, LIS, Edit Distance, Coin Change.",
    chapters: [
      {
        title: "Ch 1 — What is DP?",
        content: `WHAT IS DYNAMIC PROGRAMMING?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DP is an optimization technique — solve complex problems
by breaking them into overlapping subproblems and storing results.

TWO KEY PROPERTIES (BOTH must be present):
→ Optimal Substructure
   Optimal solution uses optimal sub-solutions
   Example: shortestPath(A,C) = shortestPath(A,B) + shortestPath(B,C)

→ Overlapping Subproblems
   Same subproblems solved multiple times
   Example: fib(5) calls fib(4) and fib(3)
            fib(4) also calls fib(3) — overlap!

WHEN TO RECOGNIZE DP:
→ "minimum / maximum" of something
→ "how many ways" to do something
→ "is it possible" to reach a state
→ String matching or transformation
→ Optimization over sequences or intervals

DP vs GREEDY:
  Greedy: pick best NOW, never revisit
  DP: explore all options, store results
  DP is slower but guaranteed optimal!

DP vs DIVIDE & CONQUER:
  D&C: subproblems are INDEPENDENT (merge sort)
  DP: subproblems OVERLAP (fibonacci)`,
      },
      {
        title: "Ch 2 — Memoization",
        content: `MEMOIZATION (TOP-DOWN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Memoization = recursion + caching results in a dictionary.

NAIVE FIBONACCI (no memo):
  def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)
  Time: O(2ⁿ) — computes fib(3) many times!

WITH MEMOIZATION:
  memo = {}
  def fib(n):
    if n <= 1: return n
    if n in memo: return memo[n]   # cache HIT
    memo[n] = fib(n-1) + fib(n-2) # cache MISS
    return memo[n]
  Time: O(n) — each value computed ONCE
  Space: O(n) cache + O(n) call stack

PYTHON SHORTCUT — @lru_cache:
  from functools import lru_cache

  @lru_cache(maxsize=None)
  def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

MEMOIZATION PATTERN:
  def solve(params):
    if params in memo: return memo[params]
    if base_case: return base_value
    result = ... recursive calls ...
    memo[params] = result
    return result`,
      },
      {
        title: "Ch 3 — Tabulation",
        content: `TABULATION (BOTTOM-UP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tabulation = iterative + fill table from base cases upward.
No recursion overhead — generally faster than memoization.

FIBONACCI TABULATION:
  def fib(n):
    if n <= 1: return n
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1
    for i in range(2, n + 1):
      dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
  Time: O(n) | Space: O(n)

SPACE OPTIMIZED (only keep last 2):
  def fib(n):
    if n <= 1: return n
    a, b = 0, 1
    for _ in range(n - 1):
      a, b = b, a + b
    return b
  Time: O(n) | Space: O(1)

CLIMBING STAIRS:
  n stairs. Can climb 1 or 2 steps at a time.
  How many ways to reach the top?

  dp[i] = dp[i-1] + dp[i-2]
  (same recurrence as Fibonacci!)

  dp[0] = 1  (one way to stay at ground)
  dp[1] = 1
  dp[2] = 2  (1+1 or 2)
  dp[3] = 3  (1+1+1, 1+2, 2+1)`,
      },
      {
        title: "Ch 4 — 0/1 Knapsack",
        content: `0/1 KNAPSACK PROBLEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEM:
  n items, each with weight[i] and value[i].
  Knapsack capacity = W.
  Maximize total value without exceeding W.
  Each item used AT MOST ONCE (0 or 1).

RECURRENCE:
  dp[i][w] = max value using first i items with capacity w

  if weight[i-1] > w:          # item too heavy — skip
    dp[i][w] = dp[i-1][w]
  else:                         # choose max of skip or take
    dp[i][w] = max(
      dp[i-1][w],              # skip item i
      dp[i-1][w-weight[i-1]] + value[i-1]  # take item i
    )

BASE CASES:
  dp[0][w] = 0  # no items → zero value
  dp[i][0] = 0  # zero capacity → zero value

CODE:
  def knapsack(weights, values, W, n):
    dp = [[0]*(W+1) for _ in range(n+1)]
    for i in range(1, n+1):
      for w in range(W+1):
        dp[i][w] = dp[i-1][w]
        if weights[i-1] <= w:
          dp[i][w] = max(dp[i][w],
            dp[i-1][w-weights[i-1]] + values[i-1])
    return dp[n][W]

  Time: O(n × W) | Space: O(n × W)
  Space can be optimized to O(W)!`,
      },
      {
        title: "Ch 5 — Longest Common Subsequence",
        content: `LONGEST COMMON SUBSEQUENCE (LCS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEM:
  Find length of longest subsequence common to both strings.
  Subsequence = chars in order, NOT necessarily contiguous.

  LCS("ABCBDAB", "BDCAB") = "BCAB" → length 4
  LCS("AGGTAB", "GXTXAYB") = "GTAB" → length 4

RECURRENCE:
  dp[i][j] = LCS length of s1[0..i-1] and s2[0..j-1]

  if s1[i-1] == s2[j-1]:
    dp[i][j] = dp[i-1][j-1] + 1    # chars match!
  else:
    dp[i][j] = max(dp[i-1][j],     # skip s1[i]
                   dp[i][j-1])      # skip s2[j]

BASE CASES:
  dp[i][0] = 0  # empty s2
  dp[0][j] = 0  # empty s1

CODE:
  def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
      for j in range(1, n+1):
        if s1[i-1] == s2[j-1]:
          dp[i][j] = dp[i-1][j-1] + 1
        else:
          dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
  Time: O(m×n) | Space: O(m×n)`,
      },
      {
        title: "Ch 6 — Edit Distance",
        content: `EDIT DISTANCE (LEVENSHTEIN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEM:
  Minimum operations to convert string s1 to string s2.
  Operations: insert, delete, replace (each costs 1).

  editDist("horse", "ros") = 3
  horse → rorse (replace h→r)
  rorse → rose  (delete r)
  rose  → ros   (delete e)

RECURRENCE:
  dp[i][j] = min edits to convert s1[0..i] to s2[0..j]

  if s1[i-1] == s2[j-1]:
    dp[i][j] = dp[i-1][j-1]    # no operation needed!
  else:
    dp[i][j] = 1 + min(
      dp[i-1][j],              # delete from s1
      dp[i][j-1],              # insert into s1
      dp[i-1][j-1]             # replace in s1
    )

BASE CASES:
  dp[i][0] = i  # delete all i chars from s1
  dp[0][j] = j  # insert all j chars into s1

CODE:
  def editDistance(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(m+1): dp[i][0] = i
    for j in range(n+1): dp[0][j] = j
    for i in range(1, m+1):
      for j in range(1, n+1):
        if s1[i-1] == s2[j-1]:
          dp[i][j] = dp[i-1][j-1]
        else:
          dp[i][j] = 1 + min(dp[i-1][j],
                              dp[i][j-1],
                              dp[i-1][j-1])
    return dp[m][n]`,
      },
      {
        title: "Ch 7 — Coin Change",
        content: `COIN CHANGE PROBLEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEM 1 — Minimum coins:
  Given coins = [1, 5, 10, 25], amount = 30
  Find minimum number of coins to make amount.
  Answer: 2 coins (25 + 5)

  dp[i] = minimum coins to make amount i

  dp[0] = 0          # 0 coins for amount 0
  dp[i] = infinity   # start with impossible

  for i from 1 to amount:
    for coin in coins:
      if coin <= i:
        dp[i] = min(dp[i], dp[i - coin] + 1)

  def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
      for coin in coins:
        if coin <= i:
          dp[i] = min(dp[i], dp[i-coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

  Time: O(amount × len(coins))

PROBLEM 2 — Number of ways:
  How many ways can you make amount using coins?

  dp[0] = 1          # one way to make 0 (use nothing)
  for coin in coins:
    for i from coin to amount:
      dp[i] += dp[i - coin]`,
      },
    ],
  },

  // ── 4. YDKJS SCOPE & CLOSURES ──
  {
    id: "ydkjs1",
    cat: "webdev",
    emoji: "🟨",
    label: "YDKJS: Scope & Closures",
    coverClass: "bc-4",
    sourceTag: "CC License",
    title: "You Don't Know JS — Scope & Closures",
    author: "Kyle Simpson — CC BY-NC-ND 4.0",
    desc: "Master JS scope, lexical environment, hoisting, closures and the module pattern.",
    chapters: [
      {
        title: "Ch 1 — What is Scope?",
        content: `WHAT IS SCOPE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scope = set of rules for variable lookup.

JS ENGINE COMPILES IN 3 STEPS:
  1. TOKENIZING  → "var a = 2;" → var | a | = | 2 | ;
  2. PARSING     → tokens → AST (Abstract Syntax Tree)
  3. CODE GEN    → AST → executable machine code

LHS vs RHS LOOKUP:
  var a = 2;        → a is LHS (assignment target)
  console.log(a);   → a is RHS (value source)

  LHS: who is the target of the assignment?
  RHS: who is the source of the value?

NESTED SCOPE:
  function outer() {
    var x = 10;
    function inner() {
      console.log(x);  // RHS lookup for x
    }
    inner();
  }

  Engine asks: "Does inner() have x?"  → No
  Engine asks: "Does outer() have x?"  → Yes! x = 10

STRICT MODE:
  "use strict";
  // LHS lookup failure → ReferenceError (not global creation)
  // Safer, prevents accidental globals`,
      },
      {
        title: "Ch 2 — Lexical Scope",
        content: `LEXICAL SCOPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lexical scope = scope defined at WRITE TIME.
Where you physically write your code = where scope lives.

SCOPE BUBBLES:
  function outer() {           // Bubble 2
    var x = 10;
    function inner() {         // Bubble 3
      var y = 20;
      console.log(x);          // finds x in Bubble 2
    }
    console.log(y);            // ReferenceError! y only in Bubble 3
  }

SCOPE CHAIN (lookup order):
  inner → outer → global
  Engine walks UP the chain until found or reaches global.

SHADOWING:
  var x = 1;                   // global x
  function foo() {
    var x = 2;                 // shadows global x
    console.log(x);            // 2
  }
  foo();
  console.log(x);              // 1 (global unchanged)

EVAL (cheats lexical scope — avoid!):
  function foo(str) {
    eval(str);                 // modifies scope at runtime
    console.log(a);
  }
  foo("var a = 2;");           // eval adds a to foo's scope!

WITH (also cheats — avoid!):
  with (obj) {                 // creates new scope from obj
    x = 5;                     // confusing — don't use!
  }`,
      },
      {
        title: "Ch 3 — Function vs Block Scope",
        content: `FUNCTION VS BLOCK SCOPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FUNCTION SCOPE (var):
  var is scoped to the nearest function.
  function foo() {
    var x = 1;
    if (true) {
      var x = 2;        // SAME x! overwrites!
      console.log(x);   // 2
    }
    console.log(x);     // 2 (not 1!)
  }

BLOCK SCOPE (let & const — ES6):
  let and const are scoped to the nearest { } block.
  function foo() {
    let x = 1;
    if (true) {
      let x = 2;        // NEW x in this block!
      console.log(x);   // 2
    }
    console.log(x);     // 1 (original x)
  }

IIFE (Immediately Invoked Function Expression):
  var result = (function() {
    var secret = 42;    // private scope
    return secret * 2;
  })();
  result;               // 84
  secret;               // ReferenceError — private!

USE let IN LOOPS:
  for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
  }
  // prints 0, 1, 2 ✓ (each iteration gets its own i)

  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
  }
  // prints 3, 3, 3 ✗ (all share same i)`,
      },
      {
        title: "Ch 4 — Hoisting",
        content: `HOISTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Declarations are processed BEFORE code runs.
It looks like declarations are "hoisted" to top of scope.

VAR HOISTING:
  console.log(a);   // undefined (no error!)
  var a = 2;
  console.log(a);   // 2

  Engine sees it as:
  var a;             // declaration hoisted
  console.log(a);   // undefined
  a = 2;            // assignment stays in place
  console.log(a);   // 2

FUNCTION DECLARATION HOISTING (fully hoisted):
  foo();             // "hello" — WORKS! Function fully hoisted.
  function foo() {
    console.log("hello");
  }

FUNCTION EXPRESSION — NOT hoisted:
  bar();             // TypeError: bar is not a function
  var bar = function() { ... };
  // Only var bar is hoisted (as undefined), not the function value

LET & CONST — TDZ (Temporal Dead Zone):
  console.log(x);   // ReferenceError: Cannot access before init
  let x = 5;

  TDZ = from start of block until declaration line.
  Accessing in TDZ throws ReferenceError (not undefined).

HOISTING ORDER:
  1. Function declarations (fully hoisted first)
  2. Variable declarations (then vars)`,
      },
      {
        title: "Ch 5 — Closure",
        content: `CLOSURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Closure = function retains access to its lexical scope
even when executing OUTSIDE that scope.

CLASSIC COUNTER:
  function makeCounter() {
    var count = 0;           // private state
    return {
      increment: function() { count++; },
      decrement: function() { count--; },
      getCount:  function() { return count; }
    };
  }
  var c = makeCounter();
  c.increment(); c.increment();
  c.getCount();  // 2
  count;         // ReferenceError — truly private!

FACTORY FUNCTION:
  function makeAdder(x) {
    return function(y) {
      return x + y;          // closes over x
    };
  }
  var add5 = makeAdder(5);
  var add10 = makeAdder(10);
  add5(3);                   // 8
  add10(3);                  // 13

THE LOOP CLOSURE PROBLEM:
  for (var i = 0; i < 5; i++) {
    setTimeout(() => console.log(i), 1000);
  }
  // prints 5,5,5,5,5 — all share same i!

  FIX 1 — IIFE per iteration:
  for (var i = 0; i < 5; i++) {
    (function(j) {
      setTimeout(() => console.log(j), 1000);
    })(i);
  }
  // prints 0,1,2,3,4 ✓

  FIX 2 — let (block scope per iteration):
  for (let i = 0; i < 5; i++) {
    setTimeout(() => console.log(i), 1000);
  }
  // prints 0,1,2,3,4 ✓`,
      },
      {
        title: "Ch 6 — Module Pattern",
        content: `MODULE PATTERN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Modules use closure to create PRIVATE state + PUBLIC API.

REVEALING MODULE PATTERN:
  var ShoppingCart = (function() {
    var _items = [];                     // private
    var _discount = 0;                   // private

    function _calcTotal() {              // private helper
      return _items.reduce((sum, item) => sum + item.price, 0);
    }

    return {
      addItem: function(item) {          // public
        _items.push(item);
      },
      removeItem: function(id) {         // public
        _items = _items.filter(i => i.id !== id);
      },
      getTotal: function() {             // public
        return _calcTotal() * (1 - _discount);
      },
      applyDiscount: function(d) {       // public
        _discount = d;
      }
    };
  })();

  ShoppingCart.addItem({ id:1, price:29.99 });
  ShoppingCart.getTotal();               // 29.99
  ShoppingCart._items;                   // undefined!

ES6 MODULE SYNTAX:
  // math.js
  const PI = 3.14159;                   // private
  export function area(r) {             // public
    return PI * r * r;
  }
  export const TAX = 0.18;             // public

  // main.js
  import { area, TAX } from './math.js';
  area(5);  // 78.53...`,
      },
    ],
  },

  // ── 5. THINK PYTHON ──
  {
    id: "thinkpy",
    cat: "python",
    emoji: "🐍",
    label: "Think Python",
    coverClass: "bc-6",
    sourceTag: "CC License",
    title: "Think Python — 2nd Edition",
    author: "Allen Downey — CC BY-NC 3.0",
    desc: "Complete Python intro — variables, functions, recursion, OOP, lists, dicts, classes.",
    chapters: [
      {
        title: "Ch 1 — The Way of the Program",
        content: `THE WAY OF THE PROGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The goal is to teach you to think like a computer scientist.

FIRST PROGRAM:
  print("Hello, World!")

TYPES OF ERRORS:
→ Syntax Error  — invalid Python (missing colon, wrong indent)
→ Runtime Error — crashes while running (divide by zero)
→ Semantic Error— runs but gives wrong result (logic bug)

BASIC INSTRUCTIONS every program has:
→ Input    — keyboard, file, network
→ Output   — screen, file, network
→ Math     — arithmetic operations
→ Conditional — check and branch
→ Repetition  — loop

PYTHON BASICS:
  # This is a comment
  print("Hello")          # output text
  print(2 + 3)            # output number: 5
  print(type(42))         # <class 'int'>
  print(type("hello"))    # <class 'str'>
  print(type(3.14))       # <class 'float'>
  print(type(True))       # <class 'bool'>`,
      },
      {
        title: "Ch 2 — Variables, Expressions, Statements",
        content: `VARIABLES, EXPRESSIONS, STATEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ASSIGNMENT:
  message = "Hello Deep Focus"
  n = 17
  pi = 3.1415926535897932

VARIABLE NAMING:
→ Letters, numbers, underscore _
→ Cannot start with a number
→ Case sensitive: myVar ≠ myvar
→ No keywords: if, for, while, class, return...

OPERATORS:
  +   addition            5 + 3  = 8
  -   subtraction         5 - 3  = 2
  *   multiplication      5 * 3  = 15
  /   true division       7 / 2  = 3.5
  //  floor division      7 // 2 = 3
  %   modulo remainder    7 % 2  = 1
  **  exponentiation      2 ** 10 = 1024

ORDER OF OPERATIONS (PEMDAS):
  2 + 3 * 4 = 14   (multiply first!)
  (2 + 3) * 4 = 20 (parens first)

MULTIPLE ASSIGNMENT:
  a, b, c = 1, 2, 3
  a, b = b, a         # swap — no temp variable needed!

STRING OPERATIONS:
  "Hello" + " " + "World"   # "Hello World"
  "Ha" * 3                   # "HaHaHa"`,
      },
      {
        title: "Ch 3 — Functions",
        content: `FUNCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A function is a named sequence of statements.

DEFINING A FUNCTION:
  def greet(name):
      """Docstring — describes the function."""
      message = "Hello, " + name + "!"
      return message

  result = greet("Alice")   # "Hello, Alice!"

WHY USE FUNCTIONS?
→ DRY — Don't Repeat Yourself
→ Break complex problems into smaller pieces
→ Easier to test and debug

DEFAULT PARAMETERS:
  def greet(name, greeting="Hello"):
      return f"{greeting}, {name}!"

  greet("Alice")          # "Hello, Alice!"
  greet("Bob", "Hi")      # "Hi, Bob!"

*args — variable positional arguments:
  def add_all(*numbers):
      return sum(numbers)

  add_all(1, 2, 3, 4, 5)  # 15

**kwargs — keyword arguments:
  def describe(**info):
      for key, value in info.items():
          print(f"{key}: {value}")

  describe(name="Alice", age=21)

LAMBDA (anonymous function):
  square = lambda x: x ** 2
  square(5)   # 25

  sorted([3,1,4,1,5], key=lambda x: -x)  # [5,4,3,1,1]`,
      },
      {
        title: "Ch 4 — Recursion",
        content: `RECURSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A function that calls itself is recursive.
MUST have a base case — otherwise infinite recursion!

FACTORIAL:
  def factorial(n):
      if n == 0: return 1           # BASE CASE
      return n * factorial(n - 1)   # RECURSIVE CASE

  factorial(5) → 5*4*3*2*1*1 = 120

FIBONACCI:
  def fib(n):
      if n <= 1: return n
      return fib(n-1) + fib(n-2)

  ⚠️ Time: O(2ⁿ) — very slow for large n!

FAST FIBONACCI (memoized):
  memo = {}
  def fib_fast(n):
      if n in memo: return memo[n]
      if n <= 1: return n
      memo[n] = fib_fast(n-1) + fib_fast(n-2)
      return memo[n]
  Time: O(n) ✓

POWER FUNCTION:
  def power(base, exp):
      if exp == 0: return 1
      if exp % 2 == 0:
          half = power(base, exp // 2)
          return half * half
      return base * power(base, exp - 1)
  Time: O(log n) ← faster than O(n)!`,
      },
      {
        title: "Ch 7 — Iteration",
        content: `ITERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHILE LOOP:
  n = 1
  while n <= 5:
      print(n)
      n += 1
  # 1 2 3 4 5

  ⚠️ Always ensure loop terminates!

FOR LOOP:
  for i in range(5):            # 0,1,2,3,4
      print(i)

  for i in range(2, 10, 2):    # start,stop,step
      print(i)                  # 2,4,6,8

  for char in "Hello":
      print(char)               # H e l l o

BREAK & CONTINUE:
  for i in range(10):
      if i == 5: break          # exit loop
      if i % 2 == 0: continue  # skip evens
      print(i)                  # 1, 3

ENUMERATE — index + value:
  fruits = ["apple", "banana", "cherry"]
  for i, fruit in enumerate(fruits):
      print(f"{i}: {fruit}")
  # 0: apple  1: banana  2: cherry

ZIP — multiple lists:
  names  = ["Alice", "Bob", "Charlie"]
  scores = [95, 87, 92]
  for name, score in zip(names, scores):
      print(f"{name}: {score}")`,
      },
      {
        title: "Ch 8 — Strings",
        content: `STRINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Strings are IMMUTABLE sequences of characters.

INDEXING & SLICING:
  s = "Hello, World!"
  s[0]       # 'H'        first char
  s[-1]      # '!'        last char
  s[0:5]     # 'Hello'    slice [start:stop]
  s[7:]      # 'World!'   from index 7 to end
  s[:5]      # 'Hello'    from start to 5
  s[::2]     # 'Hlo,Wrd!' every 2nd char
  s[::-1]    # reversed!

STRING METHODS:
  s = "  Hello World  "
  s.strip()            # "Hello World"
  s.lower()            # "  hello world  "
  s.upper()            # "  HELLO WORLD  "
  s.replace("o","0")   # "  Hell0 W0rld  "
  s.split()            # ["Hello", "World"]
  ",".join(["a","b"])  # "a,b"
  s.find("World")      # 8 (index) or -1
  s.startswith("  H")  # True
  "hello".count("l")   # 2
  "hello".capitalize() # "Hello"

F-STRINGS (Python 3.6+):
  name = "Alice"; age = 21
  f"My name is {name}, age {age}."
  f"2+2 = {2+2}"            # "2+2 = 4"
  f"{3.14159:.2f}"          # "3.14"
  f"{name!upper}"           # "ALICE"`,
      },
      {
        title: "Ch 10 — Lists",
        content: `LISTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lists are MUTABLE ordered sequences.

CREATING:
  empty   = []
  numbers = [1, 2, 3, 4, 5]
  mixed   = [1, "hello", True, 3.14]
  nested  = [[1,2], [3,4], [5,6]]

ACCESSING:
  numbers[0]       # 1      first
  numbers[-1]      # 5      last
  numbers[1:4]     # [2,3,4] slice
  numbers[::-1]    # [5,4,3,2,1] reversed

MODIFYING:
  numbers.append(6)          # add to end
  numbers.insert(0, 0)       # insert at index
  numbers.remove(3)          # remove first 3
  numbers.pop()              # remove & return last
  numbers.pop(2)             # remove at index 2
  numbers[0] = 99            # direct assignment
  numbers.extend([7, 8])     # add multiple

USEFUL METHODS:
  len(numbers)               # length
  numbers.sort()             # sort ascending (in place)
  numbers.sort(reverse=True) # sort descending
  sorted(numbers)            # return new sorted copy
  numbers.count(3)           # count occurrences
  numbers.index(4)           # find index
  3 in numbers               # True/False
  numbers.clear()            # empty the list

LIST COMPREHENSION:
  squares = [x**2 for x in range(10)]
  evens   = [x for x in range(20) if x%2==0]
  matrix  = [[i*j for j in range(3)] for i in range(3)]`,
      },
      {
        title: "Ch 11 — Dictionaries",
        content: `DICTIONARIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dictionaries store KEY-VALUE pairs. Keys must be unique & hashable.

CREATING:
  student = {
      "name": "Alice",
      "age": 21,
      "grades": [90, 85, 92],
      "active": True
  }
  empty = {}
  fromList = dict(name="Bob", age=25)

ACCESSING:
  student["name"]                  # "Alice"
  student.get("email", "N/A")      # "N/A" — safe, no KeyError
  "name" in student                # True

MODIFYING:
  student["email"] = "a@email.com" # add new key
  student["age"] = 22              # update existing
  del student["active"]            # delete key
  val = student.pop("age")         # remove & return

ITERATING:
  for key in student:
      print(key, student[key])

  for key, val in student.items():
      print(f"{key}: {val}")

  list(student.keys())             # all keys
  list(student.values())           # all values

DICT COMPREHENSION:
  squares = {x: x**2 for x in range(6)}
  inverted = {v: k for k, v in original.items()}

WORD FREQUENCY:
  words = ["apple","banana","apple","cherry"]
  freq = {}
  for w in words:
      freq[w] = freq.get(w, 0) + 1
  # {"apple":2, "banana":1, "cherry":1}`,
      },
      {
        title: "Ch 15 — Classes & Objects",
        content: `CLASSES & OBJECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A class is a blueprint. An object is an instance.

DEFINING A CLASS:
  class Point:
      """Represents a point in 2D space."""

      def __init__(self, x, y):      # constructor
          self.x = x                 # instance variables
          self.y = y

      def distance(self, other):
          dx = self.x - other.x
          dy = self.y - other.y
          return (dx**2 + dy**2) ** 0.5

      def __str__(self):             # for print()
          return f"Point({self.x}, {self.y})"

      def __repr__(self):            # for debugging
          return f"Point(x={self.x}, y={self.y})"

CREATING OBJECTS:
  p1 = Point(3, 4)
  p2 = Point(0, 0)

  p1.x                              # 3
  p1.distance(p2)                   # 5.0
  print(p1)                         # Point(3, 4)

CLASS vs INSTANCE VARIABLES:
  class Dog:
      species = "Canis familiaris"  # class variable (shared)

      def __init__(self, name):
          self.name = name          # instance variable

  d1 = Dog("Rex")
  d2 = Dog("Buddy")
  d1.species   # "Canis familiaris"  (same for all)
  d1.name      # "Rex"               (unique per object)`,
      },
      {
        title: "Ch 17 — Classes & Methods",
        content: `CLASSES & METHODS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SPECIAL (DUNDER) METHODS:
  class Rectangle:
      def __init__(self, w, h):
          self.width = w
          self.height = h

      def __str__(self):         # print(r)
          return f"Rect({self.width}×{self.height})"

      def __eq__(self, other):   # r1 == r2
          return (self.width == other.width and
                  self.height == other.height)

      def __lt__(self, other):   # r1 < r2 (for sorting)
          return self.area() < other.area()

      def __add__(self, other):  # r1 + r2
          return Rectangle(self.width + other.width,
                            max(self.height, other.height))

      def area(self):
          return self.width * self.height

  r1 = Rectangle(4, 5)
  r2 = Rectangle(3, 6)
  r1.area()          # 20
  r1 == r2           # False
  r1 < r2            # False (20 < 18? No)
  sorted([r2, r1])   # [r2, r1] (by area)

CLASS METHOD & STATIC METHOD:
  class Circle:
      PI = 3.14159

      def __init__(self, r):
          self.radius = r

      @classmethod
      def from_diameter(cls, d):    # alternative constructor
          return cls(d / 2)

      @staticmethod
      def is_valid_radius(r):       # utility, no self/cls
          return r > 0`,
      },
      {
        title: "Ch 18 — Inheritance",
        content: `INHERITANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inheritance: child class gets all attributes & methods of parent.

BASE CLASS:
  class Animal:
      def __init__(self, name, sound):
          self.name = name
          self.sound = sound

      def speak(self):
          return f"{self.name} says {self.sound}!"

      def __str__(self):
          return f"Animal({self.name})"

CHILD CLASSES:
  class Dog(Animal):
      def __init__(self, name):
          super().__init__(name, "Woof")   # call parent

      def fetch(self, item):
          return f"{self.name} fetches the {item}!"

  class Cat(Animal):
      def __init__(self, name):
          super().__init__(name, "Meow")

      def purr(self):
          return f"{self.name} purrs..."

POLYMORPHISM:
  animals = [Dog("Rex"), Cat("Whiskers"), Dog("Buddy")]
  for a in animals:
      print(a.speak())             # each calls own speak()!
  # Rex says Woof!
  # Whiskers says Meow!
  # Buddy says Woof!

ISINSTANCE & ISSUBCLASS:
  isinstance(rex, Dog)      # True
  isinstance(rex, Animal)   # True — Dog IS-A Animal
  issubclass(Dog, Animal)   # True

MULTIPLE INHERITANCE:
  class FlyingFish(Fish, Bird):
      pass    # gets methods from both!`,
      },
    ],
  },

  // ── 6. SYSTEM DESIGN PRIMER ──
  {
    id: "sysdesign",
    cat: "cs",
    emoji: "🏗️",
    label: "System Design",
    coverClass: "bc-7",
    sourceTag: "MIT License",
    title: "System Design Primer",
    author: "Donne Martin — MIT License",
    desc: "CAP theorem, Load Balancing, Caching, Sharding, Microservices.",
    chapters: [
      {
        title: "Ch 1 — How to Approach",
        content: `HOW TO APPROACH SYSTEM DESIGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP-BY-STEP FRAMEWORK:

Step 1 — Clarify Requirements (5 min)
→ Functional:    what does the system DO?
→ Non-functional: scale, availability, latency?
→ Constraints:   users/day, req/sec, data size?

Step 2 — Estimation (back of envelope)
→ Traffic:  100M users × 10 req/day = 1B req/day
            1B / 86400 ≈ 12,000 requests/sec
→ Storage:  100M users × 500 bytes = 50GB user data
→ Bandwidth: 12K rps × 1KB = 12MB/s read

Step 3 — High-Level Design
  Client → CDN → Load Balancer → App Servers
                              → Cache (Redis)
                              → Database

Step 4 — Deep Dive on Critical Components
→ Which database? SQL vs NoSQL?
→ Caching strategy?
→ How to scale horizontally?

Step 5 — Identify Bottlenecks
→ Single points of failure
→ Data replication strategy
→ Monitoring and alerting`,
      },
      {
        title: "Ch 2 — Scalability",
        content: `SCALABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VERTICAL SCALING (Scale Up):
→ Add more CPU, RAM, SSD to existing server
→ Simple, but has limits and single point of failure
→ Expensive at high end

HORIZONTAL SCALING (Scale Out):
→ Add more servers
→ Need load balancer to distribute traffic
→ Requires stateless application servers
→ Used by Google, Facebook, Amazon

STATELESS vs STATEFUL:
  Stateful: server stores user session data
  → Problem: user tied to specific server
  Stateless: server stores no user data
  → Session data in Redis/DB — any server can handle request
  → Easier to scale!

LOAD BALANCING:
  Algorithms:
  → Round Robin: rotate through servers
  → Least Connections: send to least-busy server
  → IP Hash: same client → same server

DATABASE SCALING:
  Read Replicas: write to master, read from replicas
  Sharding: split data across multiple DB servers
  → Horizontal partition by user_id % num_shards
  Caching: Redis/Memcached in front of DB`,
      },
      {
        title: "Ch 3 — CAP Theorem",
        content: `CAP THEOREM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Brewer (2000): A distributed system can guarantee
only 2 of these 3 properties simultaneously:

C — CONSISTENCY
  Every read receives the most recent write.
  All nodes see the same data at the same time.

A — AVAILABILITY
  Every request receives a response (not necessarily latest).
  System is always up and responds.

P — PARTITION TOLERANCE
  System continues operating despite network partitions.
  Some messages between nodes dropped or delayed.

REAL-WORLD CHOICES:
  System       | Chooses | Reason
  MySQL        | CP      | ACID transactions
  MongoDB      | CP      | Tunable consistency
  PostgreSQL   | CP      | Strong consistency
  Cassandra    | AP      | High availability
  DynamoDB     | AP      | Available, eventual consistency
  Redis        | CP      | In-memory, fast

NOTE: P (partition tolerance) is REQUIRED in real networks.
Real choice is always: CP or AP?

CP: choose consistency over availability
    → Better for banking, inventory, user auth

AP: choose availability over consistency
    → Better for social media likes, view counts, DNS`,
      },
      {
        title: "Ch 4 — Load Balancers",
        content: `LOAD BALANCERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Load balancers distribute traffic across multiple servers.
Prevents any one server from being overwhelmed.

LOAD BALANCING ALGORITHMS:
  Round Robin:
    req1→server1, req2→server2, req3→server3, req4→server1...
    Simple. Works when all servers are equal.

  Weighted Round Robin:
    High-capacity servers get more traffic.
    server1(weight=3), server2(weight=1)

  Least Connections:
    Send to server with fewest active connections.
    Best for long-lived connections.

  IP Hash:
    hash(client_IP) % num_servers
    Same client always goes to same server.
    Useful for session persistence.

  Random:
    Pick randomly. Works surprisingly well at scale.

LAYER 4 vs LAYER 7:
  L4 (Transport Layer):
    Route based on IP + TCP/UDP port.
    Faster. Less flexible.

  L7 (Application Layer):
    Route based on HTTP headers, URL, cookies.
    Can route /api → API servers, /static → CDN.
    More intelligent. Slightly slower.

NGINX Load Balancer Config:
  upstream backend {
    server backend1.example.com weight=3;
    server backend2.example.com weight=1;
    least_conn;
  }`,
      },
      {
        title: "Ch 5 — Caching",
        content: `CACHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cache = fast temporary storage (RAM).
Reduces database load dramatically.

CACHING STRATEGIES:

Cache-Aside (Lazy Loading) — most common:
  1. App checks cache for data
  2. Cache MISS → query database
  3. Store result in cache
  4. Return data
  + Only load data when needed
  - First request always slow (cold cache)

Write-Through:
  Write to cache AND database simultaneously.
  + Cache always fresh (no stale data)
  - Every write goes to DB (slower writes)

Write-Back (Write-Behind):
  Write to cache only, async flush to DB later.
  + Very fast writes
  - Risk of data loss if cache fails!

Read-Through:
  Cache sits between app and DB.
  Cache handles all reads automatically.
  + Transparent to application
  - Higher cache miss cost

EVICTION POLICIES:
  LRU  (Least Recently Used)    — evict oldest accessed
  LFU  (Least Frequently Used)  — evict least popular
  FIFO (First In First Out)     — evict oldest added
  TTL  (Time To Live)           — expire after fixed time

REDIS vs MEMCACHED:
  Redis:      supports strings, lists, sets, hashes
  Memcached:  simple key-value only, faster for strings`,
      },
      {
        title: "Ch 6 — Databases",
        content: `DATABASES: SQL vs NoSQL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SQL (RELATIONAL):
→ Structured data with fixed schema
→ ACID transactions (Atomicity, Consistency, Isolation, Durability)
→ Powerful JOINs, complex queries
→ Vertical scaling (mostly)
→ Examples: MySQL, PostgreSQL, SQLite, Oracle

NoSQL TYPES:
  Document Store:
    → MongoDB, CouchDB
    → JSON-like documents
    → USE: user profiles, CMS, catalogs

  Key-Value Store:
    → Redis, DynamoDB
    → Simple get/set by key
    → USE: sessions, cache, shopping carts

  Wide-Column Store:
    → Cassandra, HBase
    → Columns grouped into families
    → USE: time series, IoT, analytics

  Graph Database:
    → Neo4j, Amazon Neptune
    → Nodes and edges
    → USE: social networks, recommendations, fraud detection

WHEN TO USE:
  SQL   → structured data, complex queries, ACID needed,
          relational data, reporting
  NoSQL → massive scale, flexible schema, simple queries,
          horizontal scaling needed

SHARDING (horizontal partitioning):
  Split data across multiple DB servers.
  Shard key: user_id % num_shards
  → Spread load, increase capacity`,
      },
      {
        title: "Ch 7 — Message Queues",
        content: `MESSAGE QUEUES & ASYNC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Message queues decouple producers and consumers.
Enable async processing — don't block users!

HOW IT WORKS:
  Producer → [Queue] → Consumer

  User uploads photo:
  1. API receives upload → IMMEDIATELY returns 200 OK
  2. Puts job in queue: {task: "resize_photo", id: 123}
  3. Worker picks job from queue → resizes photo
  4. User gets notification when done

BENEFITS:
→ Producers don't wait for consumers
→ Consumers process at their own rate
→ If consumer crashes, job stays in queue (retry!)
→ Easy to scale consumers independently

POPULAR TOOLS:
  RabbitMQ  — traditional message broker, reliable
  Apache Kafka — high-throughput streaming, persistent log
  AWS SQS   — managed queue service
  Redis     — can be used as simple queue

USE CASES:
→ Email sending (don't make user wait)
→ Image/video processing
→ Order processing
→ Notifications
→ Data pipeline between services

KAFKA vs RabbitMQ:
  Kafka:      high throughput, persistent, replay messages
  RabbitMQ:   lower latency, complex routing, acknowledgment`,
      },
    ],
  },

  // ── 7. PRO GIT ──
  {
    id: "progit",
    cat: "git",
    emoji: "🔧",
    label: "Pro Git",
    coverClass: "bc-8",
    sourceTag: "CC License",
    title: "Pro Git — 2nd Edition",
    author: "Scott Chacon & Ben Straub — CC BY-NC-SA 3.0",
    desc: "Official Git book — basics, branching, rebasing, internals, GitHub.",
    chapters: [
      {
        title: "Ch 1 — Getting Started",
        content: `GETTING STARTED WITH GIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT IS VERSION CONTROL?
A system that records changes to files over time.
You can recall specific versions later.

WHY GIT?
→ Distributed — every developer has full history
→ Fast — most operations are local
→ Branching — lightweight, encourages experimentation
→ Industry standard — used by everyone

FIRST-TIME SETUP:
  git config --global user.name  "Your Name"
  git config --global user.email "you@email.com"
  git config --global core.editor "code --wait"
  git config --list                 # view all config

THREE STATES OF FILES:
  Modified   → file changed but not staged
  Staged     → marked to go in next commit
  Committed  → safely stored in local DB

THE THREE AREAS:
  Working Directory → Staging Area → Repository (.git)

  git add    → moves Working Directory to Staging Area
  git commit → moves Staging Area to Repository`,
      },
      {
        title: "Ch 2 — Git Basics",
        content: `GIT BASICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ESSENTIAL COMMANDS:
  git init              # initialize new repo
  git clone <url>       # clone remote repo
  git status            # check working tree state
  git add <file>        # stage specific file
  git add .             # stage ALL changes
  git add -p            # stage interactively (hunks)
  git commit -m "msg"   # commit staged changes
  git commit --amend    # fix last commit
  git log               # view history
  git log --oneline --graph --all
  git diff              # unstaged changes
  git diff --staged     # staged vs last commit

UNDOING THINGS:
  git restore <file>    # discard working dir changes
  git restore --staged <file>  # unstage file
  git revert <hash>     # undo commit (safe)
  git reset --soft HEAD~1   # undo commit, keep staged
  git reset --hard HEAD~1   # undo commit, discard ⚠️

IGNORING FILES (.gitignore):
  node_modules/
  .env
  *.log
  dist/
  .DS_Store

TAGGING:
  git tag v1.0.0                    # lightweight tag
  git tag -a v1.0.0 -m "Release"   # annotated tag
  git push origin --tags            # push all tags`,
      },
      {
        title: "Ch 3 — Git Branching",
        content: `GIT BRANCHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A branch is a lightweight movable pointer to a commit.
HEAD points to the currently checked-out branch.

BRANCH COMMANDS:
  git branch                    # list local branches
  git branch -a                 # list all (incl. remote)
  git branch feature-x          # create branch
  git checkout feature-x        # switch to branch
  git checkout -b feature-x     # create + switch
  git switch -c feature-x       # modern syntax
  git branch -d feature-x       # delete merged branch
  git branch -D feature-x       # force delete

FAST-FORWARD MERGE:
  main ─── A ─── B
                  ↑ feature
  git merge feature → just moves main pointer to B
  No merge commit needed!

THREE-WAY MERGE:
  main ─── A ─── B ─── C
                  └─── D ─── E (feature)
  Creates merge commit M with 2 parents:
  main ─── A ─── B ─── C ─── M
                  └─── D ─── E ─┘

REBASING:
  git checkout feature
  git rebase main
  → Replay feature commits on top of latest main
  → Creates cleaner, linear history
  ⚠️ NEVER rebase shared public branches!

MERGE CONFLICTS:
  git status               # see conflicted files
  # edit files, resolve <<< === >>>
  git add <resolved-files>
  git commit               # complete merge`,
      },
      {
        title: "Ch 5 — Distributed Git",
        content: `DISTRIBUTED GIT WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REMOTE COMMANDS:
  git remote -v                    # list remotes
  git remote add origin <url>      # add remote
  git fetch origin                 # download changes (no merge)
  git pull origin main             # fetch + merge
  git push origin main             # push to remote
  git push -u origin feature       # push new branch

TEAM WORKFLOW (Feature Branch):
  1. git checkout -b feature-login  # create branch
  2. make commits...
  3. git push origin feature-login  # push branch
  4. Open Pull Request on GitHub
  5. Code review by teammates
  6. Merge into main after approval
  7. git branch -d feature-login    # cleanup

PULL REQUEST ETIQUETTE:
→ Keep PRs small and focused (< 400 lines)
→ Write descriptive PR title and description
→ Reference related issues (#42)
→ Respond to review comments quickly
→ Don't force-push after review starts

FORK WORKFLOW (open source):
  1. Fork repo on GitHub (your copy)
  2. git clone your-fork
  3. git remote add upstream original-repo
  4. Create feature branch, make changes
  5. git push origin feature
  6. Open PR from your fork to original
  7. Sync fork: git fetch upstream && git merge upstream/main`,
      },
      {
        title: "Ch 7 — Git Tools",
        content: `GIT TOOLS (ADVANCED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GIT STASH (temporary shelf):
  git stash                   # save dirty state
  git stash list              # list stashes
  git stash pop               # restore latest
  git stash apply stash@{2}  # apply specific
  git stash drop stash@{0}   # delete stash

GIT RESET:
  git reset --soft  HEAD~1   # undo commit, keep staged
  git reset --mixed HEAD~1   # undo commit + unstage (default)
  git reset --hard  HEAD~1   # undo commit + discard ⚠️

GIT REVERT (safe undo for shared history):
  git revert <commit-hash>   # creates new undo commit
  Never rewrites history → safe for pushed commits!

INTERACTIVE REBASE (clean up commits):
  git rebase -i HEAD~4   # edit last 4 commits
  Commands:
  pick   — keep as is
  reword — change message
  edit   — amend commit
  squash — merge into previous
  fixup  — merge, discard message
  drop   — delete commit

CHERRY-PICK:
  git cherry-pick <hash>     # copy specific commit here

GIT BISECT (find bug commit):
  git bisect start
  git bisect bad             # current = has bug
  git bisect good v1.0       # this was fine
  # Git binary searches → test each step
  git bisect good / bad
  git bisect reset           # done`,
      },
      {
        title: "Ch 9 — Git Internals",
        content: `GIT INTERNALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Git is a content-addressable filesystem with 4 object types.

OBJECT TYPES (stored in .git/objects/):
  blob    → file contents
  tree    → directory (names + blob references)
  commit  → snapshot (tree + metadata + parent hash)
  tag     → named pointer to commit

SHA-1 HASHING:
  Every object gets a 40-char SHA-1 of its content.
  git hash-object -w myfile.txt   # store + get SHA
  git cat-file -p <SHA>           # inspect object

COMMIT OBJECT STRUCTURE:
  commit abc123...
    tree def456...
    parent ghi789...
    author Alice <a@email.com> timestamp
    committer Alice <a@email.com> timestamp

    Commit message here

REFS (.git/refs/):
  branches  → .git/refs/heads/main     (= last commit SHA)
  tags      → .git/refs/tags/v1.0
  remotes   → .git/refs/remotes/origin/main
  HEAD      → .git/HEAD (points to current branch)

DATA FLOW:
  git add file:
    → creates blob object for file content
    → updates staging area (index)

  git commit:
    → creates tree objects for directories
    → creates commit object pointing to tree
    → moves branch ref forward to new commit

PACKFILES:
  Git compresses old objects into packfiles.
  git gc → triggers garbage collection + packing`,
      },
    ],
  },

  // ── 8. JAVA PROGRAMMING ──
  {
    id: "java",
    cat: "java",
    emoji: "☕",
    label: "Java Programming",
    coverClass: "bc-3",
    sourceTag: "Open License",
    title: "Java Programming — Core Concepts",
    author: "Open Java Docs — Free License",
    desc: "OOP in Java — classes, interfaces, inheritance, collections, Java 8 streams.",
    chapters: [
      {
        title: "Ch 1 — Java Basics",
        content: `JAVA BASICS & SYNTAX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HELLO WORLD:
  public class HelloWorld {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
      }
  }

DATA TYPES:
  int     myInt    = 42;
  long    myLong   = 10000000000L;
  double  myDouble = 3.14;
  char    myChar   = 'A';
  boolean myBool   = true;
  String  myStr    = "Hello";

OPERATORS:
  +  -  *  /  %     # arithmetic
  ==  !=  <  >  <=  >=  # comparison
  &&  ||  !         # logical
  ++  --            # increment/decrement
  +=  -=  *=  /=    # assignment

CONTROL FLOW:
  if (x > 0) {
      System.out.println("positive");
  } else if (x < 0) {
      System.out.println("negative");
  } else {
      System.out.println("zero");
  }

  for (int i = 0; i < 10; i++) {
      System.out.println(i);
  }

  while (condition) { ... }

  for (String item : array) {   // enhanced for loop
      System.out.println(item);
  }`,
      },
      {
        title: "Ch 2 — OOP: Classes & Objects",
        content: `OOP: CLASSES & OBJECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  public class Person {
      // Fields (instance variables)
      private String name;
      private int age;

      // Constructor
      public Person(String name, int age) {
          this.name = name;
          this.age = age;
      }

      // Getters
      public String getName() { return name; }
      public int getAge()     { return age; }

      // Setters
      public void setName(String name) {
          this.name = name;
      }

      // Method
      public String greet() {
          return "Hi, I'm " + name + ", age " + age;
      }

      // toString
      @Override
      public String toString() {
          return "Person{name=" + name + ", age=" + age + "}";
      }
  }

  // Usage
  Person p = new Person("Alice", 21);
  p.greet();        // "Hi, I'm Alice, age 21"
  p.getName();      // "Alice"
  System.out.println(p);  // Person{name=Alice, age=21}`,
      },
      {
        title: "Ch 3 — Inheritance & Polymorphism",
        content: `INHERITANCE & POLYMORPHISM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  public class Animal {
      protected String name;

      public Animal(String name) {
          this.name = name;
      }

      public String speak() {
          return name + " makes a sound";
      }

      public String toString() {
          return "Animal(" + name + ")";
      }
  }

  public class Dog extends Animal {
      public Dog(String name) {
          super(name);          // call parent constructor
      }

      @Override
      public String speak() {   // override parent method
          return name + " says: Woof!";
      }

      public String fetch(String item) {
          return name + " fetches the " + item;
      }
  }

  public class Cat extends Animal {
      public Cat(String name) { super(name); }

      @Override
      public String speak() {
          return name + " says: Meow!";
      }
  }

  // POLYMORPHISM
  Animal[] animals = {new Dog("Rex"), new Cat("Luna"), new Dog("Max")};
  for (Animal a : animals) {
      System.out.println(a.speak());  // calls correct speak()!
  }
  // Rex says: Woof!
  // Luna says: Meow!
  // Max says: Woof!`,
      },
      {
        title: "Ch 4 — Interfaces & Abstract Classes",
        content: `INTERFACES & ABSTRACT CLASSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INTERFACE — contract of behavior:
  public interface Drawable {
      void draw();                       // abstract by default
      default void print() {             // default method (Java 8+)
          System.out.println("Printing: " + this);
      }
      static void info() {               // static method
          System.out.println("Drawable interface");
      }
  }

  public interface Resizable {
      void resize(double factor);
  }

  // Class can implement MULTIPLE interfaces
  public class Circle implements Drawable, Resizable {
      private double radius;
      public Circle(double r) { this.radius = r; }

      @Override
      public void draw() {
          System.out.println("Drawing circle r=" + radius);
      }
      @Override
      public void resize(double f) { radius *= f; }
  }

ABSTRACT CLASS — partial implementation:
  public abstract class Shape {
      String color;

      abstract double area();            // MUST override

      public void describe() {           // concrete method
          System.out.println(color + " shape, area=" + area());
      }
  }

  public class Rectangle extends Shape {
      double width, height;
      Rectangle(double w, double h) { width=w; height=h; }

      @Override
      public double area() { return width * height; }
  }`,
      },
      {
        title: "Ch 5 — Exception Handling",
        content: `EXCEPTION HANDLING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXCEPTION HIERARCHY:
  Throwable
    ├── Error (JVM errors — don't catch)
    └── Exception
          ├── RuntimeException (unchecked)
          │     ├── NullPointerException
          │     ├── ArrayIndexOutOfBoundsException
          │     └── IllegalArgumentException
          └── IOException (checked — must handle)

TRY-CATCH-FINALLY:
  try {
      int result = 10 / 0;             // throws ArithmeticException
      String s = null;
      s.length();                      // throws NullPointerException
  } catch (ArithmeticException e) {
      System.out.println("Math error: " + e.getMessage());
  } catch (NullPointerException e) {
      System.out.println("Null error: " + e.getMessage());
  } catch (Exception e) {             // catch all others
      e.printStackTrace();
  } finally {
      System.out.println("Always runs!");  // cleanup code
  }

CUSTOM EXCEPTION:
  public class InvalidAgeException extends Exception {
      public InvalidAgeException(String message) {
          super(message);
      }
  }

  public void setAge(int age) throws InvalidAgeException {
      if (age < 0 || age > 150) {
          throw new InvalidAgeException("Age " + age + " is invalid");
      }
      this.age = age;
  }

TRY-WITH-RESOURCES (auto-close):
  try (FileReader fr = new FileReader("file.txt")) {
      // use fr — automatically closed when done!
  } catch (IOException e) { ... }`,
      },
      {
        title: "Ch 6 — Collections Framework",
        content: `COLLECTIONS FRAMEWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OVERVIEW:
  ArrayList      → dynamic array, O(1) get
  LinkedList     → O(1) insert/delete at head/tail
  HashSet        → no duplicates, O(1) ops
  TreeSet        → sorted set, O(log n) ops
  HashMap        → key-value, O(1) get/put
  TreeMap        → sorted by key, O(log n)
  PriorityQueue  → min-heap by default
  ArrayDeque     → stack + queue operations

ARRAYLIST:
  List<String> list = new ArrayList<>();
  list.add("Alice");
  list.add("Bob");
  list.get(0);              // "Alice"
  list.size();              // 2
  list.contains("Bob");     // true
  list.remove("Alice");
  list.sort(Comparator.naturalOrder());

HASHMAP:
  Map<String, Integer> scores = new HashMap<>();
  scores.put("Alice", 95);
  scores.put("Bob", 87);
  scores.get("Alice");            // 95
  scores.getOrDefault("Eve", 0);  // 0 — safe!
  scores.containsKey("Bob");      // true

  for (Map.Entry<String, Integer> e : scores.entrySet()) {
      System.out.println(e.getKey() + ": " + e.getValue());
  }

PRIORITY QUEUE (min-heap):
  PriorityQueue<Integer> pq = new PriorityQueue<>();
  pq.add(5); pq.add(1); pq.add(3);
  pq.poll();   // 1 (smallest!)
  pq.poll();   // 3
  pq.peek();   // 5 (don't remove)`,
      },
      {
        title: "Ch 8 — Java 8 Lambdas & Streams",
        content: `JAVA 8 — LAMBDAS & STREAMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAMBDA EXPRESSIONS:
  // Old way
  Comparator<String> c = new Comparator<String>() {
      public int compare(String a, String b) {
          return a.compareTo(b);
      }
  };

  // Lambda way
  Comparator<String> c = (a, b) -> a.compareTo(b);
  Runnable r = () -> System.out.println("Hello!");
  Predicate<Integer> isEven = n -> n % 2 == 0;
  Function<String, Integer> len = s -> s.length();

STREAMS — functional pipeline:
  List<Integer> nums = Arrays.asList(1,2,3,4,5,6,7,8,9,10);

  int sumEvenSquares = nums.stream()
      .filter(n -> n % 2 == 0)    // 2,4,6,8,10
      .map(n -> n * n)             // 4,16,36,64,100
      .reduce(0, Integer::sum);    // 220

  List<String> names = List.of("Alice","Bob","Charlie","Dave");
  List<String> result = names.stream()
      .filter(s -> s.length() > 3) // Alice, Charlie, Dave
      .sorted()                     // Alice, Charlie, Dave
      .map(String::toUpperCase)     // ALICE, CHARLIE, DAVE
      .collect(Collectors.toList());

STREAM OPERATIONS:
  // Intermediate (lazy):
  filter(), map(), flatMap(), distinct(),
  sorted(), limit(), skip(), peek()

  // Terminal (eager):
  collect(), forEach(), reduce(),
  count(), sum(), min(), max(),
  findFirst(), anyMatch(), allMatch()

OPTIONAL:
  Optional<String> opt = Optional.of("hello");
  opt.isPresent();           // true
  opt.get();                 // "hello"
  opt.orElse("default");     // "hello" (or "default" if empty)`,
      },
      {
        title: "Ch 9 — Multithreading",
        content: `MULTITHREADING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATING THREADS:
  // Method 1: extend Thread
  class MyThread extends Thread {
      public void run() {
          System.out.println("Thread running: " + getName());
      }
  }
  new MyThread().start();

  // Method 2: implement Runnable (preferred)
  class MyTask implements Runnable {
      public void run() {
          System.out.println("Task running");
      }
  }
  new Thread(new MyTask()).start();

  // Method 3: Lambda (Java 8+)
  new Thread(() -> System.out.println("Lambda thread")).start();

SYNCHRONIZATION — prevent race conditions:
  class Counter {
      private int count = 0;

      public synchronized void increment() {
          count++;          // only one thread at a time
      }

      public synchronized int getCount() {
          return count;
      }
  }

EXECUTOR SERVICE (thread pool):
  ExecutorService pool = Executors.newFixedThreadPool(4);

  for (int i = 0; i < 10; i++) {
      final int taskId = i;
      pool.submit(() -> {
          System.out.println("Task " + taskId);
      });
  }
  pool.shutdown();
  pool.awaitTermination(1, TimeUnit.MINUTES);

VOLATILE:
  private volatile boolean running = true;
  // ensures visibility across threads`,
      },
    ],
  },

  // ── 9. OPERATING SYSTEMS ──
  {
    id: "os",
    cat: "os",
    emoji: "⚙️",
    label: "Operating Systems",
    coverClass: "bc-1",
    sourceTag: "Open Notes",
    title: "Operating Systems — Complete Guide",
    author: "Open Courseware — CC License",
    desc: "Processes, threads, CPU scheduling, memory management, deadlocks, virtual memory.",
    chapters: [
      {
        title: "Ch 1 — Introduction to OS",
        content: `INTRODUCTION TO OPERATING SYSTEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

An OS is software that manages hardware and software resources.
It acts as an intermediary between programs and hardware.

OS ROLES:
→ Resource Manager — CPU, memory, I/O devices
→ Extended Machine  — hides hardware complexity
→ Security Guardian — protect processes from each other

TYPES OF OS:
  Batch OS      → jobs run in batches, no interaction
  Time-Sharing  → multiple users, CPU switches quickly
  Real-Time     → strict time constraints (medical, cars)
  Distributed   → multiple networked computers
  Mobile        → iOS, Android — battery-optimized

KERNEL vs USER SPACE:
  Kernel Space: OS code runs with full hardware access
  User Space:   Applications run with limited access

  System Call: how user programs request kernel services
  Examples: read(), write(), fork(), exec(), malloc()

COMPUTER STARTUP (Boot Process):
  1. Power on → BIOS/UEFI runs POST
  2. BIOS finds bootloader on disk
  3. Bootloader loads OS kernel into memory
  4. Kernel initializes devices, starts processes
  5. Login manager appears`,
      },
      {
        title: "Ch 2 — Processes",
        content: `PROCESSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A process = program in execution.

PROCESS CONTAINS:
→ Code (text segment)
→ Data (global variables)
→ Stack (local vars, function calls)
→ Heap (dynamic memory allocation)
→ PCB (Process Control Block)

PCB STORES:
→ PID (process identifier)
→ Process state
→ CPU registers (PC, SP, etc.)
→ CPU scheduling info (priority)
→ Memory management info
→ Open file list

PROCESS STATES:
  New → Ready → Running → Waiting → Ready → Terminated

  Ready→Running:    scheduler picks it (dispatch)
  Running→Waiting:  I/O request, wait for event
  Waiting→Ready:    I/O complete, event occurs
  Running→Ready:    preempted (time quantum expired)
  Running→Terminated: exit() called

CONTEXT SWITCH:
  When CPU switches P1 → P2:
  1. Save P1's registers into P1's PCB
  2. Load P2's registers from P2's PCB
  Pure overhead — no useful work done during switch!

FORK():
  pid = fork()      // creates copy of current process
  if pid == 0:
    child process code
  else:
    parent process code`,
      },
      {
        title: "Ch 3 — Threads",
        content: `THREADS & CONCURRENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A thread is a lightweight unit of execution within a process.
Multiple threads share the same process memory.

PROCESS vs THREAD:
  Process: separate memory space, slower context switch
  Thread:  shared memory, faster context switch

THREAD COMPONENTS:
→ Thread ID
→ Program Counter (PC)
→ Register set
→ Stack (each thread has its own!)

SHARED BETWEEN THREADS:
→ Code section
→ Data section (heap, globals)
→ Open files

BENEFITS OF THREADS:
→ Responsiveness (UI thread + worker thread)
→ Resource sharing (cheaper than processes)
→ Economy (thread creation faster than process)
→ Scalability (run on multiple CPU cores)

CONCURRENCY PROBLEMS:

Race Condition:
  Thread 1: reads count (=5), Thread 2: reads count (=5)
  Thread 1: writes count+1=6, Thread 2: writes count+1=6
  count = 6 (should be 7!)

Critical Section:
  Part of code that accesses shared resources.
  Must execute atomically — only one thread at a time.

MUTEX (Mutual Exclusion Lock):
  mutex.lock()
  count++          // critical section
  mutex.unlock()

DEADLOCK: Thread A waits for Thread B's lock,
          Thread B waits for Thread A's lock → stuck forever!`,
      },
      {
        title: "Ch 4 — CPU Scheduling",
        content: `CPU SCHEDULING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GOAL: maximize CPU utilization, minimize wait time.

METRICS:
→ CPU Utilization  — % time CPU is busy
→ Throughput       — processes completed per unit time
→ Turnaround Time  — submission to completion
→ Waiting Time     — time in ready queue
→ Response Time    — submission to first response

ALGORITHMS:

FCFS (First Come First Served):
  Non-preemptive. Simple. "Convoy effect" problem.
  P1(24ms), P2(3ms), P3(3ms) → avg wait = 17ms

SJF (Shortest Job First):
  Non-preemptive. Minimum avg wait time (optimal).
  Problem: can't know future burst time exactly.

SRTF (Shortest Remaining Time First):
  Preemptive SJF. On new arrival, preempt if shorter.

ROUND ROBIN (RR):
  Each process gets time quantum q (e.g. 10ms).
  Preempt after q → move to end of ready queue.
  q too large → FCFS. q too small → too many switches.
  Best: q > 80% of CPU bursts.

PRIORITY SCHEDULING:
  Highest priority runs first.
  Problem: Starvation — low priority never runs!
  Solution: Aging — increase priority over time.

MULTILEVEL QUEUE:
  Separate queues for different process types.
  Foreground (interactive) → Round Robin
  Background (batch) → FCFS`,
      },
      {
        title: "Ch 5 — Deadlocks",
        content: `DEADLOCKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deadlock = set of processes permanently blocked,
each waiting for a resource held by another.

4 NECESSARY CONDITIONS (Coffman, 1971):
  ALL FOUR must hold for deadlock to occur.

  1. Mutual Exclusion
     Resource held in non-sharable mode.

  2. Hold & Wait
     Process holds ≥1 resource while waiting for more.

  3. No Preemption
     Resources only released voluntarily.

  4. Circular Wait
     P1 → waits for P2 → waits for P3 → waits for P1

HANDLING DEADLOCKS:

PREVENTION — eliminate one condition:
→ Circular Wait: always request resources in fixed order!
→ Hold & Wait: request ALL resources before starting
→ No Preemption: force-release if can't get all needed

AVOIDANCE — Banker's Algorithm:
  Before granting resource, check if system stays safe.
  Safe state = exists sequence where all can finish.

DETECTION + RECOVERY:
  Detection: Resource Allocation Graph — look for cycles
  Recovery:
  → Terminate one deadlocked process
  → Preempt resources from a process

OSTRICH ALGORITHM:
  Ignore the problem and hope it doesn't happen.
  Used by most real OS (rare events, costly prevention)!`,
      },
      {
        title: "Ch 6 — Memory Management",
        content: `MEMORY MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OS must allocate memory to processes and manage it.

LOGICAL vs PHYSICAL ADDRESS:
  Logical Address: generated by CPU (virtual)
  Physical Address: actual RAM location
  MMU (Memory Management Unit) translates between them

CONTIGUOUS ALLOCATION:
  Each process gets a single contiguous block.
  External Fragmentation: free holes scattered around.
  Solution: Compaction (expensive!)

PAGING:
  Physical memory → frames (fixed size, e.g. 4KB)
  Logical memory  → pages (same size as frames)
  Page Table maps: page number → frame number

  Logical Address = Page Number + Offset
  Physical Address = Frame Number + Offset

  Benefits:
  → No external fragmentation!
  → Process doesn't need contiguous physical memory

  Cost: extra memory access for page table
  Solution: TLB (Translation Lookaside Buffer) — cache for page table

SEGMENTATION:
  Divide memory by logical units (code, stack, heap).
  Each segment has base + limit registers.
  External fragmentation still possible.

VIRTUAL MEMORY:
  Programs can use more memory than physically available.
  Inactive pages stored on disk (swap space).
  Only needed pages kept in RAM.`,
      },
      {
        title: "Ch 7 — Virtual Memory",
        content: `VIRTUAL MEMORY & PAGING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Virtual memory: run programs larger than physical RAM.
Uses disk as extension of RAM.

DEMAND PAGING:
  Only load pages when actually needed.
  Lazy evaluation — don't load what you don't use.

PAGE FAULT (when accessed page not in RAM):
  1. CPU generates logical address
  2. Page table shows page NOT in RAM (valid bit = 0)
  3. Page fault trap to OS
  4. OS finds free frame (or evicts one)
  5. Load page from disk into free frame
  6. Update page table (valid bit = 1)
  7. Restart faulted instruction

PAGE REPLACEMENT ALGORITHMS:

FIFO (First In First Out):
  Replace oldest page in memory.
  Simple. Belady's Anomaly: more frames → more faults!

OPT (Optimal):
  Replace page not used for LONGEST time in future.
  Optimal (min page faults). Not practical (need future knowledge).

LRU (Least Recently Used):
  Replace page not used for longest time in PAST.
  Best practical algorithm.
  Implementation: counter or stack.

LRU APPROXIMATION (Clock Algorithm):
  Each page has reference bit.
  On fault: scan pages, give second chance if bit=1.
  Replace first page with bit=0.
  Used by Linux and Windows!

THRASHING:
  Process spends more time paging than computing.
  Cause: too many processes, not enough frames each.
  Solution: reduce multiprogramming, use working set model.`,
      },
    ],
  },

  // ── 10. COMPUTER NETWORKS ──
  {
    id: "networks",
    cat: "os",
    emoji: "🌐",
    label: "Computer Networks",
    coverClass: "bc-2",
    sourceTag: "Open Notes",
    title: "Computer Networks — Complete Guide",
    author: "Open Courseware — CC License",
    desc: "OSI model, TCP/IP, DNS, HTTP, TCP vs UDP, subnetting.",
    chapters: [
      {
        title: "Ch 1 — OSI 7-Layer Model",
        content: `OSI 7-LAYER MODEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OSI = Open Systems Interconnection
Conceptual model for how network protocols interact.

  Layer 7 — APPLICATION
    → HTTP, FTP, SMTP, DNS, SSH, WebSocket
    → Where user applications live

  Layer 6 — PRESENTATION
    → Encryption, Compression, Encoding (ASCII, UTF-8, SSL)
    → Translate data format between systems

  Layer 5 — SESSION
    → Establish, maintain, terminate sessions
    → NetBIOS, RPC

  Layer 4 — TRANSPORT
    → TCP (reliable), UDP (fast)
    → End-to-end communication, ports, segmentation

  Layer 3 — NETWORK
    → IP addressing, routing between networks
    → Routers operate here

  Layer 2 — DATA LINK
    → MAC addresses, error detection
    → Switches, Ethernet, WiFi operate here

  Layer 1 — PHYSICAL
    → Actual bits on wire/wireless
    → Cables, fiber, radio waves, hub

MNEMONIC: "All People Seem To Need Data Processing"

ENCAPSULATION (sender side):
  App data
  + L4 header (TCP/UDP segment)
  + L3 header (IP packet)
  + L2 header+trailer (Ethernet frame)
  + L1 (bits transmitted)`,
      },
      {
        title: "Ch 2 — TCP vs UDP",
        content: `TCP vs UDP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TCP (Transmission Control Protocol):
  ✓ Connection-oriented (3-way handshake required)
  ✓ Reliable — guaranteed delivery and ordering
  ✓ Flow control (receiver controls sender speed)
  ✓ Congestion control (slows down if network busy)
  ✗ Higher overhead, slower
  USE: HTTP/HTTPS, email, file transfer, databases

  3-WAY HANDSHAKE:
    Client → SYN         "I want to connect, seq=x"
    Client ← SYN-ACK     "OK, seq=y, ack=x+1"
    Client → ACK         "Connected! ack=y+1"

  4-WAY CLOSE:
    Client → FIN         "I'm done sending"
    Client ← ACK
    Client ← FIN         "I'm done too"
    Client → ACK

UDP (User Datagram Protocol):
  ✓ Connectionless — send immediately, no handshake
  ✓ Very fast, low latency
  ✓ Lower overhead (8 byte header vs 20+ for TCP)
  ✗ No delivery guarantee
  ✗ No ordering guarantee
  ✗ No flow/congestion control
  USE: video streaming, gaming, DNS queries, VoIP, live video

WHEN TO CHOOSE:
  TCP: data integrity matters (banking, file downloads)
  UDP: speed matters, some loss acceptable (live video, games)`,
      },
      {
        title: "Ch 3 — HTTP",
        content: `HTTP — HYPERTEXT TRANSFER PROTOCOL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HTTP = application layer protocol for web communication.
Built on top of TCP.

HTTP METHODS:
  GET    → retrieve resource (safe, idempotent, no body)
  POST   → create resource (not idempotent, has body)
  PUT    → update/replace resource (idempotent)
  PATCH  → partial update
  DELETE → delete resource (idempotent)
  HEAD   → GET without response body
  OPTIONS→ check what methods are supported

STATUS CODES:
  1xx → Informational  100 Continue, 101 Switching
  2xx → Success        200 OK, 201 Created, 204 No Content
  3xx → Redirect       301 Moved Permanently, 304 Not Modified
  4xx → Client Error   400 Bad Request, 401 Unauthorized,
                       403 Forbidden, 404 Not Found
  5xx → Server Error   500 Internal Error, 503 Unavailable

IMPORTANT HEADERS:
  Content-Type: application/json
  Authorization: Bearer <token>
  Cache-Control: max-age=3600
  Accept: text/html, application/json
  Cookie: session=abc123

HTTP vs HTTPS:
  HTTP: plain text — anyone can read!
  HTTPS: encrypted with TLS/SSL — secure

HTTP VERSIONS:
  HTTP/1.0: one request per TCP connection (slow)
  HTTP/1.1: persistent connections, pipelining
  HTTP/2:   multiplexing — multiple requests in one TCP
  HTTP/3:   uses QUIC (UDP-based) — faster, less latency`,
      },
      {
        title: "Ch 4 — DNS",
        content: `DNS — DOMAIN NAME SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DNS = phonebook of the internet.
Translates domain names → IP addresses.

  "google.com" → 142.250.80.46

DNS HIERARCHY:
  Root (.)
    → .com, .org, .in, .net  (TLD — Top Level Domain)
      → google.com           (Authoritative nameserver)
        → www.google.com     (A record)

DNS RESOLUTION (recursive):
  1. Browser checks local cache
  2. OS checks hosts file (/etc/hosts)
  3. Query Recursive Resolver (ISP's DNS)
  4. Resolver asks Root Server → "who handles .com?"
  5. Root returns TLD server address
  6. Resolver asks TLD → "who handles google.com?"
  7. TLD returns Google's authoritative server
  8. Resolver asks Google's server → IP address
  9. IP cached + returned to browser

DNS RECORD TYPES:
  A     → domain → IPv4 address
  AAAA  → domain → IPv6 address
  CNAME → alias → another domain
  MX    → mail exchange server
  NS    → nameserver for domain
  TXT   → arbitrary text (SPF, verification)
  PTR   → reverse DNS (IP → domain)

TTL (Time To Live):
  How long to cache DNS result.
  Low TTL: faster propagation, more DNS queries.
  High TTL: slower propagation, fewer queries.`,
      },
      {
        title: "Ch 5 — IP Addressing",
        content: `IP ADDRESSING & SUBNETTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IPv4: 32-bit address, written as 4 octets
  192.168.1.100
  Each octet: 0-255

IPv6: 128-bit address (much larger!)
  2001:0db8:85a3:0000:0000:8a2e:0370:7334

PRIVATE IP RANGES (not routable on internet):
  10.0.0.0    – 10.255.255.255    (10.x.x.x)
  172.16.0.0  – 172.31.255.255
  192.168.0.0 – 192.168.255.255   (most home routers)

CIDR NOTATION (Classless Inter-Domain Routing):
  192.168.1.0/24
  /24 means first 24 bits are network, last 8 are host
  → 2^8 = 256 addresses (254 usable, 2 reserved)

SUBNET MASK:
  /24 → 255.255.255.0    (254 hosts)
  /25 → 255.255.255.128  (126 hosts)
  /16 → 255.255.0.0      (65534 hosts)
  /8  → 255.0.0.0        (16 million hosts)

SPECIAL ADDRESSES:
  127.0.0.1   → localhost (loopback)
  0.0.0.0     → all interfaces
  255.255.255.255 → broadcast
  x.x.x.0    → network address (reserved)
  x.x.x.255  → broadcast address (reserved)

NAT (Network Address Translation):
  Multiple private IPs share one public IP.
  Your router does this for your home network!`,
      },
    ],
  },
];
