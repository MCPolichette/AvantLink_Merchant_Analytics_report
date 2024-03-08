Alright. So what we want to do, is process a bunch of merchant IDs to determine the prioritization and identification of lost tracking based on analytic data from API reports.

Direction and scope.

1. identify and list a number of merchant IDs for an input. (start with 10)
2. Run a For Each API call
    - Performance Summary by month - last 12 months.
        - Identify when sales dropped, and run a performance summary by day for 60 days starting with the month prior to the assumed outage.
        - Graphs for YTD by month, and the PSbyDay. hoping to display the flat-lined outage.
        - identify regular averages, and guess based on Months how much money has been lost.
