import os, time
import sys

# Enforce stream video id as argument
if len(sys.argv) < 2:
    print("You must add the stream Id as argument.")
    sys.exit(1)

video_id = sys.argv[1]

while 1:
    os.system("python livestream-yt.py " + str(video_id))
    print ("Restarting...")
    time.sleep(120) # 200ms to CTR+C twice
