-- ESTABLISHING A CONNECTION --

m = netrender.getmanager() --get a NetManager instance

 

--start this session

m.connect #manual "nimbus" 

-- OR m.connect #manual "nimbus" port:1234 --specifying a port number

 

-- QUEUE CONTROL --

--Get QueueControl using GetControl();

--there is no way to release control, but if wantControl==false

--then control will be relinquished to the next client

--that requests it

if( m.QueryControl #wait ) do --only take control if you have permission

m.getcontrol() --takes queue control

m.wantControl=true --if another client does QueryControl(), they will get a return value of false

m.Lock true  --this completely prevents others from getting queue control

m.Lock false  --others can now get control

 

-- SUBMITTING JOBS --

job = m.newjob file:"c:\\share\\test.max"

job.suspended = true --jobs can be submitted as suspended

job.state    --should be unsubmitted

job.includeMaps = true --turn on "Include Maps"

srv_list = m.getservers() --get the server list to assign to the job

 

job.submit servers:srv_list --specify which servers to use for the job

-- job.submit() --this uses all servers for the job

 

 

-- GETTING JOBS & SERVER OBJECTS --

m.SetUpdates false --lock the queue, to make sure nothing changes while you download info

j = m.getjobs filter:#suspended --an array of NetJob objects; filters are optinal

s = m.getservers filter:#idle --an array of NetServer objects; filters are optinal

--see below for other filters... there are many

m.SetUpdates true --be sure to unlock the queue!

 

 

-- WORKING WITH GROUPS --

m.creategroup s "myGroup"  --takes an array of NetServers and a name

 

num_groups = m.numGroups  --total number of groups

size_group1 = m.SizeofGroup 1 --number of servers in the first group

g = m.getservers filter:#group key:1 --an array of the servers for group 1

g = m.getservers filter:#group key:"myGroup" --an array of the servers for group "myGroup"

g_name = m.GetGroupName 1  --the name of the first group

m.deletegroup g_name   --delete a group

 

 

 

-- WORKING WITH JOBS --

job = j[1]    --pull a job out of the list

 

jHandle = job.handle   --the job's ID

p = job.priority   --job's priority

if job.nonSeqFrames==True then

 frames = job.frames  --one of those "1,3,5-12" frame lists

else

 frames = (job.fromFrame as string) + "-" + (job.toFrame as string)

 --now frames is "0-100" if 0 and 100 are the start/end frames

cameraArray = job.GetCameras() --an array of the camera names

l = job.GetLog    --the entire log, as text

l = job.GetLog start:4 numLines:2 --gets the 4th and 5th entries of the log

 

statText = job.GetServerStatusText s[1] --text about a server, regarding this job

num_workers = job.numServers --number of servers on this job

job.frameOutputName = "d:\\blah.bmp" --change the output name

isDevice = job.frameOutputDevice  --true if the output is to a device, false otherwise

share = job.managerShare  --the manager share for this job

job.filesize    --size of the MAZ file for the job

job.filesizeextracted  --extracted sisze of the MAZ file for the job

 

-- WORKING WITH SERVERS --

srv = s[1]    --pull a server out of the list

sHandle = srv.Handle   --the server's ID

sName = srv.name   --the server's machine name

speed = srv.performance  --server's performance index

srv.ResetPerformance()  --reset the index

timeUsed = srv.totalTime  --total time spent rendering

sjHandle = srv.jobHandle  --the handle of the server's current job, 0 if none

sjFrameIndex = srv.jobFrameIndex --the index of the frame the server is rendering

 

--PRACTICAL EXAMPLE; get info about the frame being rendered

sjHandle = srv.jobHandle

sjIndex = srv.jobFrameIndex

sJobs = m.getJobs filter:job key:sjHandle --should be an array with one entry

frameInfo = (sJobs[1].getFrameInfo sjIndex) --get info about the current frame

frameTime = frameInfo.elapsedTime

 

-- UPDATES FROM MANAGER --

--Jobs and Servers support GetUpdate and SendUpdate functions,

-- for synchronizing with the manager

job.status  --should be busy

 

job.Suspend()

job.status  --still says busy (status value is stale)

job.GetUpdate() --download the latest news

job.status  --now says suspended

s[1].GetUpdate() --servers also have Get/SendUpdate

 

-- CALLBACKS --

-- These are used to listen for messages from the manager,

-- They are functions you can define, that will get called when

-- the manager has something to say

 

-- There are 6 possible callbacks

-- NOTE: you can name these functions anything you want, but they must have correct paramters

 

--NETPROGRESS CALLBACK; Called anytime a download/upload is underway,

-- including anytime you fetch information about jobs or servers

fn myNetProgress total current = --NOTE: two integer parameters

format "Progress: completed % out of %\n" current total

 

--NETMESSAGE CALLBACK; Called when the manager has a text message for the user

fn myNetMessage msg = --NOTE: one string parameter

 format "Message: %\n" msg

 

--UPDATE CALLBACK; Called when something has changed, like a job started or finished

 

-- Let's you know when you need to make GetUpdate calls, or other refreshing

fn myUpdate =

job.GetUpdate() --example of what you might do

 

--MANAGERDOWN CALLBACK; Called when the manager dies

fn myManagerDown =

format "Manager is dead\n"

 

--QUEUECONTROL CALLBACK; Called whenever queue control changes

fn myQueueControl =

format "Queue control has changed\n"

 

--QUERYCONTROL CALLBACK; Called when you have Queue Control, and another computer wants it

 

fn myQueryControl clientName = (  --NOTE: one string parameter

format "The computer % wants queue control" clientName

m.wantControl = true -- use this to keep queue control

m.wantControl = false -- use this to release queue control

)

 

--INSTALLING THE CALLBACKS; after you define the functions, you must give them to the

-- manager as follows

--NOTE: only one callback of each type is allowed (e.g., you can't have two "Update" callbacks)

m.setcallback #Progress myNetProgress --install the "Progress" callback

 

m.setcallback #Message myNetMessage --install the "Message" callback

m.setcallback #Update myUpdate --install the "Update" callback

m.setcallback #ManagerDown myManagerDown --install the "ManagerDown" callback

m.setcallback #QueueControl myQueueControl --install the "QueueControl" callback

m.setcallback #QueryControl myQueryControl --install the "QueryControl" callback

 

-- NETSTATUS OBJECTS --

--Read-only information about a computer on the network

 

stat = s[1].netStatus --get network info about server 1

stat.boottime   --make a query

stat.Disks   --

d = stat.workDisk  --which is the disk for net-rendering work?

stat.SpaceOnDisk d  --megabytes of free space on the workdisk

stat.memorySize  --computer's memory in bytes (note: 1 meg = 1048576 bytes)

s[1].GetUpdate()  --this refreshes the netStatus object

 

stat = m.netStatus  --manager also has a NetStatus

--NOTE: Manager has no GetUpdate(), you must fetch the NetStatus again to see any changes

 

--To print out the operating system on the machine...

--Win95 has a platformID of 1; WinNT has a platformID of 2

--Win2K is indicated by a majorBuild of 5 or more for WinNT

--Win98 is indicated by a minorBuild greater than 0 for Win95.

-- Also, build number and the CSDVersion string are not supported by Win95/98

format "Windows %.%, Build %, %\n" \

stat.majorVersion stat.minorVersion stat.buildNumber stat.CSDVersion

 

-- JOBFRAME OBJECTS --

num_frames = job.numFrames()

 

frame = job.getFrameInfo 1 --get info about the 1st frame

elapsed_time = frame.ElapsedTime --amount of time frame has been rendering

 

num_rendElems = job.numRenderElements() --number of render elements for render

if num_rendElems>0 do (

rendElem = job.GetRenderElement 1 --pass the index of the element

rendElem.enabled = false   --turn off the rend element

job.SetRenderElement 1 rendElem  --update the job with the new changes

job.SendUpdate()     --upload the changes

)

 

-- JOBSERVER OBJECTS --

--Read-only information about a server, in relation to a particular job

j_num_servers = j[1].numServers  --how many servers does the job have?

js = j[1].GetServerInfo 1   --info about the job's first server

sh = js.serverHandle    --what's the server's handle?

sn = js.serverName    --what's the server's name?

isWorker = js.active    --whether this server participates in this job

js_state = js.state    --is the server busy with the job? has an error? etc

 

--Print out some stats

format "rendering frame %, completed %, total time % hours\n" \

js.currentFrame js.numFramesComplete js.elapsedTime

 

--ways to get more info about this server...

jSrv = m.GetServers filter:#handle key:sh --get the actual server object

statText = j[1].GetServerStatusText jSrv[1] --text info from the server about this job

 

-- RENDERELEMENT OBJECTS --

--Information about particular render elements for a job

n = j[1].numRenderElements    --how many render elements for this job?

 

re = j[1].GetRenderElement 1   --get the first one

re.enabled = false      --disable it

re.filterEnabled = false    --disable filtering

re.name = "newName"      --change its name

useShadows = re.shadowsApplied   --are shadows applied? (read-only)

useShadows = re.atmosphereApplied  --are atmospherics applied (read-only)

re.output = "C:\\share\\rendElem1.bmp" --change its output path & name

j[1].SetRenderElement 1 re    --update the job with the new changes

 

j[1].SendUpdate       --upload the changes

 

-- WEEKLY SCHEDULES --

-- a servers' weekly schedule is an array of seven BitArrays;

-- Each bitArray is a day, each bit is an hour

sched = s[1].schedule

sched[1][11] = false --sunday 11am, the server will not work

sched[1][12] = false  -- same for sunday noon

s[1].attendedPriority = 60  --set the priorities for the server's schedule

s[1].unattendedPriority = 10

s[1].schedule = sched --set the new schedule

s[1].schedule    --printout to prove the change worked

s[1].SendUpdate()  --upload the changes to this server

--NOTE: a Schedule is just a BitArray and has no GetUpdate,

--you must fetch it again from the server to see any changes

 

-- MISCELANEOUS FUNCTIONS --

jobList = #( j[3], j[1], j[2] ) --make an array of some jobs

m.SetJobOrder jobList  --rearrange the jobs; e.g. j[3] is now the first in the queue

mName = (m.netStatus).computerName --the machine name of the manager

 

-- JOB & SERVER FILTERS --

jobServers = m.getservers filter:#Job key:j[1]

groupServers = m.getservers filter:#group key:"Clouds"

 

-- ENDING THE SEESION --

m.wantControl=true --other clients can now get QueueControl

 

m.disconnect()  --end this session

-- m.kill()  --brings down the manager, (would need queue control)