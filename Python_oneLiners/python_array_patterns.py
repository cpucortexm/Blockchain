# Fixed Sliding Window
def fixed_sliding_window(arr: list[int], k: int) -> list[int]:
    # Sum up the first subarray and add it to the result
    curr_subarray = sum(arr[:k])
    result = [curr_subarray]
    start,end = 0, k

    # To get each subsequent subarray, add the next value in
    # the list and remove the first value
    while end < len(arr): 
        curr_subarray +=  arr[end] - arr[start] 
        result.append(curr_subarray)
        start += 1
        end += 1
    return result

print(fixed_sliding_window([1,2,3,4,5,6], 3))

# Dynamic Sliding Window
# find the shortest subarray with the sum that was greater than or 
# equal to X.
def dynamic_sliding_window(arr: list[int], x: int) -> int:
    # Track our min value
    min_length = float('inf')
 
    # The current range and sum of our sliding window
    start = 0
    end = 0
    current_sum = 0
 
    # Extend the sliding window until our criteria is met
    while end < len(arr):
        current_sum = current_sum + arr[end]
        end = end + 1
 
        # Then contract the sliding window until it
        # no longer meets our condition
        while start < end and current_sum >= x:
            current_sum = current_sum - arr[start]
            start = start + 1
 
            # Update the min_length if this is shorter
            # than the current min
            min_length = min(min_length, end-start+1)
 
    return min_length

print(dynamic_sliding_window([1,2,3,4,5,6],7))