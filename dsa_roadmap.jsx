import { useState, useEffect, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const PLATFORMS = {
  leetcode:   { label:"LeetCode",   color:"#FFA116", bg:"rgba(255,161,22,0.12)" },
  hackerrank: { label:"HackerRank", color:"#00EA64", bg:"rgba(0,234,100,0.10)" },
  hackerearth:{ label:"HackerEarth",color:"#44B1F4", bg:"rgba(68,177,244,0.10)" },
  codechef:   { label:"CodeChef",   color:"#FF7043", bg:"rgba(255,112,67,0.10)" },
};
const DC = { easy:"#4ade80", medium:"#fb923c", hard:"#f87171" };

const PHASES = [
  {id:0,  title:"Programming Basics",    desc:"Logic building without DSA — the correct start point"},
  {id:1,  title:"Arrays & Strings",      desc:"Core data manipulation, sliding window, two pointers"},
  {id:2,  title:"Recursion",             desc:"Thinking recursively before you tackle divide & conquer"},
  {id:3,  title:"Sorting & Searching",   desc:"Classic O(n log n) algorithms and binary search variants"},
  {id:4,  title:"Linked Lists",          desc:"Pointer manipulation, fast-slow pointers"},
  {id:5,  title:"Stacks & Queues",       desc:"Monotonic stacks, deque, and their killer applications"},
  {id:6,  title:"Hashing",              desc:"HashMap patterns for O(1) lookups and prefix sums"},
  {id:7,  title:"Trees & BST",          desc:"Traversals, BST properties, level-order, path problems"},
  {id:8,  title:"Heaps",                desc:"Priority queues, two-heap pattern, k-way merge"},
  {id:9,  title:"Greedy",               desc:"Local optimal choices that build globally optimal solutions"},
  {id:10, title:"Dynamic Programming",  desc:"Memoization, tabulation, classic DP patterns"},
  {id:11, title:"Graphs",               desc:"BFS, DFS, Union Find, Dijkstra, Topological Sort"},
  {id:12, title:"Hard Problems",        desc:"Placement interview killers — crack these and you're placed"},
];

const P = [
  // ── Phase 0 ──────────────────────────────────────────────────────────────
  {id:"p0_1", phase:0,title:"FizzBuzz",                          platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/fizz-buzz/"},
  {id:"p0_2", phase:0,title:"Palindrome Number",                 platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/palindrome-number/"},
  {id:"p0_3", phase:0,title:"Reverse Integer",                   platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/reverse-integer/"},
  {id:"p0_4", phase:0,title:"Power of Two",                      platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/power-of-two/"},
  {id:"p0_5", phase:0,title:"Fibonacci Number",                  platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/fibonacci-number/"},
  {id:"p0_6", phase:0,title:"Armstrong Number",                  platform:"codechef",   difficulty:"easy",  url:"https://www.codechef.com/problems/ARMS"},
  {id:"p0_7", phase:0,title:"GCD & LCM",                         platform:"codechef",   difficulty:"easy",  url:"https://www.codechef.com/problems/FLOW016"},
  {id:"p0_8", phase:0,title:"Staircase Pattern",                 platform:"hackerrank", difficulty:"easy",  url:"https://www.hackerrank.com/challenges/staircase/problem"},
  {id:"p0_9", phase:0,title:"Count Digits in Number",            platform:"hackerearth",difficulty:"easy",  url:"https://www.hackerearth.com/practice/basic-programming/input-output/basics-of-input-output/practice-problems/"},
  {id:"p0_10",phase:0,title:"Sum of Digits",                     platform:"hackerrank", difficulty:"easy",  url:"https://www.hackerrank.com/challenges/30-running-time-and-complexity/problem"},
  // ── Phase 1 ──────────────────────────────────────────────────────────────
  {id:"p1_1", phase:1,title:"Two Sum",                           platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/two-sum/"},
  {id:"p1_2", phase:1,title:"Best Time to Buy & Sell Stock",     platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"},
  {id:"p1_3", phase:1,title:"Contains Duplicate",                platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/contains-duplicate/"},
  {id:"p1_4", phase:1,title:"Maximum Subarray (Kadane's)",       platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/maximum-subarray/"},
  {id:"p1_5", phase:1,title:"Move Zeroes",                       platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/move-zeroes/"},
  {id:"p1_6", phase:1,title:"Rotate Array",                      platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/rotate-array/"},
  {id:"p1_7", phase:1,title:"Missing Number",                    platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/missing-number/"},
  {id:"p1_8", phase:1,title:"Reverse String",                    platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/reverse-string/"},
  {id:"p1_9", phase:1,title:"Valid Anagram",                     platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/valid-anagram/"},
  {id:"p1_10",phase:1,title:"Longest Common Prefix",             platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/longest-common-prefix/"},
  {id:"p1_11",phase:1,title:"Array Left Rotation",               platform:"hackerrank", difficulty:"easy",  url:"https://www.hackerrank.com/challenges/array-left-rotation/problem"},
  {id:"p1_12",phase:1,title:"2D Array Hourglass Sum",            platform:"hackerrank", difficulty:"easy",  url:"https://www.hackerrank.com/challenges/2d-array/problem"},
  // ── Phase 2 ──────────────────────────────────────────────────────────────
  {id:"p2_1", phase:2,title:"Climbing Stairs",                   platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/climbing-stairs/"},
  {id:"p2_2", phase:2,title:"Recursive Digit Sum",               platform:"hackerrank", difficulty:"medium",url:"https://www.hackerrank.com/challenges/recursive-digit-sum/problem"},
  {id:"p2_3", phase:2,title:"Generate Parentheses",              platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/generate-parentheses/"},
  {id:"p2_4", phase:2,title:"Subsets",                           platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/subsets/"},
  {id:"p2_5", phase:2,title:"Permutations",                      platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/permutations/"},
  {id:"p2_6", phase:2,title:"Letter Combinations of Phone No.",  platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/letter-combinations-of-a-phone-number/"},
  {id:"p2_7", phase:2,title:"Combination Sum",                   platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/combination-sum/"},
  // ── Phase 3 ──────────────────────────────────────────────────────────────
  {id:"p3_1", phase:3,title:"Binary Search",                     platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/binary-search/"},
  {id:"p3_2", phase:3,title:"Search Insert Position",            platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/search-insert-position/"},
  {id:"p3_3", phase:3,title:"Find Min in Rotated Sorted Array",  platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/"},
  {id:"p3_4", phase:3,title:"Search in Rotated Sorted Array",    platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/search-in-rotated-sorted-array/"},
  {id:"p3_5", phase:3,title:"Kth Largest Element in Array",      platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/kth-largest-element-in-an-array/"},
  {id:"p3_6", phase:3,title:"Sort Colors (Dutch National Flag)", platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/sort-colors/"},
  {id:"p3_7", phase:3,title:"Merge Sort Practice",               platform:"hackerearth",difficulty:"medium",url:"https://www.hackerearth.com/practice/algorithms/sorting/merge-sort/tutorial/"},
  {id:"p3_8", phase:3,title:"Count Inversions",                  platform:"codechef",   difficulty:"medium",url:"https://www.codechef.com/problems/INVCNT"},
  {id:"p3_9", phase:3,title:"Running Median",                    platform:"hackerrank", difficulty:"hard",  url:"https://www.hackerrank.com/challenges/find-the-running-median/problem"},
  // ── Phase 4 ──────────────────────────────────────────────────────────────
  {id:"p4_1", phase:4,title:"Reverse Linked List",               platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/reverse-linked-list/"},
  {id:"p4_2", phase:4,title:"Merge Two Sorted Lists",            platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/merge-two-sorted-lists/"},
  {id:"p4_3", phase:4,title:"Linked List Cycle Detection",       platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/linked-list-cycle/"},
  {id:"p4_4", phase:4,title:"Remove Nth Node From End",          platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/remove-nth-node-from-end-of-list/"},
  {id:"p4_5", phase:4,title:"Middle of Linked List",             platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/middle-of-the-linked-list/"},
  {id:"p4_6", phase:4,title:"Palindrome Linked List",            platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/palindrome-linked-list/"},
  {id:"p4_7", phase:4,title:"Add Two Numbers",                   platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/add-two-numbers/"},
  {id:"p4_8", phase:4,title:"Intersection of Two Linked Lists",  platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/intersection-of-two-linked-lists/"},
  {id:"p4_9", phase:4,title:"Insert Node at Specific Position",  platform:"hackerrank", difficulty:"easy",  url:"https://www.hackerrank.com/challenges/insert-a-node-at-a-specific-position-in-a-linked-list/problem"},
  // ── Phase 5 ──────────────────────────────────────────────────────────────
  {id:"p5_1", phase:5,title:"Valid Parentheses",                 platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/valid-parentheses/"},
  {id:"p5_2", phase:5,title:"Min Stack",                         platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/min-stack/"},
  {id:"p5_3", phase:5,title:"Daily Temperatures",                platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/daily-temperatures/"},
  {id:"p5_4", phase:5,title:"Next Greater Element I",            platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/next-greater-element-i/"},
  {id:"p5_5", phase:5,title:"Evaluate Reverse Polish Notation",  platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/evaluate-reverse-polish-notation/"},
  {id:"p5_6", phase:5,title:"Implement Queue using Stacks",      platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/implement-queue-using-stacks/"},
  {id:"p5_7", phase:5,title:"Sliding Window Maximum",            platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/sliding-window-maximum/"},
  {id:"p5_8", phase:5,title:"Largest Rectangle in Histogram",    platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/largest-rectangle-in-histogram/"},
  // ── Phase 6 ──────────────────────────────────────────────────────────────
  {id:"p6_1", phase:6,title:"Group Anagrams",                    platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/group-anagrams/"},
  {id:"p6_2", phase:6,title:"Top K Frequent Elements",           platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/top-k-frequent-elements/"},
  {id:"p6_3", phase:6,title:"Subarray Sum Equals K",             platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/subarray-sum-equals-k/"},
  {id:"p6_4", phase:6,title:"Longest Consecutive Sequence",      platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/longest-consecutive-sequence/"},
  {id:"p6_5", phase:6,title:"Find All Duplicates in Array",      platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/find-all-duplicates-in-an-array/"},
  {id:"p6_6", phase:6,title:"Ice Cream Parlor (HashMap)",        platform:"hackerrank", difficulty:"medium",url:"https://www.hackerrank.com/challenges/icecream-parlor/problem"},
  {id:"p6_7", phase:6,title:"Count Triplets",                    platform:"hackerrank", difficulty:"medium",url:"https://www.hackerrank.com/challenges/count-triplets-1/problem"},
  // ── Phase 7 ──────────────────────────────────────────────────────────────
  {id:"p7_1", phase:7,title:"Maximum Depth of Binary Tree",      platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/maximum-depth-of-binary-tree/"},
  {id:"p7_2", phase:7,title:"Symmetric Tree",                    platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/symmetric-tree/"},
  {id:"p7_3", phase:7,title:"Invert Binary Tree",                platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/invert-binary-tree/"},
  {id:"p7_4", phase:7,title:"Binary Tree Level Order Traversal", platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/binary-tree-level-order-traversal/"},
  {id:"p7_5", phase:7,title:"Validate Binary Search Tree",       platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/validate-binary-search-tree/"},
  {id:"p7_6", phase:7,title:"Lowest Common Ancestor of BST",     platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"},
  {id:"p7_7", phase:7,title:"Kth Smallest Element in BST",       platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/kth-smallest-element-in-a-bst/"},
  {id:"p7_8", phase:7,title:"Diameter of Binary Tree",           platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/diameter-of-binary-tree/"},
  {id:"p7_9", phase:7,title:"Zigzag Level Order Traversal",      platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/"},
  {id:"p7_10",phase:7,title:"Tree Height",                       platform:"hackerrank", difficulty:"easy",  url:"https://www.hackerrank.com/challenges/tree-height-of-a-binary-tree/problem"},
  // ── Phase 8 ──────────────────────────────────────────────────────────────
  {id:"p8_1", phase:8,title:"Kth Largest in a Stream",           platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/kth-largest-element-in-a-stream/"},
  {id:"p8_2", phase:8,title:"Find Median from Data Stream",      platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/find-median-from-data-stream/"},
  {id:"p8_3", phase:8,title:"Merge K Sorted Lists",              platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/merge-k-sorted-lists/"},
  {id:"p8_4", phase:8,title:"Task Scheduler",                    platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/task-scheduler/"},
  {id:"p8_5", phase:8,title:"QHEAP1 Operations",                 platform:"hackerrank", difficulty:"medium",url:"https://www.hackerrank.com/challenges/qheap1/problem"},
  // ── Phase 9 ──────────────────────────────────────────────────────────────
  {id:"p9_1", phase:9,title:"Jump Game",                         platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/jump-game/"},
  {id:"p9_2", phase:9,title:"Jump Game II",                      platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/jump-game-ii/"},
  {id:"p9_3", phase:9,title:"Gas Station",                       platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/gas-station/"},
  {id:"p9_4", phase:9,title:"Assign Cookies",                    platform:"leetcode",   difficulty:"easy",  url:"https://leetcode.com/problems/assign-cookies/"},
  {id:"p9_5", phase:9,title:"Minimum Arrows to Burst Balloons",  platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/"},
  {id:"p9_6", phase:9,title:"Activity Selection Problem",        platform:"hackerearth",difficulty:"medium",url:"https://www.hackerearth.com/practice/algorithms/greedy/basics-of-greedy-algorithms/tutorial/"},
  {id:"p9_7", phase:9,title:"Luck Balance",                      platform:"hackerrank", difficulty:"easy",  url:"https://www.hackerrank.com/challenges/luck-balance/problem"},
  // ── Phase 10 ─────────────────────────────────────────────────────────────
  {id:"p10_1", phase:10,title:"House Robber",                    platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/house-robber/"},
  {id:"p10_2", phase:10,title:"Coin Change",                     platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/coin-change/"},
  {id:"p10_3", phase:10,title:"Longest Increasing Subsequence",  platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/longest-increasing-subsequence/"},
  {id:"p10_4", phase:10,title:"Longest Common Subsequence",      platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/longest-common-subsequence/"},
  {id:"p10_5", phase:10,title:"0/1 Knapsack",                    platform:"codechef",   difficulty:"medium",url:"https://www.codechef.com/problems/0KNAPSACK"},
  {id:"p10_6", phase:10,title:"Word Break",                      platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/word-break/"},
  {id:"p10_7", phase:10,title:"Partition Equal Subset Sum",      platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/partition-equal-subset-sum/"},
  {id:"p10_8", phase:10,title:"Unique Paths",                    platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/unique-paths/"},
  {id:"p10_9", phase:10,title:"Edit Distance",                   platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/edit-distance/"},
  {id:"p10_10",phase:10,title:"Matrix Chain Multiplication",     platform:"hackerearth",difficulty:"hard",  url:"https://www.hackerearth.com/practice/algorithms/dynamic-programming/introduction-to-dynamic-programming-1/tutorial/"},
  {id:"p10_11",phase:10,title:"Maximum Product Subarray",        platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/maximum-product-subarray/"},
  // ── Phase 11 ─────────────────────────────────────────────────────────────
  {id:"p11_1", phase:11,title:"Number of Islands",               platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/number-of-islands/"},
  {id:"p11_2", phase:11,title:"Clone Graph",                     platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/clone-graph/"},
  {id:"p11_3", phase:11,title:"Course Schedule (Topological)",   platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/course-schedule/"},
  {id:"p11_4", phase:11,title:"Pacific Atlantic Water Flow",     platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/pacific-atlantic-water-flow/"},
  {id:"p11_5", phase:11,title:"Word Ladder (BFS)",               platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/word-ladder/"},
  {id:"p11_6", phase:11,title:"Accounts Merge (Union Find)",     platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/accounts-merge/"},
  {id:"p11_7", phase:11,title:"Dijkstra's Shortest Path",        platform:"hackerearth",difficulty:"medium",url:"https://www.hackerearth.com/practice/algorithms/graphs/shortest-path-algorithms/tutorial/"},
  {id:"p11_8", phase:11,title:"Floyd Warshall All Pairs",        platform:"codechef",   difficulty:"medium",url:"https://www.codechef.com/problems/GDISTANC"},
  {id:"p11_9", phase:11,title:"BFS Shortest Reach",              platform:"hackerrank", difficulty:"medium",url:"https://www.hackerrank.com/challenges/bfsshortreach/problem"},
  {id:"p11_10",phase:11,title:"Redundant Connection",            platform:"leetcode",   difficulty:"medium",url:"https://leetcode.com/problems/redundant-connection/"},
  {id:"p11_11",phase:11,title:"Bellman Ford Negative Cycles",    platform:"hackerearth",difficulty:"hard",  url:"https://www.hackerearth.com/practice/algorithms/graphs/shortest-path-algorithms/tutorial/"},
  // ── Phase 12 ─────────────────────────────────────────────────────────────
  {id:"p12_1", phase:12,title:"Trapping Rain Water",             platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/trapping-rain-water/"},
  {id:"p12_2", phase:12,title:"N-Queens",                        platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/n-queens/"},
  {id:"p12_3", phase:12,title:"Median of Two Sorted Arrays",     platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/median-of-two-sorted-arrays/"},
  {id:"p12_4", phase:12,title:"Minimum Window Substring",        platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/minimum-window-substring/"},
  {id:"p12_5", phase:12,title:"Serialize & Deserialize Binary Tree",platform:"leetcode",difficulty:"hard",  url:"https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"},
  {id:"p12_6", phase:12,title:"Word Search II (Trie + Backtrack)",platform:"leetcode",  difficulty:"hard",  url:"https://leetcode.com/problems/word-search-ii/"},
  {id:"p12_7", phase:12,title:"Burst Balloons (Interval DP)",    platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/burst-balloons/"},
  {id:"p12_8", phase:12,title:"Longest Valid Parentheses",       platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/longest-valid-parentheses/"},
  {id:"p12_9", phase:12,title:"Russian Doll Envelopes",          platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/russian-doll-envelopes/"},
  {id:"p12_10",phase:12,title:"Maximum Frequency Stack",         platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/maximum-frequency-stack/"},
  {id:"p12_11",phase:12,title:"Sudoku Solver",                   platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/sudoku-solver/"},
  {id:"p12_12",phase:12,title:"Regular Expression Matching",     platform:"leetcode",   difficulty:"hard",  url:"https://leetcode.com/problems/regular-expression-matching/"},
];

// ─── Progress View ────────────────────────────────────────────────────────────
function ProgressView({ completed, phaseStats, dailyLog, total }) {
  const done = completed.size;
  const pct  = total > 0 ? Math.round(done / total * 100) : 0;

  const diffStats = useMemo(() => {
    const s = { easy:{t:0,d:0}, medium:{t:0,d:0}, hard:{t:0,d:0} };
    P.forEach(p => { s[p.difficulty].t++; if (completed.has(p.id)) s[p.difficulty].d++; });
    return s;
  }, [completed]);

  const pieData = [
    { name:"Easy",   value:diffStats.easy.d,   total:diffStats.easy.t,   color:"#4ade80" },
    { name:"Medium", value:diffStats.medium.d, total:diffStats.medium.t, color:"#fb923c" },
    { name:"Hard",   value:diffStats.hard.d,   total:diffStats.hard.t,   color:"#f87171" },
  ];

  const barData = phaseStats.map(ph => ({
    name: ph.title.split(" ")[0].substring(0, 9),
    done: ph.completed,
    left: ph.total - ph.completed,
  }));

  const days14 = Array.from({length:14},(_,i) => {
    const d = new Date(); d.setDate(d.getDate()-(13-i));
    const ds = d.toISOString().split("T")[0];
    return {ds, cnt:dailyLog[ds]||0, lbl:d.toLocaleDateString("en",{weekday:"short"})};
  });
  const maxDay = Math.max(...days14.map(d=>d.cnt), 1);

  let streak = 0;
  for (let i=0; i<60; i++) {
    const d=new Date(); d.setDate(d.getDate()-i);
    const ds=d.toISOString().split("T")[0];
    if (dailyLog[ds]>0) streak++;
    else if (i>0) break;
  }

  const card  = {background:"#0c0c1a",border:"1px solid #1a1a30",borderRadius:12,padding:20};
  const label = {fontSize:10,color:"#444466",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.07em",fontFamily:"JetBrains Mono,monospace"};
  const TTSTYLE = {background:"#111130",border:"1px solid #1a1a30",borderRadius:8,fontSize:12,color:"#c8d6e5"};

  return (
    <div style={{padding:"20px 24px",overflowY:"auto",height:"calc(100vh - 60px)"}}>
      {/* Stat Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        {[
          {label:"Problems Solved", val:done,   sub:`/ ${total}`,            clr:"#00e5a0"},
          {label:"Completion",      val:`${pct}%`,                           clr:"#4f8ef7"},
          {label:"Day Streak",      val:streak,  sub:" days",                clr:"#ffb347"},
          {label:"Phases Done",     val:phaseStats.filter(p=>p.completed===p.total&&p.total>0).length, sub:`/ ${PHASES.length}`, clr:"#c084fc"},
        ].map(s=>(
          <div key={s.label} style={card}>
            <div style={label}>{s.label}</div>
            <div style={{fontSize:28,fontWeight:700,color:s.clr,fontFamily:"JetBrains Mono,monospace"}}>
              {s.val}<span style={{fontSize:14,color:"#333355"}}>{s.sub||""}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
        <div style={card}>
          <div style={label}>Difficulty Breakdown</div>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
                {pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip formatter={(v,n,p)=>[`${v} / ${p.payload.total}`,n]} contentStyle={TTSTYLE}/>
              <Legend wrapperStyle={{fontSize:12,fontFamily:"JetBrains Mono,monospace"}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={card}>
          <div style={label}>14-Day Activity</div>
          <div style={{display:"flex",gap:5,alignItems:"flex-end",height:150,paddingBottom:22,paddingTop:8}}>
            {days14.map(day=>(
              <div key={day.ds} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div title={`${day.cnt} solved on ${day.ds}`}
                  style={{width:"100%",borderRadius:3,transition:"height 0.3s",
                    height: Math.max(day.cnt/maxDay*110, day.cnt>0?6:3),
                    background: day.cnt>0 ? `rgba(0,229,160,${0.25+day.cnt/maxDay*0.75})` : "#1a1a2e"
                  }}/>
                <div style={{fontSize:7.5,color:"#2a2a44",fontFamily:"monospace",
                  transform:"rotate(-50deg)",transformOrigin:"50% 50%",marginTop:4,whiteSpace:"nowrap"}}>
                  {day.lbl}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase Bar Chart */}
      <div style={{...card, marginBottom:20}}>
        <div style={label}>Progress by Phase</div>
        <ResponsiveContainer width="100%" height={175}>
          <BarChart data={barData} margin={{top:0,right:0,left:-28,bottom:0}}>
            <XAxis dataKey="name" tick={{fill:"#444466",fontSize:9,fontFamily:"monospace"}}/>
            <YAxis tick={{fill:"#444466",fontSize:9}}/>
            <Tooltip contentStyle={TTSTYLE}/>
            <Bar dataKey="done" stackId="a" fill="#00e5a0" name="Done"/>
            <Bar dataKey="left" stackId="a" fill="#1c1c35" name="Left" radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Phase Detail List */}
      <div style={card}>
        <div style={label}>Phase-by-Phase Breakdown</div>
        {phaseStats.map(ph=>{
          const p  = ph.total>0 ? ph.completed/ph.total : 0;
          const pc = Math.round(p*100);
          return (
            <div key={ph.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
              <div style={{width:18,fontSize:10,color:"#2a2a44",fontFamily:"monospace",flexShrink:0}}>{String(ph.id).padStart(2,"0")}</div>
              <div style={{width:165,fontSize:12.5,color:"#c8d6e5",flexShrink:0,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ph.title}</div>
              <div style={{flex:1,height:5,background:"#1a1a30",borderRadius:3,overflow:"hidden"}}>
                <div style={{width:`${pc}%`,height:"100%",background:pc===100?"#00e5a0":pc>60?"#4f8ef7":"#ffb347",transition:"width 0.4s"}}/>
              </div>
              <div style={{width:52,textAlign:"right",fontSize:11,color:pc===100?"#00e5a0":"#444466",fontFamily:"JetBrains Mono,monospace"}}>{ph.completed}/{ph.total}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [completed, setCompleted] = useState(new Set());
  const [view,          setView]  = useState("roadmap");
  const [activePhase,   setAP]    = useState(0);
  const [fPlatform,     setFP]    = useState("all");
  const [fDiff,         setFD]    = useState("all");
  const [dailyLog,      setDL]    = useState({});
  const [loaded,        setLd]    = useState(false);

  useEffect(()=>{
    (async()=>{
      try { const r=await window.storage.get("dsa_c"); if(r) setCompleted(new Set(JSON.parse(r.value))); }catch{}
      try { const r=await window.storage.get("dsa_d"); if(r) setDL(JSON.parse(r.value)); }catch{}
      setLd(true);
    })();
  },[]);

  const toggle = useCallback(async id => {
    const today = new Date().toISOString().split("T")[0];
    setCompleted(prev=>{
      const nxt=new Set(prev); const wasOn=nxt.has(id);
      wasOn ? nxt.delete(id) : nxt.add(id);
      window.storage.set("dsa_c",JSON.stringify([...nxt])).catch(()=>{});
      if (!wasOn) {
        setDL(dl=>{ const ndl={...dl,[today]:(dl[today]||0)+1}; window.storage.set("dsa_d",JSON.stringify(ndl)).catch(()=>{}); return ndl; });
      }
      return nxt;
    });
  },[]);

  const phaseStats = useMemo(()=>PHASES.map(ph=>{
    const probs=P.filter(p=>p.phase===ph.id);
    return {...ph, total:probs.length, completed:probs.filter(p=>completed.has(p.id)).length};
  }),[completed]);

  const visible = useMemo(()=>P.filter(p=>{
    if (p.phase!==activePhase) return false;
    if (fPlatform!=="all" && p.platform!==fPlatform) return false;
    if (fDiff!=="all" && p.difficulty!==fDiff) return false;
    return true;
  }),[activePhase,fPlatform,fDiff]);

  const totalDone=completed.size, total=P.length;
  const ph=phaseStats[activePhase];
  const phPct=ph.total>0?Math.round(ph.completed/ph.total*100):0;

  if (!loaded) return (
    <div style={{background:"#08080f",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#00e5a0",fontFamily:"monospace",fontSize:13}}>
      initializing tracker<span style={{animation:"blink 1s step-end infinite"}}>_</span>
    </div>
  );

  return (
    <div style={{background:"#08080f",minHeight:"100vh",color:"#c8d6e5",fontFamily:"Manrope,sans-serif",fontSize:14}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:#1e1e3a;border-radius:10px}
        .ph-item:hover{background:rgba(0,229,160,0.04)!important}
        .pr-row:hover{background:#0f0f1e!important}
        @keyframes blink{50%{opacity:0}}
      `}</style>

      {/* ── Header ── */}
      <header style={{background:"#0c0c1a",borderBottom:"1px solid #16162a",padding:"0 22px",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:32,height:32,background:"linear-gradient(135deg,#00e5a0,#4f8ef7)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⌨</div>
          <div>
            <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:14,fontWeight:600,color:"#fff",letterSpacing:1.5}}>DSA ROADMAP</div>
            <div style={{fontSize:9.5,color:"#2a2a44",fontFamily:"JetBrains Mono,monospace",letterSpacing:1}}>PLACEMENT PREP · {totalDone}/{total} SOLVED</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{height:4,width:110,background:"#16162a",borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.round(totalDone/total*100)}%`,background:"linear-gradient(90deg,#00e5a0,#4f8ef7)",transition:"width 0.4s"}}/>
            </div>
            <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:12,color:"#00e5a0",minWidth:36}}>{Math.round(totalDone/total*100)}%</span>
          </div>
          <div style={{display:"flex",background:"#111128",borderRadius:8,padding:3,gap:2}}>
            {["roadmap","progress"].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"4px 13px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"Manrope,sans-serif",background:view===v?"#1e1e42":"transparent",color:view===v?"#00e5a0":"#3a3a5a",transition:"all 0.2s",letterSpacing:0.8}}>
                {v.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {view==="roadmap" ? (
        <div style={{display:"flex",height:"calc(100vh - 58px)"}}>
          {/* ── Sidebar ── */}
          <aside style={{width:205,background:"#0c0c1a",borderRight:"1px solid #16162a",overflowY:"auto",padding:"10px 7px",flexShrink:0}}>
            {phaseStats.map(phs=>{
              const p=phs.total>0?phs.completed/phs.total:0;
              const isA=activePhase===phs.id, isDone=p===1&&phs.total>0;
              return (
                <div key={phs.id} className="ph-item" onClick={()=>setAP(phs.id)}
                  style={{padding:"9px 10px",borderRadius:8,cursor:"pointer",marginBottom:3,
                    border:`1px solid ${isA?"rgba(0,229,160,0.15)":"transparent"}`,
                    background:isA?"rgba(0,229,160,0.06)":"transparent",transition:"all 0.15s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                    <div style={{fontSize:10.5,fontWeight:600,fontFamily:"JetBrains Mono,monospace",color:isA?"#00e5a0":isDone?"rgba(0,229,160,0.5)":"#4a4a6a",lineHeight:1.3,flex:1}}>
                      <span style={{color:"#252540",marginRight:5}}>{String(phs.id).padStart(2,"0")}</span>{phs.title}
                    </div>
                    {isDone&&<span style={{fontSize:11,color:"#00e5a0",marginLeft:4}}>✓</span>}
                  </div>
                  <div style={{height:2,background:"#16162a",borderRadius:2,overflow:"hidden"}}>
                    <div style={{width:`${Math.round(p*100)}%`,height:"100%",background:isDone?"#00e5a0":"#4f8ef7",transition:"width 0.3s"}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                    <span style={{fontSize:8.5,color:"#252540",fontFamily:"monospace"}}>{phs.completed}/{phs.total}</span>
                    {isA&&<span style={{fontSize:8.5,color:"#4f8ef7",fontFamily:"monospace"}}>{Math.round(p*100)}%</span>}
                  </div>
                </div>
              );
            })}
          </aside>

          {/* ── Main ── */}
          <main style={{flex:1,overflowY:"auto",padding:"18px 22px"}}>
            {/* Phase Header */}
            <div style={{marginBottom:16,paddingBottom:14,borderBottom:"1px solid #16162a"}}>
              <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:3}}>
                <h1 style={{fontSize:19,fontWeight:700,color:"#fff"}}>Phase {activePhase}: {ph.title}</h1>
                <span style={{fontSize:11,color:"#2a2a44",fontFamily:"JetBrains Mono,monospace"}}>{ph.completed}/{ph.total} · {phPct}%</span>
              </div>
              <div style={{fontSize:12,color:"#444466",marginBottom:9}}>{PHASES[activePhase].desc}</div>
              <div style={{height:4,background:"#16162a",borderRadius:2,overflow:"hidden"}}>
                <div style={{width:`${phPct}%`,height:"100%",background:phPct===100?"#00e5a0":"linear-gradient(90deg,#4f8ef7,#00e5a0)",transition:"width 0.5s"}}/>
              </div>
            </div>

            {/* Filters */}
            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:9,color:"#2a2a44",fontFamily:"monospace",letterSpacing:1}}>PLATFORM</span>
              {["all","leetcode","hackerrank","hackerearth","codechef"].map(pl=>(
                <button key={pl} onClick={()=>setFP(pl)} style={{padding:"3px 9px",borderRadius:20,border:"none",cursor:"pointer",fontSize:10.5,fontWeight:700,fontFamily:"Manrope,sans-serif",
                  background:fPlatform===pl?(pl==="all"?"#00e5a0":PLATFORMS[pl].color):"#111128",
                  color:fPlatform===pl?"#000":"#444466",transition:"all 0.15s"}}>
                  {pl==="all"?"All":PLATFORMS[pl].label}
                </button>
              ))}
              <div style={{width:1,height:14,background:"#1a1a30",margin:"0 3px"}}/>
              <span style={{fontSize:9,color:"#2a2a44",fontFamily:"monospace",letterSpacing:1}}>DIFF</span>
              {["all","easy","medium","hard"].map(d=>(
                <button key={d} onClick={()=>setFD(d)} style={{padding:"3px 9px",borderRadius:20,border:"none",cursor:"pointer",fontSize:10.5,fontWeight:700,fontFamily:"Manrope,sans-serif",
                  background:fDiff===d?(d==="all"?"#fff":DC[d]):"#111128",
                  color:fDiff===d?"#000":"#444466",transition:"all 0.15s"}}>
                  {d==="all"?"All":d.charAt(0).toUpperCase()+d.slice(1)}
                </button>
              ))}
            </div>

            {/* Problem Table */}
            <div style={{background:"#0c0c1a",borderRadius:12,border:"1px solid #16162a",overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"36px 1fr 130px 86px 44px",padding:"9px 16px",background:"#101025",borderBottom:"1px solid #16162a"}}>
                {["#","Problem","Platform","Difficulty","✓"].map((h,i)=>(
                  <div key={h} style={{fontSize:9.5,fontWeight:700,color:"#2a2a44",fontFamily:"JetBrains Mono,monospace",letterSpacing:"0.07em",textAlign:i===4?"center":"left"}}>{h}</div>
                ))}
              </div>

              {visible.length===0 ? (
                <div style={{padding:"36px",textAlign:"center",color:"#2a2a44",fontFamily:"monospace",fontSize:12}}>— no problems match current filters —</div>
              ) : visible.map((prob,idx)=>{
                const dn=completed.has(prob.id), plt=PLATFORMS[prob.platform];
                return (
                  <div key={prob.id} className="pr-row" style={{display:"grid",gridTemplateColumns:"36px 1fr 130px 86px 44px",padding:"10px 16px",borderBottom:"1px solid #0d0d1c",
                    background:dn?"rgba(0,229,160,0.03)":"transparent",alignItems:"center",transition:"background 0.15s"}}>
                    <div style={{fontSize:10.5,color:"#202035",fontFamily:"monospace"}}>{idx+1}</div>
                    <div>
                      <a href={prob.url} target="_blank" rel="noopener noreferrer"
                        style={{color:dn?"rgba(0,229,160,0.4)":"#c8d6e5",fontWeight:dn?400:500,
                          textDecoration:dn?"line-through":"none",fontSize:13,lineHeight:1}}>
                        {prob.title}
                      </a>
                    </div>
                    <div>
                      <span style={{fontSize:9.5,padding:"2px 7px",borderRadius:4,background:plt.bg,color:plt.color,fontWeight:700,fontFamily:"JetBrains Mono,monospace"}}>{plt.label}</span>
                    </div>
                    <div style={{fontSize:11,fontWeight:700,color:DC[prob.difficulty],fontFamily:"JetBrains Mono,monospace",textTransform:"capitalize"}}>{prob.difficulty}</div>
                    <div style={{display:"flex",justifyContent:"center"}}>
                      <input type="checkbox" checked={dn} onChange={()=>toggle(prob.id)}
                        style={{width:15,height:15,accentColor:"#00e5a0",cursor:"pointer"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      ) : (
        <ProgressView completed={completed} phaseStats={phaseStats} dailyLog={dailyLog} total={total}/>
      )}
    </div>
  );
}
